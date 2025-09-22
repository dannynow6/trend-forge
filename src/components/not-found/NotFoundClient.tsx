"use client";
import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, Lightbulb, MessageSquare } from "lucide-react";
import { oswald } from "../ui/fonts";
import Logo from "../../../public/logo.png";
import { motion } from "motion/react";

const NotFoundClient = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <motion.div
        className="max-w-md w-full text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center justify-center p-2 rounded-full h-24 w-24 bg-sky-100"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src={Logo}
              alt="Logo"
              className="w-[80px] h-[80px]"
              priority
            />
          </motion.div>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <motion.h1
            className={`${oswald.className} text-8xl font-bold text-slate-800 tracking-wide`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            404
          </motion.h1>
          <motion.div
            className="w-16 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 64, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          ></motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        >
          <h2
            className={`${oswald.className} text-2xl font-semibold text-slate-700 tracking-wide`}
          >
            Page Not Found
          </h2>
          <p className="text-slate-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out font-medium"
              aria-label="Go to home page"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/my-posts"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 text-sm font-medium"
                aria-label="Go to my posts page"
              >
                <MessageSquare className="w-4 h-4" />
                My Posts
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/my-ideas"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 text-sm font-medium"
                aria-label="Go to my ideas page"
              >
                <Lightbulb className="w-4 h-4" />
                My Ideas
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          className="pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2, ease: "easeOut" }}
        >
          <motion.button
            onClick={() => window.history.back()}
            className="inline-flex cursor-pointer items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors duration-200 text-sm font-medium"
            aria-label="Go back to previous page"
            whileHover={{ x: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 bg-sky-100/50 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      ></motion.div>
      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
      ></motion.div>
      <motion.div
        className="absolute top-1/3 right-20 w-16 h-16 bg-slate-100/40 rounded-full blur-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
      ></motion.div>
    </div>
  );
};

export default NotFoundClient;
