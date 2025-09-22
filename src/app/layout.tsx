// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT
import type { Metadata } from "next";
import "./globals.css";
import { urbanist } from "@/components/ui/fonts";
import { AuthProvider } from "@/context/AuthContext";
import { PostsProvider } from "@/context/PostsContext";
import { IdeasProvider } from "@/context/IdeasContext";
import PageViewTracker from "@/lib/firebase/PageViewTracker";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Agent Growth Hub",
    default: "Agent Growth Hub - AI-Powered LinkedIn Content Generator",
  },
  description: "Agent Growth Hub - AI-Powered LinkedIn Content Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.className} antialiased bg-gradient-to-br from-slate-100 to-sky-100`}
      >
        <AuthProvider>
          <PostsProvider>
            <IdeasProvider>
              <NavBar />
              {children}
              <Footer />
            </IdeasProvider>
          </PostsProvider>
        </AuthProvider>
        <PageViewTracker />
      </body>
    </html>
  );
}
