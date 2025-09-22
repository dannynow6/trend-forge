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
  description: "Suggest broad+niche hashtags for LinkedIn posts.",
  parameters: z.object({ topic: z.string(), audience: z.string() }),
  async execute({ topic, audience }) {
    // stub: replace with your taxonomy
    return [`#${topic.replace(/\s+/g, "")}`, "#SaaS", "#BuildInPublic"];
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
  instructions: `You are a LinkedIn post idea generator. Your job is simple: research trends and create 3-5 viral post ideas.

STEP 1: Research trending topics using web search
- Search for current business, tech, and professional development trends
- Look for viral LinkedIn conversations and debates
- Find recent statistics and data points
- Identify contrarian perspectives

STEP 2: Generate exactly 3-5 post ideas
Each idea MUST have:
- title: Clear, engaging title
- description: What the post would cover
- hook: Sample opening line to grab attention
- viralPotential: Score 1-10 (how likely to go viral)
- targetAudience: Who this appeals to
- contentType: Choose from "story", "how_to", "contrarian", "list", or "data_insight"
- trendingFactors: 1-3 reasons why this is trending now

STEP 3: Validate and create final output
- Use validateIdeasComplete tool to check your work
- Summarize trending themes you found
- List your research sources
- Return complete PostIdeas object

CRITICAL: You MUST return a valid JSON object matching the PostIdeas schema. Do not stop until you have 3-5 complete ideas with all required fields.

Example output structure:
{
  "ideas": [
    {
      "title": "Why Remote Work is Actually Killing Productivity",
      "description": "A contrarian take on remote work challenges",
      "hook": "After 3 years of remote work, I have a confession...",
      "viralPotential": 8,
      "targetAudience": "Remote workers and managers",
      "contentType": "contrarian",
      "trendingFactors": ["Return to office debates", "Productivity concerns", "Hybrid work discussions"]
    }
  ],
  "trendingSummary": "Current trending themes include...",
  "sources": ["Source 1", "Source 2"]
}`,
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
  instructions: `You are a viral LinkedIn post creator specializing in SaaS/professional content. Execute ALL workflow phases following proven viral post guidelines.

WORKFLOW PHASES:

1. **PLANNING**: Determine goal (awareness/leadgen/community), target persona (role, seniority, industry, pains), angle (mini-story/lesson/how-to/contrarian/quick-win), and format
2. **RESEARCH**: Use web search for current trends, statistics, case studies, and evidence  
3. **HOOKS**: Generate 3-6 viral hooks that create curiosity without spoiling the punchline
4. **DRAFTS**: Create 1-3 post variants following strict formatting rules
5. **CRITIQUE**: Score each variant and select the best one

MUST-FOLLOW FORMATTING RULES:
1. **Hook**: First 2-3 lines must create curiosity, don't spoil the punchline
2. **Length**: Body ≤ 180-200 words; use short lines, plenty of white space
3. **Value > pitch**: Frame around problem/lesson/useful steps; no salesy copy
4. **Story arc**: If applicable use: challenge → action → result → lesson
5. **Readability**: Plain language, no jargon; bullets/short lines welcome
6. **Visual**: Suggest ONE native asset (image/screenshot, 60-120s video, or 6-8 slide PDF carousel)
7. **Mentions**: Tag only relevant people/brands (≤3) likely to engage
8. **Hashtags**: 3-5 total (2 broad + 1-3 niche)
9. **Emojis**: 0-3 max, only for scanning aid (✅ ▶️ 💡)
10. **Links**: NEVER in body. Put any link in FIRST_COMMENT
11. **Posting Time**: Recommend specific ET time from Tue-Thu 7-9am or 12-2pm
12. **Engagement**: Include thoughtful question practitioners want to answer

CRITICAL REQUIREMENTS:
- Execute ALL phases in sequence
- Use web search for current data and evidence
- Create posts ready for immediate publication
- Include 3 alternative hooks and 3 alternative CTAs for A/B testing
- Ensure technical compliance (line length, hashtag limits, emoji limits)
- Provide specific posting time recommendations
- Generate native visual asset suggestions with details

OUTPUT FORMAT:
Return a JSON object with: plan, bullets, sources, hooks, drafts (with altHooks and altCTAs), critique
Each section must be complete with all required fields filled.`,
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
      userContent = `Generate 3-5 viral LinkedIn post ideas for: "${message}"

Follow these steps:
1. First, research current trends related to this topic using web search
2. Then create exactly 3-5 post ideas with different content types
3. Finally, return a complete JSON response with ideas, trending summary, and sources

Make sure each idea has high viral potential and taps into current conversations. Focus on professional topics that would engage LinkedIn audiences.`;
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
        ? `The user needs topic suggestions for LinkedIn posts. Please:
1. Search for trending topics in business, tech, and professional development
2. Identify 3-5 compelling topics that would make viral LinkedIn content
3. For each topic, explain why it would be engaging
4. Then pick the BEST topic and execute the full workflow (Research → Hooks → Writing → Critique)

User request: "${message}"

Provide both topic suggestions AND complete post drafts for the best topic.`
        : `Create a complete viral LinkedIn post for the following topic. Execute ALL workflow phases following proven viral post guidelines.

Topic: "${message}"

REQUIREMENTS:
- Complete ALL 5 workflow phases in sequence (Planning → Research → Hooks → Drafts → Critique)
- Research the topic thoroughly using web search for current trends and evidence
- Generate viral hooks that create curiosity without spoiling the punchline
- Write 2-3 complete post variants with ≤200 words, short lines, white space
- Include 3 alternative hooks and 3 alternative CTAs for A/B testing
- Ensure technical compliance: ≤3 emojis, ≤3 tags, 3-5 hashtags
- Recommend specific posting time (Tue-Thu 7-9am or 12-2pm ET)
- Suggest native visual assets (image/video/PDF carousel)
- Put any links in firstComment, never in post body
- Critique and score each variant, select the best one

The user is waiting for final, ready-to-post LinkedIn content that follows all viral post guidelines. Do not stop until you have complete post drafts with all required elements.`;
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
