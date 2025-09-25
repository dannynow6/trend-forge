// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import SignOut from "@/components/auth/SignOut";
import { motion } from "motion/react";
import NavDropdownLink from "./NavDropdownLink";
import { Lightbulb, MessageSquare, Sparkles } from "lucide-react";

const NavBar = () => {
  const { user, isLoading } = useAuth() as { user: any; isLoading: boolean };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll direction for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Don't hide navbar if at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide navbar
        setIsVisible(false);
        setIsDropdownOpen(false); // Close dropdown when hiding
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [lastScrollY]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user && !isLoading) {
    return null;
  }

  return (
    <>
      {user && (
        <motion.nav
          initial={{ y: 0 }}
          animate={{
            y: isVisible ? 0 : -100,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1],
            type: "tween",
          }}
          className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm px-4 py-3"
        >
          <div className="max-w-[1440px] mx-auto flex justify-end items-center">
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none"
                aria-label="Open user menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="w-10 h-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200"
                  whileHover={{
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    y: -1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={`${user.displayName}'s profile picture`}
                      className="w-10 h-10 rounded-full self-center object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full self-center bg-sky-100 flex items-center justify-center">
                      <span className="text-slate-700 font-semibold">
                        {user.displayName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </motion.div>
              </motion.button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.4, 0.0, 0.2, 1],
                    type: "tween",
                  }}
                  className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-slate-200 to-slate-300 backdrop-blur-sm rounded shadow-lg py-2 z-50"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05, duration: 0.15 }}
                    className="px-4 py-2 border-b border-sky-300/40"
                  >
                    <p className="text-slate-800 capitalize text-sm truncate">
                      {user ? `Hi, ${user.displayName}` : "User"}
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="px-4 py-2"
                  >
                    <NavDropdownLink href="/" linkText="New Post or Ideas">
                      <Sparkles
                        className="w-4 h-4"
                        aria-label="Generate new post or ideas"
                        strokeWidth={1.5}
                      />{" "}
                      New Post or Ideas
                    </NavDropdownLink>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="px-4 py-2"
                  >
                    <NavDropdownLink href="/my-posts" linkText="My Saved Posts">
                      <MessageSquare
                        className="w-4 h-4"
                        aria-label="Go to my saved posts"
                        strokeWidth={1.5}
                      />{" "}
                      My Posts
                    </NavDropdownLink>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                    className="px-4 py-2"
                  >
                    <NavDropdownLink href="/my-ideas" linkText="My Saved Ideas">
                      <Lightbulb
                        className="w-4 h-4"
                        aria-label="Go to my saved ideas"
                        strokeWidth={1.5}
                      />{" "}
                      My Ideas
                    </NavDropdownLink>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.2 }}
                    className="px-4 py-2"
                  >
                    <SignOut />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.nav>
      )}
    </>
  );
};

export default NavBar;
