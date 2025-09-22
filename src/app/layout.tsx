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
  metadataBase: new URL("http://localhost:3000"),
  applicationName: "TrendForge",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "TrendForge - AI-Powered LinkedIn Content Generator",
    description: "TrendForge - AI-Powered LinkedIn Content Generator",
    url: "http://localhost:3000",
    siteName: "TrendForge",
    images: [
      {
        url: "./opengraph-image.png",
        width: 500,
        height: 500,
        alt: "TrendForge - AI-Powered LinkedIn Content Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendForge",
    description: "TrendForge - AI-Powered LinkedIn Content Generator",
    images: [
      {
        url: "./twitter-image.png",
        width: 500,
        height: 500,
        alt: "TrendForge - AI-Powered LinkedIn Content Generator",
      },
    ],
  },
  title: {
    template: "%s | TrendForge",
    default: "TrendForge - AI-Powered LinkedIn Content Generator",
  },
  description: "TrendForge - AI-Powered LinkedIn Content Generator",
  keywords: [
    "TrendForge",
    "AI-Powered LinkedIn Content Generator",
    "LinkedIn Content Generator",
    "LinkedIn Content",
    "LinkedIn",
    "Content",
    "Generator",
  ],
  authors: [{ name: "Daniel Garro", url: "https://dgdesignanddev.com/" }],
  creator: "Daniel Garro",
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
