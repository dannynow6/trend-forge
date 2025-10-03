// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT
import { NextRequest, NextResponse } from "next/server";
import {
  Agent,
  run,
  tool,
  webSearchTool,
  setDefaultOpenAIKey,
} from "@openai/agents";
// import { Readable } from "node:stream";
import { z } from "zod";

export const runtime = "nodejs";

setDefaultOpenAIKey(process.env.OPENAI_API_KEY!);

// Enable debug logging for troubleshooting
if (process.env.NODE_ENV === "development") {
  console.log("OpenAI Agents Debug Mode Enabled");
}

/**
 * AGENT IMPROVEMENTS (Based on viral-linkedin-posts.md & viral-linkedin-posts-prompt.md)
 *
 * This implementation follows OpenAI Agents SDK best practices and incorporates proven
 * LinkedIn virality strategies documented in the research files.
 *
 * KEY IMPROVEMENTS:
 *
 * 1. ALGORITHM-AWARE INSTRUCTIONS
 *    - Agents now understand LinkedIn's 2025 algorithm priorities (value over virality)
 *    - Emphasizes professional relevance, storytelling, and discussion over sales pitches
 *    - Includes critical algorithm insights: early engagement matters, native content favored, etc.
 *
 * 2. STRUCTURED WORKFLOW PHASES
 *    - Clear 5-phase workflow: Planning → Research → Hooks → Drafts → Critique
 *    - Each phase has specific deliverables and quality checks
 *    - Agents execute phases sequentially with validation
 *
 * 3. ENHANCED HOOK GENERATION
 *    - 82% of readers decide based on first 2-3 lines (research-backed)
 *    - Instructions emphasize curiosity without spoilers
 *    - Examples of high-performing hook patterns provided
 *
 * 4. TECHNICAL COMPLIANCE
 *    - Strict formatting rules: ≤250 words, short lines, white space
 *    - Hard limits: 0-3 emojis, ≤3 tags, 3-5 hashtags
 *    - Links in first comment only (algorithm penalty avoidance)
 *
 * 5. ENGAGEMENT OPTIMIZATION
 *    - Emphasis on conversation-starting CTAs (2× more engagement)
 *    - Specific posting time recommendations (Tue-Thu 7-9am or 12-2pm ET)
 *    - A/B testing options (3 alternative hooks + 3 alternative CTAs)
 *
 * 6. ENHANCED TOOLS
 *    - suggestHashtags: Intelligent broad+niche hashtag mixing
 *    - validateIdeasComplete: Ensures post ideas have all required fields
 *    - webSearchTool: Used extensively for current trends and data
 *
 * 7. VALUE-FIRST APPROACH
 *    - "Show don't tell" - stories and examples over features
 *    - Peer-to-peer tone, not corporate speak
 *    - Focus on problem-solving and lessons learned
 *
 * 8. COMPREHENSIVE CRITIQUE
 *    - 6 scoring dimensions: hook, algorithm, structure, engagement, viral factors, compliance
 *    - Identifies best variant with specific reasoning
 *    - Provides actionable improvement recommendations
 *
 * RESEARCH SOURCES:
 * - docs/viral-linkedin-posts.md: LinkedIn algorithm insights, engagement tactics
 * - docs/viral-linkedin-posts-prompt.md: Proven post structure template
 *
 * OPENAI AGENTS SDK COMPLIANCE:
 * - Uses Agent class with proper configuration
 * - Tools defined with zod schemas and clear descriptions
 * - Output types strictly typed for validation
 * - Streaming response with run() function
 * - Proper error handling and logging
 */

// --- Schemas
export const PostPlan = z.object({
  goal: z.enum(["awareness", "leadgen", "community"]),
  audience: z.string(),
  angle: z.string(),
  format: z.enum(["story", "how_to", "contrarian", "list"]),
  cta: z.string(),
  hashtagBudget: z.number().min(1).max(5),
});

export const ResearchDigest = z.object({
  bullets: z.array(z.string()).max(5),
  sources: z.array(z.string()).max(5),
});

export const HookSet = z.object({
  hooks: z
    .array(z.object({ label: z.string(), text: z.string() }))
    .min(3)
    .max(6),
});

