// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

import { db } from "./firebase.config";
import { collection, addDoc } from "firebase/firestore";

interface LinkedInPostData {
  content: string;
  hashtags: string[];
  firstComment: string;
  userId: string;
  createdAt: any; // Timestamp
  viral_score?: number;
  visual_content?: string;
}

export const addNewPost = async (postData: LinkedInPostData) => {
  try {
    const docRef = await addDoc(collection(db, "linkedin_posts"), {
      content: postData.content,
      hashtags: postData.hashtags,
      firstComment: postData.firstComment,
      userId: postData.userId,
      createdAt: postData.createdAt,
      viral_score: postData.viral_score || null,
      visual_content: postData.visual_content || null,
    });

    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error };
  }
};
