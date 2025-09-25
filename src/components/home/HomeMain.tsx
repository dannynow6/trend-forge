// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { useAuth } from "@/context/AuthContext";
import HomeNoUser from "./HomeNoUser";
import MessageContainer from "./MessageContainer";
import Logo from "./Logo";
import { Loader } from "lucide-react";

const HomeMain = () => {
  const { user, isLoading } = useAuth() as { user: any; isLoading: boolean };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin text-sky-500" />
        <span className="text-sky-500">Loading...</span>
      </div>
    );
  }

  return !user && !isLoading ? (
    <HomeNoUser />
  ) : (
    <main className="mt-20">
      <div className="flex justify-center mb-12">
        <Logo />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <MessageContainer />
      </div>
    </main>
  );
};

export default HomeMain;