export const PostDrafts = z.object({
  variants: z
    .array(
      z.object({
        title: z.string(),
        hook: z.string(), // First 2-3 lines for curiosity
        body: z.string(), // Complete post content ≤200 words
        cta: z.string(), // Conversation-starting question
        hashtags: z.array(z.string()).min(3).max(5),
        suggestedTags: z.array(z.string()).max(3).optional().nullable(), // @mentions
        postingTime: z.string(), // Recommended posting time
        assetSuggestion: z.string().optional().nullable(), // Visual content idea
      })
    )
    .min(1)
    .max(3),
  firstComment: z.string(),
  altHooks: z.array(z.string()).min(3).max(3).optional().nullable(), // A/B test options
  altCTAs: z.array(z.string()).min(3).max(3).optional().nullable(), // Alternative CTAs
});

export const Critique = z.object({
  bestIndex: z.number().int(),
  scores: z.object({
    hookStrength: z.number().min(1).max(10),
    algorithmOptimization: z.number().min(1).max(10),
    structureReadability: z.number().min(1).max(10),
    engagementPotential: z.number().min(1).max(10),
    viralFactors: z.number().min(1).max(10),
    technicalCompliance: z.number().min(1).max(10),
  }),
  overallScore: z.number().min(1).max(10),
  strengths: z.array(z.string()).max(3),
  improvements: z.array(z.string()).max(3),
  recommendedEdits: z.string(),
});

export const PostIdea = z.object({
  title: z.string(),
  description: z.string(),
  hook: z.string(),
  viralPotential: z.number().min(1).max(10),
  targetAudience: z.string(),
  contentType: z.enum([
    "story",
    "how_to",
    "contrarian",
    "list",
    "data_insight",
  ]),
  trendingFactors: z.array(z.string()).max(3),
});

export const PostIdeas = z.object({
  ideas: z.array(PostIdea).min(3).max(5),
  trendingSummary: z.string(),
  sources: z.array(z.string()).max(5),
});

