"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useIdeas } from "@/context/IdeasContext";
import { useAuth } from "@/context/AuthContext";
import PostIdeaDisplay from "@/components/home/PostIdeaDisplay";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const IdeaDetailsClient = () => {
  const params = useParams();
  const router = useRouter();
  const { ideas, isLoading, error, removeIdea } = useIdeas();
  const { user } = useAuth() as { user: any };
  const [deleting, setDeleting] = useState(false);

  const ideaId = params.id as string;
  const idea = ideas.find((i) => i.id === ideaId);

  useEffect(() => {
    // If ideas are loaded and idea is not found, redirect to my-ideas
    if (!isLoading && ideas.length > 0 && !idea) {
      router.push("/my-ideas");
    }
  }, [isLoading, ideas, idea, router]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this idea? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    const result = await removeIdea(ideaId);

    if (result.success) {
      router.push("/my-ideas");
    } else {
      alert("Failed to delete idea. Please try again.");
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sign in to view this idea
        </h2>
        <p className="text-gray-600">
          You need to be signed in to view your saved LinkedIn post ideas.
        </p>
        <Link
          href="/"
          className="inline-flex items-center mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading idea...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link
          href="/my-ideas"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Ideas
        </Link>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Idea not found
        </h2>
        <p className="text-gray-600 mb-6">
          The idea you're looking for doesn't exist or may have been deleted.
        </p>
        <Link
          href="/my-ideas"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Ideas
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header with navigation and actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/my-ideas"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Ideas
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex cursor-pointer items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Idea
              </>
            )}
          </button>
        </div>
      </div>

      {/* Idea Display */}
      <PostIdeaDisplay idea={idea} />

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Idea Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Created:</span>
            <span className="ml-2 text-gray-600">
              {idea.createdAt?.toDate
                ? idea.createdAt.toDate().toLocaleDateString()
                : "Unknown date"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Viral Potential:</span>
            <span className="ml-2 text-gray-600">
              {idea.viralPotential ? `${idea.viralPotential}/10` : "Not scored"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Content Type:</span>
            <span className="ml-2 text-gray-600">
              {idea.contentType || "Not specified"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Target Audience:</span>
            <span className="ml-2 text-gray-600">
              {idea.targetAudience || "Not specified"}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Trending Factors:</span>
            <span className="ml-2 text-gray-600">
              {idea.trendingFactors?.length
                ? `${idea.trendingFactors.length} factors`
                : "None specified"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Another Idea
        </Link>
      </div>
    </div>
  );
};

export default IdeaDetailsClient;
