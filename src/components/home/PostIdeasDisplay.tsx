// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { useState } from "react";
import { Copy, TrendingUp, Users, Target, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addNewPostIdea } from "@/lib/firebase/addNewPostIdea";
import { Timestamp } from "firebase/firestore";

interface PostIdea {
  title: string;
  description: string;
  hook: string;
  viralPotential: number;
  targetAudience: string;
  contentType: string;
  trendingFactors: string[];
}

interface PostIdeasDisplayProps {
  ideas: PostIdea[];
  trendingSummary?: string;
  sources?: string[];
}

const PostIdeasDisplay = ({
  ideas,
  trendingSummary,
  sources,
}: PostIdeasDisplayProps) => {
  const [copied, setCopied] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const { user } = useAuth() as { user: any };

  const handleCopyIdea = async (idea: PostIdea, index: number) => {
    const ideaText = `📝 TITLE: ${idea.title}

💡 HOOK: ${idea.hook}

📄 DESCRIPTION: ${idea.description}

🎯 TARGET: ${idea.targetAudience}

📊 TYPE: ${idea.contentType.replace("_", " ")}

🔥 TRENDING FACTORS:
${idea.trendingFactors.map((factor) => `• ${factor}`).join("\n")}`;

    await navigator.clipboard.writeText(ideaText);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSaveIdea = async (idea: PostIdea, index: number) => {
    if (!user) {
      alert("Please sign in to save post ideas");
      return;
    }

    setSaving(index);
    try {
      const result = await addNewPostIdea({
        title: idea.title,
        viralPotential: idea.viralPotential,
        hook: idea.hook,
        description: idea.description,
        targetAudience: idea.targetAudience,
        contentType: idea.contentType,
        trendingFactors: idea.trendingFactors,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });

      if (result.success) {
        setSaved(index);
        setTimeout(() => setSaved(null), 3000);
      } else {
        throw new Error("Failed to save post idea");
      }
    } catch (error) {
      console.error("Error saving post idea:", error);
      alert("Failed to save post idea. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const getViralPotentialColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100";
    if (score >= 6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getContentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "story":
        return "📖";
      case "how_to":
        return "🔧";
      case "contrarian":
        return "🚫";
      case "list":
        return "📋";
      case "data_insight":
        return "📊";
      default:
        return "💡";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-green-700 mb-2">
          💡 Viral Post Ideas Ready!
        </h2>
        <p className="text-sm text-gray-600">
          Copy any idea below, then switch to "Generate Post" mode to create the
          full content
        </p>
      </div>

      {/* Trending Summary */}
      {trendingSummary && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">
                📈 Current Trending Themes
              </h3>
              <p className="text-sm text-blue-700">{trendingSummary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Post Ideas Grid */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {ideas.map((idea, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header with Title and Viral Score */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">
                  {getContentTypeIcon(idea.contentType)}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {idea.title}
                </h3>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getViralPotentialColor(
                  idea.viralPotential
                )}`}
              >
                {idea.viralPotential}/10
              </div>
            </div>

            {/* Hook Preview */}
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="text-xs font-medium text-gray-600 mb-1">
                Sample Hook:
              </div>
              <p className="text-sm text-gray-800 italic">"{idea.hook}"</p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              {idea.description}
            </p>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <Users className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">Target:</span>
                <span className="text-gray-800 font-medium">
                  {idea.targetAudience}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Target className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">Type:</span>
                <span className="text-gray-800 font-medium capitalize">
                  {idea.contentType.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Trending Factors */}
            {idea.trendingFactors.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-600 mb-2">
                  🔥 Trending Factors:
                </div>
                <div className="flex flex-wrap gap-1">
                  {idea.trendingFactors.map((factor, factorIndex) => (
                    <span
                      key={factorIndex}
                      className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Copy and Save Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleCopyIdea(idea, index)}
                className={`w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  copied === index
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.01]"
                }`}
              >
                <Copy className="w-4 h-4" />
                {copied === index ? "Copied!" : "Copy Idea Details"}
              </button>

              <button
                onClick={() => handleSaveIdea(idea, index)}
                disabled={saving === index || saved === index || !user}
                className={`w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  saved === index
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.01]"
                }`}
              >
                <Save className="w-4 h-4" />
                {saving === index
                  ? "Saving..."
                  : saved === index
                  ? "Saved!"
                  : "Save Idea"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sources */}
      {sources && sources.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-2 text-sm">
            📚 Research Sources:
          </h3>
          <div className="space-y-1">
            {sources.map((source, index) => (
              <div key={index} className="text-xs text-gray-600">
                • {source}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 text-center">
        <div className="text-sm text-purple-800 font-medium mb-1">
          🚀 Ready to Create?
        </div>
        <div className="text-xs text-purple-700">
          Switch to "Generate Post" mode and paste any idea title to create a
          complete viral LinkedIn post!
        </div>
      </div>
    </div>
  );
};

export default PostIdeasDisplay;
