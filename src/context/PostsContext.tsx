"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getUserPosts,
  deletePost,
  updatePost,
  LinkedInPost,
} from "@/lib/firebase/getPosts";
import { addNewPost } from "@/lib/firebase/addNewPost";
import { Timestamp } from "firebase/firestore";

interface PostsContextType {
  posts: LinkedInPost[];
  isLoading: boolean;
  error: string | null;
  addPost: (
    postData: Omit<LinkedInPost, "id" | "userId" | "createdAt">
  ) => Promise<{ success: boolean; id?: string; error?: any }>;
  removePost: (postId: string) => Promise<{ success: boolean; error?: any }>;
  editPost: (
    postId: string,
    updateData: Partial<LinkedInPost>
  ) => Promise<{ success: boolean; error?: any }>;
  refreshPosts: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType>({
  posts: [],
  isLoading: true,
  error: null,
  addPost: async () => ({ success: false }),
  removePost: async () => ({ success: false }),
  editPost: async () => ({ success: false }),
  refreshPosts: async () => {},
});

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider = ({ children }: PostsProviderProps) => {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth() as { user: any };

  const fetchPosts = async () => {
    if (!user?.uid) {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userPosts = await getUserPosts(user.uid);
      setPosts(userPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  const addPost = async (
    postData: Omit<LinkedInPost, "id" | "userId" | "createdAt">
  ) => {
    if (!user?.uid) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const result = await addNewPost({
        ...postData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });

      if (result.success) {
        // Add the new post to the local state
        const newPost: LinkedInPost = {
          id: result.id!,
          ...postData,
          userId: user.uid,
          createdAt: Timestamp.now(),
        };
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }

      return result;
    } catch (error) {
      console.error("Error adding post:", error);
      return { success: false, error };
    }
  };

  const removePost = async (postId: string) => {
    try {
      const result = await deletePost(postId);

      if (result.success) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      }

      return result;
    } catch (error) {
      console.error("Error removing post:", error);
      return { success: false, error };
    }
  };

  const editPost = async (
    postId: string,
    updateData: Partial<LinkedInPost>
  ) => {
    try {
      const result = await updatePost(postId, updateData);

      if (result.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, ...updateData } : post
          )
        );
      }

      return result;
    } catch (error) {
      console.error("Error editing post:", error);
      return { success: false, error };
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  // Fetch posts when user changes
  useEffect(() => {
    fetchPosts();
  }, [user?.uid]);

  const value: PostsContextType = {
    posts,
    isLoading,
    error,
    addPost,
    removePost,
    editPost,
    refreshPosts,
  };

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};
