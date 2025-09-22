"use client";
import { useState, useEffect, useMemo } from "react";
import StepProgress from "./StepProgress";
import LinkedInPostDisplay from "./LinkedInPostDisplay";
import PostIdeasDisplay from "./PostIdeasDisplay";

interface ResponseAreaProps {
  response: string;
  isLoading: boolean;
  isStreaming?: boolean;
  mode?: "ideas" | "post";
}

interface Step {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
}

const ResponseArea = ({
  response,
  isLoading,
  isStreaming = false,
  mode,
}: ResponseAreaProps) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    // For real streaming, just display the response as it comes in
    setDisplayText(response);

    // Debug logging to help understand the response format
    if (
      response &&
      (response.includes("drafts") || response.includes("variants"))
    ) {
      console.log("Response contains drafts/variants:", response.slice(-1000));
    }
  }, [response]);

  // Parse the response to extract steps, final post, and post ideas
  const { steps, finalPost, showFinalPost, postIdeas, showPostIdeas } =
    useMemo(() => {
      // Different steps for ideas vs posts
      // Use mode prop as primary source of truth, fall back to content detection
      const isIdeasMode =
        mode === "ideas" ||
        (mode === undefined &&
          (response.includes("PostIdeaGenerator") ||
            response.includes('"ideas"') ||
            response.includes("trending")));

      const defaultSteps: Step[] = isIdeasMode
        ? [
            {
              id: "research",
              name: "Research",
              description: "Finding current trends and viral topics",
              status: "pending",
            },
            {
              id: "ideation",
              name: "Idea Generation",
              description: "Creating compelling post concepts",
              status: "pending",
            },
            {
              id: "formatting",
              name: "Formatting",
              description: "Organizing ideas with viral potential scores",
              status: "pending",
            },
          ]
        : [
            {
              id: "planning",
              name: "Planning",
              description:
                "Analyzing your request and creating a content strategy",
              status: "pending",
            },
            {
              id: "research",
              name: "Research",
              description: "Finding trending topics and supporting data",
              status: "pending",
            },
            {
              id: "hooks",
              name: "Hook Creation",
              description: "Generating viral hooks for maximum engagement",
              status: "pending",
            },
            {
              id: "writing",
              name: "Writing",
              description: "Crafting compelling LinkedIn post variants",
              status: "pending",
            },
            {
              id: "critique",
              name: "Optimization",
              description: "Reviewing and optimizing for viral potential",
              status: "pending",
            },
          ];

      if (!response) {
        return {
          steps: defaultSteps,
          finalPost: null,
          showFinalPost: false,
          postIdeas: null,
          showPostIdeas: false,
        };
      }

      // Update step status based on response content
      const updatedSteps = defaultSteps.map((step) => {
        if (isIdeasMode) {
          // Idea generation workflow steps
          if (
            response.includes("search") ||
            response.includes("trending") ||
            response.includes("research")
          ) {
            if (step.id === "research")
              return { ...step, status: "completed" as const };
          }

          if (
            response.includes("ideas") ||
            response.includes("title") ||
            response.includes("viralPotential")
          ) {
            if (step.id === "research")
              return { ...step, status: "completed" as const };
            if (step.id === "ideation")
              return { ...step, status: "completed" as const };
          }

          if (
            response.includes('"ideas"') ||
            response.includes("trendingSummary")
          ) {
            if (["research", "ideation"].includes(step.id))
              return { ...step, status: "completed" as const };
            if (step.id === "formatting")
              return { ...step, status: "completed" as const };
          }
        } else {
          // Post generation workflow steps
          // Check for planning/research content
          if (
            response.includes("plan") ||
            response.includes("bullets") ||
            response.includes("sources")
          ) {
            if (step.id === "planning")
              return { ...step, status: "completed" as const };
            if (step.id === "research")
              return { ...step, status: "completed" as const };
          }

          // Check for hooks content
          if (
            response.includes("hooks") ||
            (response.includes("label") && response.includes("text"))
          ) {
            if (["planning", "research"].includes(step.id))
              return { ...step, status: "completed" as const };
            if (step.id === "hooks")
              return { ...step, status: "completed" as const };
          }

          // Check for drafts/variants content
          if (
            response.includes("variants") ||
            response.includes("drafts") ||
            (response.includes("hook") && response.includes("body"))
          ) {
            if (["planning", "research", "hooks"].includes(step.id))
              return { ...step, status: "completed" as const };
            if (step.id === "writing")
              return { ...step, status: "completed" as const };
          }

          // Check for critique content
          if (
            response.includes("critique") ||
            response.includes("bestIndex") ||
            response.includes("overallScore")
          ) {
            if (["planning", "research", "hooks", "writing"].includes(step.id))
              return { ...step, status: "completed" as const };
            if (step.id === "critique")
              return { ...step, status: "completed" as const };
          }

          // Legacy checks for agent names
          if (
            response.includes("TopicSuggester") ||
            response.includes("planning") ||
            response.includes("PostPlan")
          ) {
            if (step.id === "planning")
              return { ...step, status: "completed" as const };
          }
          if (response.includes("Researcher")) {
            if (step.id === "planning")
              return { ...step, status: "completed" as const };
            if (step.id === "research")
              return { ...step, status: "completed" as const };
          }
        }

        return step;
      });

      // Try to extract post ideas content
      let postIdeas = null;
      let showPostIdeas = false;

      // Check if this is a post ideas response
      try {
        // Multiple strategies to find and parse PostIdeas JSON
        const strategies = [
          // Strategy 1: Look for complete JSON object with ideas
          () => {
            const match = response.match(/\{[\s\S]*?"ideas"[\s\S]*?\}(?:\s*)$/);
            return match ? JSON.parse(match[0]) : null;
          },
          // Strategy 2: Find any JSON with ideas array
          () => {
            const matches = response.match(/\{[\s\S]*?"ideas"[\s\S]*?\}/g);
            if (matches && matches.length > 0) {
              return JSON.parse(matches[matches.length - 1]);
            }
            return null;
          },
          // Strategy 3: Look for the most complete JSON structure
          () => {
            const jsonBlocks =
              response.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g) || [];
            for (const block of jsonBlocks.reverse()) {
              try {
                const obj = JSON.parse(block);
                if (
                  obj.ideas &&
                  Array.isArray(obj.ideas) &&
                  obj.ideas.length > 0
                ) {
                  return obj;
                }
              } catch (e) {
                continue;
              }
            }
            return null;
          },
        ];

        let parsed = null;
        for (const strategy of strategies) {
          try {
            parsed = strategy();
            if (
              parsed &&
              parsed.ideas &&
              Array.isArray(parsed.ideas) &&
              parsed.ideas.length > 0
            ) {
              console.log("Successfully parsed post ideas");
              break;
            }
          } catch (e) {
            continue;
          }
        }

        if (
          parsed &&
          parsed.ideas &&
          Array.isArray(parsed.ideas) &&
          parsed.ideas.length > 0
        ) {
          postIdeas = {
            ideas: parsed.ideas,
            trendingSummary:
              parsed.trendingSummary ||
              "Trending themes identified from research.",
            sources: parsed.sources || [],
          };
          showPostIdeas = true;
          console.log("Successfully parsed post ideas:", postIdeas);
        }
      } catch (error) {
        console.log("Not a post ideas response or failed to parse:", error);
      }

      // Try to extract final post content (only if not showing post ideas and not in ideas mode)
      let finalPost = null;
      let showFinalPost = false;

      if (!showPostIdeas && mode !== "ideas") {
        try {
          // Look for structured JSON output in various formats
          let parsed = null;

          // Multiple strategies to find and parse the JSON output
          const strategies = [
            // Strategy 1: JSON at the end with new schema
            () => {
              const match = response.match(
                /\{[\s\S]*"drafts"[\s\S]*\}(?:\s*)$/
              );
              return match ? JSON.parse(match[0]) : null;
            },
            // Strategy 2: Look for complete output with plan and drafts
            () => {
              const match = response.match(
                /\{[\s\S]*?"plan"[\s\S]*?"drafts"[\s\S]*?"critique"[\s\S]*?\}/
              );
              return match ? JSON.parse(match[0]) : null;
            },
            // Strategy 3: JSON anywhere with drafts
            () => {
              const matches = response.match(/\{[\s\S]*?"drafts"[\s\S]*?\}/g);
              if (matches && matches.length > 0) {
                return JSON.parse(matches[matches.length - 1]);
              }
              return null;
            },
            // Strategy 4: Find JSON blocks and check for drafts
            () => {
              const jsonBlocks =
                response.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g) || [];
              for (const block of jsonBlocks.reverse()) {
                try {
                  const obj = JSON.parse(block);
                  if (obj.drafts) return obj;
                } catch (e) {
                  continue;
                }
              }
              return null;
            },
            // Strategy 5: Look for the last complete JSON object for inspection
            () => {
              const jsonBlocks = response.match(/\{[\s\S]*?\}/g) || [];
              for (const block of jsonBlocks.reverse()) {
                try {
                  const obj = JSON.parse(block);
                  // Return any valid parsed object for inspection
                  return obj;
                } catch (e) {
                  continue;
                }
              }
              return null;
            },
          ];

          // Try each strategy until one works
          for (const strategy of strategies) {
            try {
              parsed = strategy();
              if (parsed && parsed.drafts) {
                console.log(
                  "Successfully parsed agent output with drafts:",
                  parsed
                );
                break;
              }
            } catch (e) {
              continue; // Try next strategy
            }
          }

          if (
            parsed &&
            parsed.drafts &&
            parsed.drafts.variants &&
            parsed.drafts.variants.length > 0
          ) {
            // Select best variant based on critique if available, otherwise use first
            let bestVariant = parsed.drafts.variants[0];
            if (parsed.critique && parsed.critique.bestIndex !== undefined) {
              bestVariant =
                parsed.drafts.variants[parsed.critique.bestIndex] ||
                bestVariant;
            }

            finalPost = {
              content:
                bestVariant.body ||
                (bestVariant.hook && bestVariant.content
                  ? `${bestVariant.hook}\n\n${bestVariant.content}`
                  : bestVariant.hook || bestVariant.content || ""),
              hashtags: bestVariant.hashtags || [],
              firstComment: parsed.drafts.firstComment || "",
              postingTime: bestVariant.postingTime || "9 AM - 12 PM weekdays",
              assetSuggestion: bestVariant.assetSuggestion || "",
              scores: parsed.critique?.scores,
              overallScore: parsed.critique?.overallScore,
            };
            showFinalPost = true;
          } else {
            console.log(
              "No drafts found in parsed response. Parsed object:",
              parsed
            );
            console.log("Full response for debugging:", response);
          }
        } catch (error) {
          console.error("Error parsing JSON response:", error);
          console.log("Response content for debugging:", response.slice(-1000));
          // If JSON parsing fails, try to extract post content from text patterns
          const hookMatch = response.match(
            /(?:HOOK|Hook)[:\-]\s*([\s\S]*?)(?:\n\n|\*\*|POST|Body)/i
          );
          const bodyMatch = response.match(
            /(?:POST BODY|Body|Content)[:\-]\s*([\s\S]*?)(?:\n\n|\*\*|CTA|$)/i
          );
          const hashtagMatch = response.match(
            /(?:HASHTAGS|#)[:\-]?\s*(#[\w\s#]+)/i
          );

          if (
            (hookMatch || bodyMatch) &&
            ((hookMatch?.[1]?.trim().length ?? 0) > 20 ||
              (bodyMatch?.[1]?.trim().length ?? 0) > 50)
          ) {
            const hookText = hookMatch?.[1]?.trim() || "";
            const bodyText = bodyMatch?.[1]?.trim() || "";
            const fullContent =
              hookText && bodyText
                ? `${hookText}\n\n${bodyText}`
                : hookText || bodyText;

            finalPost = {
              content: fullContent,
              hashtags:
                hashtagMatch?.[1]
                  ?.split(/\s+/)
                  .filter((h) => h.startsWith("#")) || [],
              firstComment: "",
            };
            showFinalPost =
              response.includes("critique") ||
              response.includes("final") ||
              response.includes("POST BODY") ||
              response.includes("Writer") ||
              response.includes("Critic") ||
              !isStreaming; // Show if not streaming (completed)
          }
        }

        // Fallback: if all steps are completed but no finalPost was found, show raw content
        if (
          !finalPost &&
          updatedSteps.every((step) => step.status === "completed")
        ) {
          console.log(
            "All steps completed but no final post found. Attempting fallback parsing..."
          );

          // Try to extract any meaningful content for display
          if (response.length > 200) {
            finalPost = {
              content:
                "✨ LinkedIn post generated successfully!\n\nThe AI has completed all steps but the final post format needs adjustment. Please check the raw output below for your post content.",
              hashtags: [],
              firstComment: "",
            };
            showFinalPost = true;
          }
        }
      }

      return {
        steps: updatedSteps,
        finalPost,
        showFinalPost,
        postIdeas,
        showPostIdeas,
      };
    }, [response, isStreaming, mode]);
  // bg-white/50
  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-32 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-md">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">AI is thinking...</span>
          </div>
        </div>
      ) : displayText ? (
        <>
          {/* Show step progress if there's activity */}
          {(response.includes("Director") ||
            response.includes("Agent") ||
            steps.some((s) => s.status !== "pending")) && (
            <StepProgress steps={steps} />
          )}

          {/* Show post ideas if completed */}
          {showPostIdeas && postIdeas ? (
            <PostIdeasDisplay
              ideas={postIdeas.ideas}
              trendingSummary={postIdeas.trendingSummary}
              sources={postIdeas.sources}
            />
          ) : /* Show final LinkedIn post if completed */ showFinalPost &&
            finalPost ? (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-green-700 mb-2">
                  🎉 Your Viral LinkedIn Post is Ready!
                </h2>
                <p className="text-sm text-gray-600">
                  Preview how it will look on LinkedIn, then copy to post
                </p>
              </div>
              <LinkedInPostDisplay
                postContent={finalPost.content}
                firstComment={finalPost.firstComment}
                hashtags={finalPost.hashtags}
                postingTime={finalPost.postingTime}
                assetSuggestion={finalPost.assetSuggestion}
                scores={finalPost.scores}
                overallScore={finalPost.overallScore}
              />
            </div>
          ) : (
            /* Show raw response if final post isn't ready yet */
            <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-md bg-white/50 backdrop-blur-sm p-6 shadow-sm">
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {displayText}
                  {isStreaming && (
                    <span className="inline-block w-2 h-5 bg-blue-600 ml-1 animate-pulse"></span>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center h-32 text-gray-400 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-md">
          <div className="text-center self-center">
            <div className="text-lg mb-2">🚀</div>
            <p>Choose your mode above and enter your request to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseArea;
