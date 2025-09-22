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

export interface LinkedInPost {
  id: string;
  content: string;
  hashtags: string[];
  firstComment: string;
  userId: string;
  createdAt: any; // Timestamp
  viral_score?: number;
  visual_content?: string;
}

export const getUserPosts = async (userId: string): Promise<LinkedInPost[]> => {
  try {
    const q = query(
      collection(db, "linkedin_posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const posts: LinkedInPost[] = [];

    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      } as LinkedInPost);
    });

    return posts;
  } catch (error) {
    console.error("Error fetching user posts: ", error);
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, "linkedin_posts", postId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting post: ", error);
    return { success: false, error };
  }
};

export const updatePost = async (
  postId: string,
  updateData: Partial<LinkedInPost>
) => {
  try {
    const postRef = doc(db, "linkedin_posts", postId);
    await updateDoc(postRef, updateData);
    return { success: true };
  } catch (error) {
    console.error("Error updating post: ", error);
    return { success: false, error };
  }
};
