// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import {
  Copy,
  MessageCircle,
  Repeat2,
  Send,
  ThumbsUp,
  Save,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addNewPost } from "@/lib/firebase/addNewPost";
import { Timestamp } from "firebase/firestore";

interface LinkedInPostDisplayProps {
  postContent: string;
  firstComment?: string;
  hashtags?: string[];
  postingTime?: string;
  assetSuggestion?: string;
  scores?: {
    hookStrength?: number;
    algorithmOptimization?: number;
    structureReadability?: number;
    engagementPotential?: number;
    viralFactors?: number;
    technicalCompliance?: number;
  };
  overallScore?: number;
}

const LinkedInPostDisplay = ({
  postContent,
  firstComment,
  hashtags,
  postingTime,
  assetSuggestion,
  scores,
  overallScore,
}: LinkedInPostDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth() as { user: any };

  const handleCopy = async () => {
    const fullPost = `${postContent}\n\n${hashtags ? hashtags.join(" ") : ""}`;
    await navigator.clipboard.writeText(fullPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please sign in to save posts");
      return;
    }

    setSaving(true);
    try {
      const result = await addNewPost({
        content: postContent,
        hashtags: hashtags || [],
        firstComment: firstComment || "",
        userId: user.uid,
        createdAt: Timestamp.now(),
        viral_score: overallScore,
        visual_content: assetSuggestion,
      });

      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        throw new Error("Failed to save post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* LinkedIn Post Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={`${user.displayName}'s profile picture`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {user.displayName?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-semibold text-gray-900 capitalize">
                {user.displayName}
              </div>
              <div className="text-sm text-gray-600">Your Title • Now</div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <div className="text-gray-900 leading-relaxed whitespace-pre-wrap mb-4">
            {postContent}
          </div>

          {hashtags && hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {hashtags.map((hashtag, index) => (
                <span
                  key={index}
                  className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
                >
                  {hashtag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* LinkedIn Actions */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <ThumbsUp className="w-5 h-5" />
                <span className="text-sm">Like</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">Comment</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Repeat2 className="w-5 h-5" />
                <span className="text-sm">Repost</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Send className="w-5 h-5" />
                <span className="text-sm">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* First Comment Preview */}
        {firstComment && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="text-sm text-gray-700">
              <span className="font-medium">First comment suggestion:</span>
            </div>
            <div className="text-sm text-gray-600 mt-1 italic">
              "{firstComment}"
            </div>
          </div>
        )}

        {/* Copy and Save Buttons */}
        <div className="px-4 py-3 bg-blue-50 border-t border-gray-100 space-y-2">
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-2 rounded-md hover:scale-[1.01] transition-all duration-200 ${
              copied
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-label="Copy post content"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied to clipboard!" : "Copy post content"}
          </button>

          <button
            onClick={handleSave}
            disabled={saving || saved || !user}
            className={`w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-2 rounded-md hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              saved
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
            aria-label="Save post to collection"
          >
            <Save className="w-4 h-4" />
            {saving
              ? "Saving..."
              : saved
              ? "Saved to collection!"
              : "Save to collection"}
          </button>
        </div>

        {/* Posting Strategy & Performance Info */}
        {(postingTime || assetSuggestion || scores || overallScore) && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">
              📊 Performance Insights
            </h4>

            {overallScore && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Viral Score:</span>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    overallScore >= 8
                      ? "bg-green-100 text-green-700"
                      : overallScore >= 6
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {overallScore}/10
                </div>
              </div>
            )}

            {postingTime && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  ⏰ Best posting time:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {postingTime}
                </span>
              </div>
            )}

            {assetSuggestion && (
              <div className="space-y-1">
                <span className="text-sm text-gray-600">
                  🎨 Visual content suggestion:
                </span>
                <p className="text-sm text-gray-800 italic">
                  {assetSuggestion}
                </p>
              </div>
            )}

            {scores && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(scores).map(
                  ([key, value]) =>
                    value !== undefined && (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span
                          className={`font-medium ${
                            value >= 8
                              ? "text-green-600"
                              : value >= 6
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {value}/10
                        </span>
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInPostDisplay;
