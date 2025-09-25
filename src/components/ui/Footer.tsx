// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

import Logo from "../../../public/logo.png";
import DGLogo from "../../../public/dg-logo.png";
import Link from "next/link";
import Image from "next/image";
import FooterNavLink from "./FooterNavLink";

const Footer = () => {
  return (
    <footer className="rounded-t-md w-full h-64 bg-gradient-to-tr from-slate-100 to-sky-100 mx-auto py-6 px-4 sm:py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4">
        <Link href="/" aria-label="Go to home page">
          <Image
            src={Logo}
            alt="go to homepage"
            aria-label="Go to homepage"
            width={44}
            height={44}
            className="hover:scale-[1.02] transition-all duration-200 ease-in-out"
            title="Home"
          />
        </Link>
        <p className="text-slate-800 text-xs sm:text-sm lg:text-base">
          Copyright &copy; {new Date().getFullYear()} - All rights reserved by
          TrendForge
        </p>
        <div className="flex flex-row items-center justify-center gap-2.5">
          <FooterNavLink href="/about" linkText="About" />
          <FooterNavLink
            href="/terms-and-conditions"
            linkText="Terms and Conditions"
          />
          <FooterNavLink href="/privacy-policy" linkText="Privacy Policy" />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="text-slate-800 text-xs">
            Web app designed & developed by
          </p>

          <Link
            href="https://dgdesignanddev.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-800 flex flex-row items-center gap-2 text-xs hover:underline underline-offset-2 decoration-text-slate-800 hover:scale-[1.02] transition-all duration-200 ease-in-out"
            aria-label="Go to DG Design & Dev website"
          >
            <Image
              src={DGLogo}
              alt="Go to DG Design & Dev website"
              className="rounded-xs"
              loading="lazy"
              width={16}
              height={16}
            />
            DG Design & Dev
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
