// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { motion, Variants } from "motion/react";
import { oswald } from "../ui/fonts";
import { Calendar, LucideIcon } from "lucide-react";

interface LegalHeroProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientColors: {
    iconBg: string;
    iconColor: string;
    divider: string;
  };
  itemVariants: Variants;
  iconVariants: Variants;
}

const LegalHero = ({
  icon: Icon,
  title,
  description,
  gradientColors,
  itemVariants,
  iconVariants,
}: LegalHeroProps) => {
  return (
    <motion.section className="text-center py-16 mb-8" variants={itemVariants}>
      <motion.div
        className="flex justify-center mb-8"
        variants={iconVariants}
        whileHover="hover"
      >
        <div
          className={`flex items-center justify-center p-4 rounded-full h-20 w-20 ${gradientColors.iconBg} shadow-lg`}
        >
          <Icon className={`w-10 h-10 ${gradientColors.iconColor}`} />
        </div>
      </motion.div>

      <motion.h1
        className={`${oswald.className} text-4xl md:text-5xl font-bold text-slate-800 mb-6 tracking-wide`}
        variants={itemVariants}
      >
        {title}
      </motion.h1>

      <motion.div
        className={`w-24 h-1 ${gradientColors.divider} mx-auto rounded-full mb-8`}
        variants={itemVariants}
      />

      <motion.p
        className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed"
        variants={itemVariants}
      >
        {description}
      </motion.p>

      <motion.div
        className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500"
        variants={itemVariants}
      >
        <Calendar className="w-4 h-4" />
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </motion.div>
    </motion.section>
  );
};

export default LegalHero;
