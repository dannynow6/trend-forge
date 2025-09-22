"use client";
import { Lightbulb, TrendingUp, Users, FileText, Hash } from "lucide-react";
import { PostIdea } from "@/lib/firebase/getPostIdeas";

interface PostIdeaDisplayProps {
  idea: PostIdea;
}

const PostIdeaDisplay = ({ idea }: PostIdeaDisplayProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 rounded-t-lg">
        <div className="flex items-center gap-3 mb-3">
          <Lightbulb className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">LinkedIn Post Idea</h2>
        </div>
        <h1 className="text-2xl font-bold text-white">{idea.title}</h1>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Viral Potential Score */}
        {idea.viralPotential && (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <span className="text-sm font-medium text-green-800">
                Viral Potential Score
              </span>
              <div className="text-2xl font-bold text-green-600">
                {idea.viralPotential}/10
              </div>
            </div>
          </div>
        )}

        {/* Hook */}
        {idea.hook && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Hash className="w-5 h-5 text-blue-600" />
              Hook
            </h3>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-800 font-medium italic">"{idea.hook}"</p>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Description
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {idea.description}
            </p>
          </div>
        </div>

        {/* Target Audience & Content Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {idea.targetAudience && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Target Audience
              </h3>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-gray-800">{idea.targetAudience}</p>
              </div>
            </div>
          )}

          {idea.contentType && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Content Type
              </h3>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-gray-800">{idea.contentType}</p>
              </div>
            </div>
          )}
        </div>

        {/* Trending Factors */}
        {idea.trendingFactors && idea.trendingFactors.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Trending Factors
            </h3>
            <div className="flex flex-wrap gap-2">
              {idea.trendingFactors.map((factor, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostIdeaDisplay;