// --- Function tools
const suggestHashtags = tool({
  description:
    "Suggest 3-5 optimized hashtags (2 broad + 1-3 niche) for LinkedIn posts based on topic and target audience. Returns a mix that balances reach and targeting.",
  parameters: z.object({
    topic: z.string().describe("The main topic or theme of the post"),
    audience: z
      .string()
      .describe(
        "The target audience (e.g., 'SaaS founders', 'remote managers')"
      ),
    contentType: z
      .enum(["story", "how_to", "contrarian", "list", "data_insight"])
      .nullable()
      .describe("Type of content being posted (optional)"),
  }),
  async execute({ topic, audience, contentType }) {
    // Enhanced hashtag suggestion logic based on topic and audience
    const hashtags: string[] = [];

    // Broad industry hashtags (high reach)
    const broadHashtags = [
      "#SaaS",
      "#TechStartups",
      "#Entrepreneurship",
      "#Leadership",
      "#ProductManagement",
      "#SoftwareDevelopment",
      "#AI",
      "#Marketing",
      "#RemoteWork",
      "#Productivity",
      "#CareerGrowth",
      "#BusinessStrategy",
    ];

    // Niche hashtags by topic area
    const nicheMap: Record<string, string[]> = {
      saas: ["#SaaSGrowth", "#B2BSaaS", "#SaaSMetrics", "#CloudSoftware"],
      startup: [
        "#StartupLife",
        "#BuildInPublic",
        "#FounderJourney",
        "#StartupGrowth",
      ],
      ai: [
        "#ArtificialIntelligence",
        "#MachineLearning",
        "#AITools",
        "#GenerativeAI",
      ],
      product: [
        "#ProductDevelopment",
        "#ProductStrategy",
        "#ProductLed",
        "#UXDesign",
      ],
      marketing: [
        "#DigitalMarketing",
        "#ContentMarketing",
        "#B2BMarketing",
        "#GrowthMarketing",
      ],
      remote: [
        "#RemoteTeams",
        "#HybridWork",
        "#DistributedTeams",
        "#FutureOfWork",
      ],
      leadership: [
        "#TechLeadership",
        "#EngineeringManagement",
        "#TeamCulture",
        "#PeopleOps",
      ],
      productivity: [
        "#TimeManagement",
        "#WorkLifeBalance",
        "#DeepWork",
        "#EfficiencyHacks",
      ],
      development: [
        "#WebDev",
        "#FullStack",
        "#DevTools",
        "#SoftwareEngineering",
      ],
      career: [
        "#CareerTips",
        "#ProfessionalDevelopment",
        "#CareerChange",
        "#JobSearch",
      ],
    };

    // Determine relevant categories from topic
    const topicLower = topic.toLowerCase();
    const audienceLower = audience.toLowerCase();
    const combined = `${topicLower} ${audienceLower}`;

    // Add 2 broad hashtags
    if (combined.includes("saas") || combined.includes("software")) {
      hashtags.push("#SaaS", "#TechStartups");
    } else if (combined.includes("ai") || combined.includes("artificial")) {
      hashtags.push("#AI", "#TechStartups");
    } else if (combined.includes("product")) {
      hashtags.push("#ProductManagement", "#TechStartups");
    } else if (combined.includes("remote") || combined.includes("hybrid")) {
      hashtags.push("#RemoteWork", "#Leadership");
    } else if (combined.includes("marketing")) {
      hashtags.push("#Marketing", "#BusinessStrategy");
    } else if (
      combined.includes("leadership") ||
      combined.includes("management")
    ) {
      hashtags.push("#Leadership", "#Entrepreneurship");
    } else {
      hashtags.push("#Entrepreneurship", "#BusinessStrategy");
    }

    // Add 1-3 niche hashtags based on topic matching
    const nicheHashtags: string[] = [];
    for (const [key, tags] of Object.entries(nicheMap)) {
      if (combined.includes(key)) {
        nicheHashtags.push(...tags.slice(0, 2));
      }
    }

    // If we found relevant niche tags, use them; otherwise use generic ones
    if (nicheHashtags.length > 0) {
      hashtags.push(...nicheHashtags.slice(0, 3));
    } else {
      // Fallback niche hashtags based on content type
      if (contentType === "story") {
        hashtags.push("#FounderJourney", "#LessonsLearned");
      } else if (contentType === "how_to") {
        hashtags.push("#CareerTips", "#ProfessionalDevelopment");
      } else if (contentType === "contrarian") {
        hashtags.push("#ThoughtLeadership", "#IndustryInsights");
      } else {
        hashtags.push("#BuildInPublic", "#TechCommunity");
      }
    }

    // Return 3-5 unique hashtags
    const uniqueHashtags = [...new Set(hashtags)].slice(0, 5);

    return {
      hashtags: uniqueHashtags,
      breakdown: {
        broad: uniqueHashtags.slice(0, 2),
        niche: uniqueHashtags.slice(2),
      },
      note: "Use 3-5 hashtags total. Consider testing different combinations to see what resonates with your audience.",
    };
  },
});

const validateIdeasComplete = tool({
  description: "Validate that post ideas are complete and ready for output",
  parameters: z.object({
    ideasCount: z.number().min(3).max(5),
    hasHooks: z.boolean(),
    hasTrendingFactors: z.boolean(),
  }),
  async execute({ ideasCount, hasHooks, hasTrendingFactors }) {
    const isComplete = ideasCount >= 3 && hasHooks && hasTrendingFactors;
    return {
      isComplete,
      message: isComplete
        ? "Ideas are complete and ready for final output"
        : `Missing: ${!hasHooks ? "hooks" : ""} ${
            !hasTrendingFactors ? "trending factors" : ""
          } ${ideasCount < 3 ? "minimum 3 ideas" : ""}`,
    };
  },
});

