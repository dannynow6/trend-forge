// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT
import { Metadata } from "next";
import { urbanist } from "@/components/ui/fonts";
import PrivacyPolicyClient from "@/components/legal/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how TrendForge protects your privacy and handles your personal information. Comprehensive privacy policy covering data collection, usage, and your rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <section
      className={`${urbanist.className} antialiased bg-gradient-to-br from-slate-100 to-sky-100 max-w-[1440px] mx-auto px-6 py-12`}
    >
      <PrivacyPolicyClient />
    </section>
  );
}
