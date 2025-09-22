// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT
import { Metadata } from "next";
import { urbanist } from "@/components/ui/fonts";
import TermsAndConditionsClient from "@/components/legal/TermsAndConditionsClient";

export const metadata: Metadata = {
  title: "Terms and Conditions | Agent Growth Hub",
  description:
    "Read the terms and conditions for using Agent Growth Hub. Clear guidelines on user responsibilities, service usage, and our commitment to you.",
};

export default function TermsAndConditionsPage() {
  return (
    <section
      className={`${urbanist.className} antialiased bg-gradient-to-br from-slate-100 to-sky-100 max-w-[1440px] mx-auto px-6 py-12`}
    >
      <TermsAndConditionsClient />
    </section>
  );
}
