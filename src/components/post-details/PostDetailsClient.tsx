"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/AuthContext";
import LinkedInPostDisplay from "@/components/home/LinkedInPostDisplay";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
import Link from "next/link";

const PostDetailsClient = () => {
  const params = useParams();
  const router = useRouter();
  const { posts, isLoading, error, removePost } = usePosts();
  const { user } = useAuth() as { user: any };
  const [deleting, setDeleting] = useState(false);

  const postId = params.id as string;
  const post = posts.find((p) => p.id === postId);

  useEffect(() => {
    // If posts are loaded and post is not found, redirect to my-posts
    if (!isLoading && posts.length > 0 && !post) {
      router.push("/my-posts");
    }
  }, [isLoading, posts, post, router]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    const result = await removePost(postId);

    if (result.success) {
      router.push("/my-posts");
    } else {
      alert("Failed to delete post. Please try again.");
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sign in to view this post
        </h2>
        <p className="text-gray-600">
          You need to be signed in to view your saved LinkedIn posts.
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
        <p className="text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link
          href="/my-posts"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Posts
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Post not found
        </h2>
        <p className="text-gray-600 mb-6">
          The post you're looking for doesn't exist or may have been deleted.
        </p>
        <Link
          href="/my-posts"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header with navigation and actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/my-posts"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Posts
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
                Delete Post
              </>
            )}
          </button>
        </div>
      </div>

      {/* Post Display */}
      <LinkedInPostDisplay
        postContent={post.content}
        firstComment={post.firstComment}
        hashtags={post.hashtags}
        assetSuggestion={post.visual_content}
        overallScore={post.viral_score}
      />

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Post Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Created:</span>
            <span className="ml-2 text-gray-600">
              {post.createdAt?.toDate
                ? post.createdAt.toDate().toLocaleDateString()
                : "Unknown date"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Viral Score:</span>
            <span className="ml-2 text-gray-600">
              {post.viral_score ? `${post.viral_score}/10` : "Not scored"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Hashtags:</span>
            <span className="ml-2 text-gray-600">
              {post.hashtags?.length || 0} tags
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">First Comment:</span>
            <span className="ml-2 text-gray-600">
              {post.firstComment ? "Included" : "Not provided"}
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
          Create Another Post
        </Link>
      </div>
    </div>
  );
};

export default PostDetailsClient;