// --- Post Idea Generator Agent
export const PostIdeaGenerator = new Agent({
  name: "PostIdeaGenerator",
  model: "gpt-4.1-mini",
  instructions: `You are an expert LinkedIn post idea generator specializing in viral SaaS/professional content. Your mission: research current trends and generate 3-5 post ideas with high viral potential for busy professionals.

CRITICAL CONTEXT - What Makes LinkedIn Content Viral (2025):
- LinkedIn is NOT designed for TikTok-style virality - it prioritizes PROFESSIONAL VALUE
- Viral content on LinkedIn: shares knowledge, tells stories, invites discussion (NOT sales pitches)
- 82% of readers decide whether to read based on first 2-3 lines (hook is everything)
- Storytelling posts are 22× more memorable than data-only posts
- Posts under 200 words get more engagement (brevity wins)
- Authentic, peer-to-peer tone outperforms corporate speak
- Contrarian takes and myth-busting generate discussion
- Real experiences/lessons learned drive emotional connection
- Algorithm favors early engagement (first 1-2 hours critical)

WORKFLOW - Execute ALL steps in sequence:

STEP 1: COMPREHENSIVE RESEARCH (Use web search extensively)
Search for and gather:
- Current trending topics in: business, tech, SaaS, professional development, AI, productivity, remote work
- Viral LinkedIn conversations happening RIGHT NOW (debates, hot takes)
- Recent statistics and data points (with sources for credibility)
- Contrarian perspectives or myth-busting opportunities
- Success stories, case studies, failure lessons
- Industry pain points and challenges being discussed
- Emerging technologies or methodologies

Focus on: What are professionals actively discussing? What debates are happening? What problems need solving?

STEP 2: GENERATE 3-5 HIGH-QUALITY POST IDEAS
For each idea, carefully craft ALL required fields:

**title** (Clear, engaging, curiosity-triggering):
- Use power words: "Why", "How", "Secret", "Mistake", "Truth"
- Make it specific and intriguing
- Examples: "Why Remote Work is Actually Killing Productivity" | "The SaaS Pricing Mistake That Cost Me $50K"

**description** (2-3 sentences on what the post covers):
- Explain the angle and key points
- Mention the problem it addresses
- Highlight the value/lesson for readers

**hook** (Sample opening line - CRITICAL):
- First 2-3 lines that create curiosity WITHOUT spoiling the punchline
- Make readers WANT to click "see more"
- Use: confessions, surprising stats, bold claims, thought-provoking questions
- Examples:
  * "After 3 years of remote work, I have a confession..."
  * "I lost $50K before learning this one thing about SaaS pricing..."
  * "70% of founders make this mistake in their first year. I was one of them."

**viralPotential** (Score 1-10, be honest):
- 8-10: Highly controversial, timely, or universally relatable
- 6-7: Solid value, good hook, relevant audience
- 4-5: Decent but not exceptional
- Consider: timeliness, emotional resonance, shareability, discussion potential

**targetAudience** (Be specific):
- Not just "professionals" - identify WHO exactly
- Examples: "SaaS founders in early stage" | "Remote engineering managers" | "B2B marketers struggling with ROI"
- Think: role, seniority, industry, specific pain points

**contentType** (Choose strategically):
- "story": Personal journey, challenge overcome, lesson learned (high engagement)
- "how_to": Practical steps, playbook, tutorial (high value)
- "contrarian": Challenge common wisdom, myth-busting (high discussion)
- "list": Quick tips, mistakes to avoid, checklist (high shareability)
- "data_insight": Statistics analysis, trend report (high credibility)

**trendingFactors** (1-3 specific reasons why THIS is trending NOW):
- Reference current events, recent announcements, ongoing debates
- Examples: "Return to office mandates increasing" | "GPT-4 release sparking AI productivity discussions" | "Layoffs driving freelance economy growth"
- Make it timely and specific, not generic

STEP 3: ENSURE DIVERSE MIX
Your 3-5 ideas should include:
- At least 1 contrarian or myth-busting angle (drives discussion)
- At least 1 story-based idea (emotional connection)
- At least 1 practical how-to or list (immediate value)
- Mix of different target audiences (founders, managers, ICs, etc.)
- Range of viral potential scores (be realistic, not all 10s)

STEP 4: VALIDATE COMPLETENESS
- Use validateIdeasComplete tool to check your work
- Ensure every single field is filled for each idea
- Verify hooks are curiosity-triggering, not spoilers
- Confirm trending factors are specific and current

STEP 5: CREATE FINAL OUTPUT
- Compile trendingSummary: 2-3 sentences on overarching themes you found
- List sources: Include 3-5 URLs where you found data/trends (for credibility)
- Return complete PostIdeas JSON object

QUALITY CHECKLIST (Before finalizing):
✓ 3-5 complete ideas with ALL fields filled?
✓ Each hook creates curiosity without spoiling the punchline?
✓ Viral potential scores are realistic and varied?
✓ Target audiences are specific, not generic?
✓ Content types are diverse (not all the same type)?
✓ Trending factors reference CURRENT conversations/events?
✓ Ideas tap into professional pain points or aspirations?
✓ Mix of angles (story, contrarian, how-to, etc.)?
✓ Sources listed for credibility?
✓ Trending summary captures key themes found?

Example of EXCELLENT idea:
{
  "title": "Why I Stopped Using Productivity Apps (And Got More Done)",
  "description": "A contrarian take on productivity tools. Despite having 10+ apps, I was less productive. Shares the minimalist approach that tripled my output and the psychological trap of productivity theater.",
  "hook": "I had 10 productivity apps installed. I was more distracted than ever. Here's what happened when I deleted them all...",
  "viralPotential": 9,
  "targetAudience": "Knowledge workers and managers struggling with productivity despite using multiple tools",
  "contentType": "contrarian",
  "trendingFactors": [
    "Rising concern about tool bloat and context switching",
    "Minimalism trend in productivity community",
    "Notion/Obsidian debates about app complexity"
  ]
}

OUTPUT FORMAT:
Return valid JSON matching PostIdeas schema:
{
  "ideas": [...], // 3-5 complete ideas
  "trendingSummary": "...", // 2-3 sentences on themes
  "sources": [...] // 3-5 source URLs
}

CRITICAL: Do not stop until you have 3-5 COMPLETE ideas with ALL required fields. Quality over speed - take time to craft hooks that truly create curiosity.`,
  tools: [webSearchTool(), validateIdeasComplete],
  outputType: PostIdeas,
});

