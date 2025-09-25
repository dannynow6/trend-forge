// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { motion, Variants } from "motion/react";
import { oswald } from "../ui/fonts";
import { Mail } from "lucide-react";

const Contact = ({
  itemVariants,
  iconVariants,
  title,
  description,
}: {
  itemVariants: Variants;
  iconVariants: Variants;
  title: string;
  description: string;
}) => {
  return (
    <motion.section
      className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200"
      variants={itemVariants}
    >
      <motion.div
        className="flex justify-center mb-6"
        variants={iconVariants}
        whileHover="hover"
      >
        <div className="flex items-center justify-center p-3 rounded-full h-16 w-16 bg-gradient-to-br from-blue-100 to-sky-100 shadow-lg">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
      </motion.div>

      <motion.h2
        className={`${oswald.className} text-2xl font-semibold text-slate-800 mb-4`}
        variants={itemVariants}
      >
        {title}
      </motion.h2>

      <motion.p
        className="text-slate-600 mb-6 max-w-2xl mx-auto"
        variants={itemVariants}
      >
        {description}
      </motion.p>

      <motion.a
        href="mailto:apps_dg@proton.me"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        variants={itemVariants}
      >
        <Mail className="w-5 h-5" />
        Contact Us
      </motion.a>
    </motion.section>
  );
};

export default Contact;
