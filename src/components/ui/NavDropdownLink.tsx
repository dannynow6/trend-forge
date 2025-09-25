// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavDropdownLink = ({
  href,
  linkText,
  children,
}: {
  href: string;
  linkText: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex flex-row items-center gap-2 text-slate-700 hover:underline hover:text-slate-800 underline-offset-2 text-sm text-medium decoration-slate-800 ${
        isActive ? "underline" : ""
      } ${
        isActive ? "text-slate-800" : ""
      } transition-all duration-200 ease-in-out`}
      aria-current={isActive ? "page" : undefined}
      aria-label={`Go to ${linkText} page`}
    >
      {children}
    </Link>
  );
};

export default NavDropdownLink;
