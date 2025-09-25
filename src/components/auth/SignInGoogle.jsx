// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AuthButton from "./AuthButton";
import GoogleIcon from "../../../public/google.png";
import Image from "next/image";

const SignInGoogle = () => {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <AuthButton ariaLabel="Sign in" onClick={() => handleSignIn()}>
      <Image src={GoogleIcon} alt="Google" width={20} height={20} />
      Sign in
    </AuthButton>
  );
};

export default SignInGoogle;
