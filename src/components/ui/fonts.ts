// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

import { Inter, Oswald, Urbanist } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});
