// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import Link from "next/link";

interface MessageFormProps {
  onSubmit: (message: string, mode: "ideas" | "post") => void;
  isLoading?: boolean;
  onClear?: () => void;
}

const MessageForm = ({
  onSubmit,
  isLoading = false,
  onClear,
}: MessageFormProps) => {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"ideas" | "post">("ideas");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message.trim(), mode);
      setMessage(""); // Clear input after submission
    }
  };

  const handleClear = () => {
    setMessage("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="message"
            className={`block text-sm tracking-wide font-medium text-gray-700 mb-3`}
          >
            How would you like to begin creating your LinkedIn posts?
          </label>

          {/* Mode Selection */}
          <div className="flex gap-4 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="ideas"
                checked={mode === "ideas"}
                onChange={(e) => setMode(e.target.value as "ideas" | "post")}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Generate Ideas
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="post"
                checked={mode === "post"}
                onChange={(e) => setMode(e.target.value as "ideas" | "post")}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Generate Post
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-md">
              <div className="font-medium text-blue-800 mb-2">
                💡{" "}
                {mode === "ideas"
                  ? "Get trending post ideas:"
                  : "Create a viral post:"}
              </div>
              <div className="space-y-1">
                {mode === "ideas" ? (
                  <>
                    <div>
                      <strong>Examples:</strong> "I need LinkedIn post ideas for
                      tech professionals" or "Suggest trending business topics"
                    </div>
                    <div className="text-blue-700">
                      ✨ AI will find 3-5 viral post ideas with trending topics
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>Examples:</strong> "Create a post about remote
                      work challenges" or "AI in business transformation"
                    </div>
                    <div className="text-blue-700">
                      ✨ AI will create a complete viral LinkedIn post with
                      hooks, content, and hashtags
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                mode === "ideas"
                  ? "e.g., 'Need LinkedIn post ideas for tech professionals'"
                  : "e.g., 'Create post about AI in business'"
              }
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white/70 backdrop-blur-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="group flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-md hover:scale-[1.02] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              aria-label="Ask question"
            >
              {isLoading
                ? mode === "ideas"
                  ? "Finding Ideas..."
                  : "Creating Post..."
                : mode === "ideas"
                ? "Generate Ideas"
                : "Generate Post"}

              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:text-teal-400 transition-all duration-200" />
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs text-center text-slate-600 pt-4">
        * By using this service, you agree to our{" "}
        <Link
          href="/terms-and-conditions"
          className="text-blue-600 hover:underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="text-blue-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
};

export default MessageForm;
