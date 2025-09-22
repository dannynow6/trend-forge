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
  getUserPostIdeas,
  deletePostIdea,
  updatePostIdea,
  PostIdea,
} from "@/lib/firebase/getPostIdeas";
import { addNewPostIdea } from "@/lib/firebase/addNewPostIdea";
import { Timestamp } from "firebase/firestore";

interface IdeasContextType {
  ideas: PostIdea[];
  isLoading: boolean;
  error: string | null;
  addIdea: (
    ideaData: Omit<PostIdea, "id" | "userId" | "createdAt">
  ) => Promise<{ success: boolean; id?: string; error?: any }>;
  removeIdea: (ideaId: string) => Promise<{ success: boolean; error?: any }>;
  editIdea: (
    ideaId: string,
    updateData: Partial<PostIdea>
  ) => Promise<{ success: boolean; error?: any }>;
  refreshIdeas: () => Promise<void>;
}

const IdeasContext = createContext<IdeasContextType>({
  ideas: [],
  isLoading: true,
  error: null,
  addIdea: async () => ({ success: false }),
  removeIdea: async () => ({ success: false }),
  editIdea: async () => ({ success: false }),
  refreshIdeas: async () => {},
});

interface IdeasProviderProps {
  children: ReactNode;
}

export const IdeasProvider = ({ children }: IdeasProviderProps) => {
  const [ideas, setIdeas] = useState<PostIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth() as { user: any };

  const fetchIdeas = async () => {
    if (!user?.uid) {
      setIdeas([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userIdeas = await getUserPostIdeas(user.uid);
      setIdeas(userIdeas);
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
    await fetchIdeas();
  };

  // Fetch ideas when user changes
  useEffect(() => {
    fetchIdeas();
  }, [user?.uid]);

  const value: IdeasContextType = {
    ideas,
    isLoading,
    error,
    addIdea,
    removeIdea,
    editIdea,
    refreshIdeas,
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