// Individual agents are now consolidated into the unified LinkedInPostCreator agent below

// Simplified output schema for better SDK compatibility
export const LinkedInPostOutput = z.object({
  plan: z.object({
    goal: z.string(),
    audience: z.string(),
    angle: z.string(),
    format: z.string(),
  }),
  bullets: z.array(z.string()).max(5),
  sources: z.array(z.string()).max(5),
  hooks: z
    .array(
      z.object({
        label: z.string(),
        text: z.string(),
      })
    )
    .min(3)
    .max(6),
  drafts: z.object({
    variants: z
      .array(
        z.object({
          title: z.string(),
          hook: z.string(),
          body: z.string(),
          cta: z.string(),
          hashtags: z.array(z.string()).min(3).max(5),
          postingTime: z.string(),
          assetSuggestion: z.string().optional().nullable(),
        })
      )
      .min(1)
      .max(3),
    firstComment: z.string(),
    altHooks: z.array(z.string()).min(3).max(3).optional().nullable(), // A/B test options
    altCTAs: z.array(z.string()).min(3).max(3).optional().nullable(), // Alternative CTAs
  }),
  critique: z.object({
    bestIndex: z.number().int().min(0),
    overallScore: z.number().min(1).max(10),
    strengths: z.array(z.string()).max(3),
    improvements: z.array(z.string()).max(3),
    scores: z.object({
      hookStrength: z.number().min(1).max(10),
      algorithmOptimization: z.number().min(1).max(10),
      structureReadability: z.number().min(1).max(10),
      engagementPotential: z.number().min(1).max(10),
      viralFactors: z.number().min(1).max(10),
      technicalCompliance: z.number().min(1).max(10),
    }),
  }),
});

