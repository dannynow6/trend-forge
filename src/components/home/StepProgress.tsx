"use client";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface Step {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
}

interface StepProgressProps {
  steps: Step[];
}

const StepProgress = ({ steps }: StepProgressProps) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        🎯 LinkedIn Post Creation Progress
      </h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {step.status === "completed" ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : step.status === "in_progress" ? (
                <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    step.status === "completed"
                      ? "text-green-700"
                      : step.status === "in_progress"
                      ? "text-blue-700"
                      : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
                {step.status === "in_progress" && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
