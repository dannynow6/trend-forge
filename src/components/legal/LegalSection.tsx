// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { motion, Variants } from "motion/react";
import { oswald } from "../ui/fonts";
import { LucideIcon } from "lucide-react";

interface LegalSectionProps {
  title: string;
  icon: LucideIcon;
  content: string[];
  iconColors: {
    bg: string;
    icon: string;
    bullet: string;
  };
  itemVariants: Variants;
  iconVariants: Variants;
}

const LegalSection = ({
  title,
  icon: Icon,
  content,
  iconColors,
  itemVariants,
  iconVariants,
}: LegalSectionProps) => {
  return (
    <motion.section
      className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-slate-200"
      variants={itemVariants}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className="flex items-center mb-6"
        variants={iconVariants}
        whileHover="hover"
      >
        <div
          className={`flex items-center justify-center w-12 h-12 ${iconColors.bg} rounded-lg mr-4`}
        >
          <Icon className={`w-6 h-6 ${iconColors.icon}`} />
        </div>
        <h2
          className={`${oswald.className} text-2xl font-semibold text-slate-800`}
        >
          {title}
        </h2>
      </motion.div>

      <motion.ul className="space-y-4" variants={itemVariants}>
        {content.map((item, itemIndex) => (
          <motion.li
            key={itemIndex}
            className="flex items-start gap-3 text-slate-600 leading-relaxed"
            variants={itemVariants}
          >
            <div
              className={`w-2 h-2 ${iconColors.bullet} rounded-full mt-2 flex-shrink-0`}
            />
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
};

export default LegalSection;
