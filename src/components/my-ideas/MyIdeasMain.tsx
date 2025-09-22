"use client";
import { useIdeas } from "@/context/IdeasContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Lightbulb,
  Calendar,
  TrendingUp,
  Trash2,
  Users,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { oswald } from "../ui/fonts";
import SignInGoogle from "../auth/SignInGoogle";

const MyIdeasMain = () => {
  const { ideas, isLoading, error, removeIdea } = useIdeas();
  const { user } = useAuth() as { user: any };
  const [deletingIdea, setDeletingIdea] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sign in to view your ideas
        </h2>
        <p className="text-gray-600">
          You need to be signed in to view your saved LinkedIn post ideas.
        </p>
        <div className="flex items-center justify-center py-6">
          <SignInGoogle />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  const handleDelete = async (ideaId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to idea details
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this idea?")) {
      return;
    }

    setDeletingIdea(ideaId);
    const result = await removeIdea(ideaId);

    if (!result.success) {
      alert("Failed to delete idea. Please try again.");
    }
    setDeletingIdea(null);
  };

  const getIdeaPreview = (description: string, maxLength: number = 120) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + "...";
  };

  const formatCreatedAt = (createdAt: any) => {
    if (!createdAt) return "Unknown date";

    try {
      const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  if (ideas.length === 0) {
    return (
      <div className="text-center py-12">
        <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No saved ideas yet
        </h2>
        <p className="text-gray-600 mb-6">
          Start creating LinkedIn post ideas and save them here for easy access.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create your first idea
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1
          className={`${oswald.className} antialiased text-3xl font-semibold tracking-wide text-gray-900 mb-2`}
        >
          My Saved Ideas
        </h1>
        <p className="text-gray-600">
          You have {ideas.length} saved LinkedIn post idea
          {ideas.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-4">
        {ideas.map((idea) => (
          <Link
            key={idea.id}
            href={`/my-ideas/idea/${idea.id}`}
            className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {formatCreatedAt(idea.createdAt)}
                    </span>
                    {idea.viralPotential && (
                      <>
                        <span className="text-gray-300">•</span>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          {idea.viralPotential}/10 viral potential
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {idea.title}
                  </h3>

                  <div className="text-gray-700 leading-relaxed mb-3">
                    {getIdeaPreview(idea.description)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {idea.targetAudience && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{idea.targetAudience}</span>
                      </div>
                    )}
                    {idea.contentType && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{idea.contentType}</span>
                      </div>
                    )}
                  </div>

                  {idea.trendingFactors && idea.trendingFactors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {idea.trendingFactors.slice(0, 3).map((factor, index) => (
                        <span
                          key={index}
                          className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded"
                        >
                          {factor}
                        </span>
                      ))}
                      {idea.trendingFactors.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{idea.trendingFactors.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => handleDelete(idea.id, e)}
                    disabled={deletingIdea === idea.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete idea"
                  >
                    {deletingIdea === idea.id ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-[1.01] transition-all duration-200 ease-in-out"
        >
          Create another idea
        </Link>
      </div>
    </div>
  );
};

export default MyIdeasMain;
