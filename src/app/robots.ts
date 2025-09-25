// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about",
        "/terms-and-conditions",
        "/privacy-policy",
        "/my-ideas",
        "/my-posts",
        "/my-ideas/idea/:id",
        "/my-posts/post/:id",
      ],
      disallow: [
        "/api/",
        "/_next/",
        "/_static/",
        "/_static/images/",
        "/my-ideas/idea",
        "/my-posts/post",
      ],
    },
    sitemap: "http://localhost:3000/sitemap.xml",
  };
}
