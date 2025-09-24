"use client";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  Calendar,
  Hash,
  TrendingUp,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { oswald } from "../ui/fonts";
import SignInGoogle from "../auth/SignInGoogle";

const MyPostsMain = () => {
  const {
    posts,
    isLoading,
    error,
    removePost,
    hasMore,
    loadNextPage,
    currentPage,
  } = usePosts();
  const { user } = useAuth() as { user: any };
  const [deletingPost, setDeletingPost] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sign in to view your posts
        </h2>
        <p className="text-gray-600">
          You need to be signed in to view your saved LinkedIn posts.
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
        <p className="text-gray-600">Loading your posts...</p>
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

  const handleDelete = async (postId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to post details
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setDeletingPost(postId);
    const result = await removePost(postId);

    if (!result.success) {
      alert("Failed to delete post. Please try again.");
    }
    setDeletingPost(null);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await loadNextPage();
    setLoadingMore(false);
  };

  const getPostPreview = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
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

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No saved posts yet
        </h2>
        <p className="text-gray-600 mb-6">
          Start creating LinkedIn posts and save them here for easy access.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create your first post
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
          My Saved Posts
        </h1>
        <p className="text-gray-600">
          {currentPage === 1 && !hasMore
            ? `You have ${posts.length} saved LinkedIn post${
                posts.length !== 1 ? "s" : ""
              }`
            : `Showing ${posts.length} posts${
                hasMore ? " (more available)" : ""
              }`}
        </p>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/my-posts/post/${post.id}`}
            className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {formatCreatedAt(post.createdAt)}
                    </span>
                    {post.viral_score && (
                      <>
                        <span className="text-gray-300">•</span>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          {post.viral_score}/10
                        </span>
                      </>
                    )}
                  </div>

                  <div className="text-gray-900 leading-relaxed mb-3">
                    {getPostPreview(post.content)}
                  </div>

                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <Hash className="w-4 h-4 text-blue-500" />
                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.slice(0, 3).map((hashtag, index) => (
                          <span
                            key={index}
                            className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded"
                          >
                            {hashtag}
                          </span>
                        ))}
                        {post.hashtags.length > 3 && (
                          <span className="text-sm text-gray-500">
                            +{post.hashtags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {post.firstComment && (
                    <div className="text-sm text-gray-600 italic">
                      💬 "{getPostPreview(post.firstComment, 80)}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => handleDelete(post.id, e)}
                    disabled={deletingPost === post.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete post"
                  >
                    {deletingPost === post.id ? (
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

      {/* Pagination Controls */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:scale-[1.01] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Load more posts"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                Loading more...
              </>
            ) : (
              <>
                Load more posts
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      <div className="text-center pt-8">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-[1.01] transition-all duration-200 ease-in-out"
          aria-label="Create another post"
        >
          Create another post
        </Link>
      </div>
    </div>
  );
};

export default MyPostsMain;
