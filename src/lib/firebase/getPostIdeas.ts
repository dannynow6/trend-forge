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