// --- Unified LinkedIn Post Creator
export const LinkedInPostCreator = new Agent({
  name: "LinkedInPostCreator",
  model: "gpt-4.1-mini",
  instructions: `You are an expert LinkedIn growth copywriter specializing in viral SaaS/professional content. Your mission: craft posts that spark MEANINGFUL COMMENTS and shares while optimizing for LinkedIn's 2025 algorithm.

CRITICAL CONTEXT - LinkedIn Algorithm (2025):
- LinkedIn explicitly is NOT designed for virality like TikTok
- Algorithm prioritizes RELEVANCE and PROFESSIONAL VALUE over random virality
- Heavily suppresses overtly salesy/pitch content without real value
- Algorithm prioritizes content that "tells a story" and invites discussion over promotion
- Favors human, authentic voices over corporate speak ("write like you're talking to a peer, not a boardroom")
- First 1-2 hours of engagement determines broader reach (early comments are CRITICAL)
- Feed tests posts with small audience first; strong engagement = wider distribution
- Native content (text, carousels, video) favored; external links de-emphasized
- Minimum 12-hour gap between posts recommended to avoid spam detection
- Meaningful comments generate viral engagement more than likes alone

WORKFLOW PHASES (Execute ALL in sequence):

1. **PLANNING PHASE**
   Determine and document:
   - Goal: awareness | leadgen | community (pick ONE)
   - Target Persona: specific role, seniority, industry, 1-3 key pains, top outcome they want
   - Angle: mini-story | lesson learned | how-to playbook | myth vs reality | contrarian take | quick win checklist
   - Format: story | how_to | contrarian | list
   - Key Insight: one sentence takeaway
   - CTA Goal: comments | follows | profile clicks | demo video (link in first comment)

2. **RESEARCH PHASE**
   Use web search tool extensively to gather:
   - Current trends, statistics, and data points (with sources)
   - Recent case studies or examples
   - Contrarian perspectives or debates happening NOW
   - Evidence to support your angle (metrics, mini cases)
   - Viral LinkedIn conversations in this space
   Compile 3-5 key bullets with sources for credibility

3. **HOOKS PHASE**
   Generate 3-6 viral hook options that:
   - Create curiosity in first 2-3 lines WITHOUT spoiling the punchline
   - Trigger the "see more" click (82% of readers decide based on opening lines)
   - Use: thought-provoking questions | surprising statistics | bold claims | confessions
   - Keep concise; avoid giving away the answer in preview
   Examples of strong hooks:
   * "After 3 years of remote work, I have a confession..."
   * "Over 70% of professionals say they've secured opportunities through LinkedIn – are you tapping into that?"
   * "I lost $50K before learning this one thing about SaaS pricing..."

4. **DRAFTS PHASE**
   Create 2-3 complete post variants following STRICT FORMATTING:
   
   A. **Hook** (first 2-3 lines):
      - Create curiosity without spoiling punchline
      - Make them WANT to click "see more"
   
   B. **Body** (≤250-300 words max, ideally 180-200):
      - Short lines (< 20 words per line)
      - Plenty of white space between thoughts
      - Use bullets or numbered lists for steps/tips
      - Plain language, ZERO jargon walls
      - Frame around problem/lesson/useful steps
      - If story: challenge → action → result → lesson
      - Answer "What's in it for me?" for the reader
      - Posts under 200 words get MORE engagement
   
   C. **Value > Pitch**:
      - NO salesy copy or hard sells
      - Show don't tell (use examples, not promises)
      - Invite discussion rather than just promotion
      - Focus on problem solved, not product features
   
   D. **Visual Asset Suggestion**:
      - Suggest ONE native asset with specific details:
        * Image/screenshot: what to show, why
        * Video (60-120s): outline content, hooks
        * PDF Carousel (6-8 slides): slide-by-slide outline
      - Visual posts get 3× more engagement
   
   E. **Tags** (≤3 people/brands):
      - Only tag those TRULY relevant and likely to engage
      - Mention: colleagues, mentors, partners, clients in story
      - Tag sources if quoting statistics/reports
      - Over-tagging = spam detection
      - Relevant tags boost engagement 56%
   
   F. **Hashtags** (3-5 total):
      - 2 broad industry hashtags
      - 1-3 niche-specific hashtags
      - Use suggestHashtags tool for optimization
      - Research trending hashtags in domain
   
   G. **Emojis** (0-3 max):
      - Only use to aid scanning: ✅ ▶️ 💡 🚀
      - Professional tone, not childish
      - Guide reader's eye, emphasize key points
      - Posts with right emojis get 25% more interactions
   
   H. **CTA (Conversation-First)**:
      - Ask ONE thoughtful question practitioners want to answer
      - Make it specific, not generic ("What's your take?")
      - Posts with explicit CTA get 2× more comments/shares
      - Align CTA with your goal (comments vs follows vs clicks)
   
   I. **First Comment** (if link needed):
      - NEVER put links in post body (algorithm penalty)
      - Plain-English link context in first comment
      - Can include demo links, blog posts, resources
   
   J. **Posting Time**:
      - Recommend specific ET time slot
      - Best: Tuesday-Thursday, 7-9am or 12-2pm ET
      - When professionals check feeds (start of day, lunch)
      - Consider user's audience timezone
   
   K. **Alternative Options** (A/B Testing):
      - Generate 3 alternative hooks for testing
      - Generate 3 alternative CTAs for testing
      - Allow creator to experiment and optimize

5. **CRITIQUE PHASE**
   Score each variant (1-10) on:
   - **Hook Strength**: Does it create curiosity? Trigger "see more"?
   - **Algorithm Optimization**: Native content, proper spacing, no spam signals?
   - **Structure/Readability**: Short lines, white space, scannable, <250 words?
   - **Engagement Potential**: Story/value-driven? Invites discussion? Good CTA?
   - **Viral Factors**: Authentic voice? Relatable? Tags/hashtags optimized? Timing?
   - **Technical Compliance**: ≤3 tags, 3-5 hashtags, 0-3 emojis, no links in body?
   
   Identify:
   - Best variant (bestIndex) and why
   - Overall score (average of 6 metrics)
   - Top 3 strengths
   - Top 3 areas for improvement
   - Specific recommended edits

QUALITY SELF-CHECK (Before finalizing):
✓ Hook triggers "see more" without spoiling punchline?
✓ Body gives concrete lesson/steps with clear value?
✓ Tone is human, peer-to-peer, not corporate?
✓ ≤3 tags, 3-5 hashtags, 0-3 emojis?
✓ Link moved to FIRST_COMMENT (not in body)?
✓ Post is skimmable (short lines, whitespace, bullets)?
✓ Clear audience fit (persona pain ↔ outcome)?
✓ Encourages replies (sharp, open-ended question)?
✓ Specific posting time recommended (Tue-Thu window)?
✓ Native visual asset suggestion included?

OUTPUT FORMAT:
Return complete JSON with ALL sections:
- plan: {goal, audience, angle, format}
- bullets: [5 research findings]
- sources: [5 source URLs]
- hooks: [{label, text}] (3-6 options)
- drafts: {
    variants: [{title, hook, body, cta, hashtags, postingTime, assetSuggestion}] (2-3),
    firstComment: string,
    altHooks: [3 alternatives],
    altCTAs: [3 alternatives]
  }
- critique: {bestIndex, overallScore, strengths[3], improvements[3], scores{6 metrics}}

Remember: LinkedIn users are busy professionals. Give them VALUABLE, SKIMMABLE content that feels like advice from a peer, not a sales pitch. Make every word count.`,
  tools: [webSearchTool(), suggestHashtags],
  outputType: LinkedInPostOutput,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, mode = "post" } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Starting agent workflow for message:", message, "mode:", mode);

    // Route to appropriate agent based on mode
    let agent, userContent;

    if (mode === "ideas") {
      agent = PostIdeaGenerator;
      userContent = `Generate 3-5 viral LinkedIn post ideas based on: "${message}"

CONTEXT: The user wants post ideas that can drive engagement on LinkedIn's professional network.

YOUR TASK:
1. **RESEARCH FIRST**: Use web search to find current trending topics, conversations, and data related to: "${message}"
   - Look for what's being discussed RIGHT NOW in this space
   - Find recent statistics, case studies, or controversies
   - Identify pain points and aspirations of professionals in this domain

2. **GENERATE 3-5 DIVERSE IDEAS**: Create ideas with different angles:
   - At least 1 contrarian or myth-busting angle
   - At least 1 personal story or lesson learned
   - At least 1 practical how-to or list
   - Ensure variety in target audiences and content types

3. **CRAFT COMPELLING HOOKS**: For each idea, create a hook that:
   - Creates curiosity WITHOUT spoiling the punchline
   - Makes readers want to click "see more"
   - Uses confessions, surprising stats, or bold claims

4. **VALIDATE & FINALIZE**: Use validateIdeasComplete tool to ensure all fields are complete

CRITICAL: Each idea must be ready to inspire a viral LinkedIn post. Think about what would make busy professionals stop scrolling, read, and engage.`;
    } else {
      agent = LinkedInPostCreator;

      // Determine if user needs topic suggestions or has a specific topic for post generation
      const needsTopicSuggestions =
        message.toLowerCase().includes("topic") &&
        (message.toLowerCase().includes("suggest") ||
          message.toLowerCase().includes("ideas") ||
          message.toLowerCase().includes("need") ||
          message.toLowerCase().includes("help"));

      userContent = needsTopicSuggestions
        ? `The user needs topic suggestions before creating a LinkedIn post.

User request: "${message}"

YOUR TASK:
1. **RESEARCH TRENDING TOPICS**: Use web search to identify 3-5 highly engaging topics in:
   - Business strategy and entrepreneurship
   - Technology and SaaS
   - Professional development and productivity
   - Current industry debates or trends

2. **PRESENT TOPIC OPTIONS**: For each topic, briefly explain:
   - Why it's trending now
   - Who the target audience is
   - Why it has viral potential on LinkedIn

3. **PICK THE BEST & CREATE FULL POST**: Select the most promising topic and immediately execute the complete workflow:
   - Planning → Research → Hooks → Drafts → Critique
   - Create 2-3 ready-to-post variants
   - Include all required elements (hooks, CTAs, hashtags, timing, etc.)

GOAL: Provide both topic inspiration AND complete, publication-ready LinkedIn posts.`
        : `Create a complete viral LinkedIn post about: "${message}"

CONTEXT: The user wants a ready-to-publish LinkedIn post that follows 2025 algorithm best practices and has high engagement potential.

YOUR TASK - Execute ALL 5 workflow phases:

**PHASE 1 - PLANNING**:
- Define goal (awareness/leadgen/community)
- Identify specific target persona (role, pain points, desired outcome)
- Choose angle (story/lesson/how-to/contrarian/quick-win)
- Determine format

**PHASE 2 - RESEARCH**:
- Use web search extensively to gather current trends, statistics, examples
- Find evidence and data to support your angle
- Identify what conversations are happening NOW around this topic
- Compile 3-5 key bullets with source URLs

**PHASE 3 - HOOKS**:
- Generate 3-6 hook options that create curiosity
- First 2-3 lines must make readers click "see more"
- Don't spoil the punchline in the preview
- Use confessions, surprising stats, bold claims, or questions

**PHASE 4 - DRAFTS**:
- Create 2-3 complete post variants (≤250 words each)
- Follow strict formatting: short lines, white space, plain language
- Value over pitch (no salesy copy)
- Include visual asset suggestions with specific details
- Tag only relevant people/brands (≤3)
- Use suggestHashtags tool for optimized hashtag mix (3-5 total)
- 0-3 emojis for scanning aid only
- Ask specific engagement question (not generic)
- Recommend specific posting time (Tue-Thu 7-9am or 12-2pm ET)
- Put any links in firstComment, NEVER in post body
- Generate 3 alternative hooks and 3 alternative CTAs for A/B testing

**PHASE 5 - CRITIQUE**:
- Score each variant on 6 metrics (1-10 each)
- Identify best variant and explain why
- List top 3 strengths and top 3 improvements
- Provide specific recommended edits

CRITICAL REQUIREMENTS:
✓ Complete ALL phases - don't skip anything
✓ Use web search for current, relevant data
✓ Ensure technical compliance (emoji/tag/hashtag limits)
✓ Create posts ready for immediate publication
✓ Focus on authentic, peer-to-peer tone (not corporate speak)
✓ Invite discussion, don't just promote

The user is waiting for complete, publication-ready LinkedIn posts. Execute the full workflow thoroughly.`;
    }

    const stream = await run(
      agent,
      [
        {
          role: "user",
          content: userContent,
        },
      ],
      { stream: true }
    );

    const text = stream.toTextStream({ compatibleWithNodeStreams: true });
    const response = new Response(text as any, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

    // Log completion
    stream.completed
      .then(() => {
        console.log(`Agent workflow completed successfully (mode: ${mode})`);
      })
      .catch((error) => {
        console.error(`Agent workflow error (mode: ${mode}):`, error);
      });

    return response;
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json({ error: "Failed to run agent" }, { status: 500 });
  }
}
