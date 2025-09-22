// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT
import { Metadata } from "next";
import { urbanist } from "@/components/ui/fonts";
import AboutMain from "@/components/about/AboutMain";

export const metadata: Metadata = {
  title: "About | Agent Growth Hub",
  description:
    "Learn about Agent Growth Hub - the ultimate AI-powered platform for creating viral LinkedIn content. Generate engaging posts, discover trending topics, and grow your professional presence.",
};

export default function AboutPage() {
  return (
    <section
      className={`${urbanist.className} antialiased bg-gradient-to-br from-slate-100 to-sky-100 max-w-[1440px] mx-auto px-6 py-12`}
    >
      <AboutMain />
    </section>
  );
}
