// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "./firebase.config";
import { logEvent } from "firebase/analytics";

const PageViewTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view", { page_path: pathname });
    }
  }, [pathname]);

  return null;
};

export default PageViewTracker;
