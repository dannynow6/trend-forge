// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

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

export interface PaginatedResult {
  posts: LinkedInPost[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
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

export const getUserPostsPaginated = async (
  userId: string,
  pageSize: number = 10,
  lastDoc?: DocumentSnapshot
): Promise<PaginatedResult> => {
  try {
    let q = query(
      collection(db, "linkedin_posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        collection(db, "linkedin_posts"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const posts: LinkedInPost[] = [];

    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      } as LinkedInPost);
    });

    const lastDocument =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    const hasMore = querySnapshot.docs.length === pageSize;

    return {
      posts,
      lastDoc: lastDocument,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching user posts with pagination: ", error);
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
