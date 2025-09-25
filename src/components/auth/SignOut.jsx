// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AuthButton from "./AuthButton";
import { LogOut } from "lucide-react";

const SignOut = () => {
  const { signOutUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <AuthButton
      ariaLabel="Sign out"
      onClick={() => handleSignOut()}
      bgColor="bg-cyan-100"
    >
      <LogOut alt="Sign out" className="w-4 h-4" strokeWidth={2} />
      Sign out
    </AuthButton>
  );
};

export default SignOut;
