// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

import { db } from "./firebase.config";
import { collection, addDoc } from "firebase/firestore";

interface PostIdeaData {
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

export const addNewPostIdea = async (postIdeaData: PostIdeaData) => {
  try {
    const docRef = await addDoc(collection(db, "post_ideas"), {
      title: postIdeaData.title,
      viralPotential: postIdeaData.viralPotential,
      hook: postIdeaData.hook,
      description: postIdeaData.description,
      targetAudience: postIdeaData.targetAudience,
      contentType: postIdeaData.contentType,
      trendingFactors: postIdeaData.trendingFactors,
      userId: postIdeaData.userId,
      createdAt: postIdeaData.createdAt,
    });

    console.log("Post idea saved with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving post idea: ", error);
    return { success: false, error };
  }
};
