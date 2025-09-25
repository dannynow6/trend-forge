// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { useState } from "react";
import MessageForm from "./MessageForm";
import ResponseArea from "./ResponseArea";
import { Eraser } from "lucide-react";

const MessageContainer = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentMode, setCurrentMode] = useState<"ideas" | "post" | undefined>(
    undefined
  );

  const handleFormSubmit = async (message: string, mode: "ideas" | "post") => {
    setCurrentMessage(message);
    setCurrentMode(mode);
    setIsLoading(true);
    setResponse("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          mode: mode,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      if (!reader) {
        throw new Error("No reader available");
      }

      setIsLoading(false); // Stop loading indicator when streaming starts

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsStreaming(false);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        setResponse(accumulatedResponse);
      }
    } catch (error) {
      setResponse("Error: Failed to connect to the AI agent");
      console.error("Failed to call agent:", error);
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleClear = () => {
    setCurrentMessage("");
    setResponse("");
    setCurrentMode(undefined);
    setIsLoading(false);
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Input Area - Now at top for better flow */}
      <div className="w-full max-w-2xl mx-auto">
        <MessageForm
          onSubmit={handleFormSubmit}
          isLoading={isLoading || isStreaming}
          onClear={handleClear}
        />

        {currentMessage && (
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="text-sm text-gray-600 text-center bg-white/70 backdrop-blur-sm p-3 rounded-md border border-gray-200">
              <strong>Current request:</strong> "{currentMessage}"
            </div>
            <button
              onClick={handleClear}
              className="group px-4 py-2 flex items-center justify-center gap-2 cursor-pointer text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Clear conversation"
            >
              <span className="flex items-center justify-center w-6 h-6 bg-sky-100 rounded-full">
                <Eraser className="w-4 h-4 group-hover:text-sky-400 transition-all duration-200" />
              </span>
              Start New Task
            </button>
          </div>
        )}
      </div>

      {/* Response Area */}
      <ResponseArea
        response={response}
        isLoading={isLoading}
        isStreaming={isStreaming}
        mode={currentMode}
      />
    </div>
  );
};

export default MessageContainer;
