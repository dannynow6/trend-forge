"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const FooterNavLink = ({
  href,
  linkText,
}: {
  href: string;
  linkText: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-slate-700 hover:underline hover:text-slate-800 underline-offset-2 text-xs text-medium decoration-slate-800 ${
        isActive ? "underline" : ""
      } ${
        isActive ? "text-slate-800" : ""
      } transition-all duration-200 ease-in-out`}
      aria-current={isActive ? "page" : undefined}
      aria-label={`Go to ${linkText} page`}
    >
      {linkText}
    </Link>
  );
};

export default FooterNavLink;
