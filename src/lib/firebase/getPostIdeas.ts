import { db } from "./firebase.config";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";

export interface PostIdea {
  id: string;
  title: string;
  viralPotential: number;
  hook: string;
  description: string;
  targetAudience: string;
  contentType: string;
  trendingFactors: string[];
  userId: string;
  createdAt: any; // Timestamp
}

export interface PaginatedIdeasResult {
  ideas: PostIdea[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}

export const getUserPostIdeas = async (userId: string): Promise<PostIdea[]> => {
  try {
    const q = query(
      collection(db, "post_ideas"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const ideas: PostIdea[] = [];

    querySnapshot.forEach((doc) => {
      ideas.push({
        id: doc.id,
        ...doc.data(),
      } as PostIdea);
    });

    return ideas;
  } catch (error) {
    console.error("Error fetching user post ideas: ", error);
    throw error;
  }
};

export const deletePostIdea = async (ideaId: string) => {
  try {
    await deleteDoc(doc(db, "post_ideas", ideaId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting post idea: ", error);
    return { success: false, error };
  }
};

export const getUserPostIdeasPaginated = async (
  userId: string,
  pageSize: number = 10,
  lastDoc?: DocumentSnapshot
): Promise<PaginatedIdeasResult> => {
  try {
    let q = query(
      collection(db, "post_ideas"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        collection(db, "post_ideas"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const ideas: PostIdea[] = [];

    querySnapshot.forEach((doc) => {
      ideas.push({
        id: doc.id,
        ...doc.data(),
      } as PostIdea);
    });

    const lastDocument =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    const hasMore = querySnapshot.docs.length === pageSize;

    return {
      ideas,
      lastDoc: lastDocument,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching user post ideas with pagination: ", error);
    throw error;
  }
};

export const updatePostIdea = async (
  ideaId: string,
  updateData: Partial<PostIdea>
) => {
  try {
    const ideaRef = doc(db, "post_ideas", ideaId);
    await updateDoc(ideaRef, updateData);
    return { success: true };
  } catch (error) {
    console.error("Error updating post idea: ", error);
    return { success: false, error };
  }
};
