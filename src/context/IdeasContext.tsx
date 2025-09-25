// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

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
  // getUserPostIdeas,
  getUserPostIdeasPaginated,
  deletePostIdea,
  updatePostIdea,
  PostIdea,
  // PaginatedIdeasResult,
} from "@/lib/firebase/getPostIdeas";
import { DocumentSnapshot } from "firebase/firestore";
import { addNewPostIdea } from "@/lib/firebase/addNewPostIdea";
import { Timestamp } from "firebase/firestore";

interface IdeasContextType {
  ideas: PostIdea[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  addIdea: (
    ideaData: Omit<PostIdea, "id" | "userId" | "createdAt">
  ) => Promise<{ success: boolean; id?: string; error?: any }>;
  removeIdea: (ideaId: string) => Promise<{ success: boolean; error?: any }>;
  editIdea: (
    ideaId: string,
    updateData: Partial<PostIdea>
  ) => Promise<{ success: boolean; error?: any }>;
  refreshIdeas: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  resetPagination: () => void;
}

const IdeasContext = createContext<IdeasContextType>({
  ideas: [],
  isLoading: true,
  error: null,
  hasMore: false,
  currentPage: 1,
  addIdea: async () => ({ success: false }),
  removeIdea: async () => ({ success: false }),
  editIdea: async () => ({ success: false }),
  refreshIdeas: async () => {},
  loadNextPage: async () => {},
  resetPagination: () => {},
});

interface IdeasProviderProps {
  children: ReactNode;
}

export const IdeasProvider = ({ children }: IdeasProviderProps) => {
  const [ideas, setIdeas] = useState<PostIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const { user } = useAuth() as { user: any };

  const fetchIdeas = async (reset: boolean = true) => {
    if (!user?.uid) {
      setIdeas([]);
      setHasMore(false);
      setCurrentPage(1);
      setLastDoc(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await getUserPostIdeasPaginated(
        user.uid,
        10,
        reset ? undefined : lastDoc || undefined
      );

      if (reset) {
        setIdeas(result.ideas);
        setCurrentPage(1);
      } else {
        setIdeas((prev) => [...prev, ...result.ideas]);
        setCurrentPage((prev) => prev + 1);
      }

      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
    } catch (err) {
      console.error("Error fetching ideas:", err);
      setError("Failed to fetch ideas");
    } finally {
      setIsLoading(false);
    }
  };

  const addIdea = async (
    ideaData: Omit<PostIdea, "id" | "userId" | "createdAt">
  ) => {
    if (!user?.uid) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const result = await addNewPostIdea({
        ...ideaData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });

      if (result.success) {
        // Add the new idea to the local state
        const newIdea: PostIdea = {
          id: result.id!,
          ...ideaData,
          userId: user.uid,
          createdAt: Timestamp.now(),
        };
        setIdeas((prevIdeas) => [newIdea, ...prevIdeas]);
      }

      return result;
    } catch (error) {
      console.error("Error adding idea:", error);
      return { success: false, error };
    }
  };

  const removeIdea = async (ideaId: string) => {
    try {
      const result = await deletePostIdea(ideaId);

      if (result.success) {
        setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== ideaId));
      }

      return result;
    } catch (error) {
      console.error("Error removing idea:", error);
      return { success: false, error };
    }
  };

  const editIdea = async (ideaId: string, updateData: Partial<PostIdea>) => {
    try {
      const result = await updatePostIdea(ideaId, updateData);

      if (result.success) {
        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) =>
            idea.id === ideaId ? { ...idea, ...updateData } : idea
          )
        );
      }

      return result;
    } catch (error) {
      console.error("Error editing idea:", error);
      return { success: false, error };
    }
  };

  const refreshIdeas = async () => {
    await fetchIdeas(true);
  };

  const loadNextPage = async () => {
    if (!hasMore || isLoading) return;
    await fetchIdeas(false);
  };

  const resetPagination = () => {
    setIdeas([]);
    setHasMore(false);
    setCurrentPage(1);
    setLastDoc(null);
  };

  // Fetch ideas when user changes
  useEffect(() => {
    fetchIdeas(true);
  }, [user?.uid]);

  const value: IdeasContextType = {
    ideas,
    isLoading,
    error,
    hasMore,
    currentPage,
    addIdea,
    removeIdea,
    editIdea,
    refreshIdeas,
    loadNextPage,
    resetPagination,
  };

  return (
    <IdeasContext.Provider value={value}>{children}</IdeasContext.Provider>
  );
};

export const useIdeas = () => {
  const context = useContext(IdeasContext);
  if (!context) {
    throw new Error("useIdeas must be used within an IdeasProvider");
  }
  return context;
};
