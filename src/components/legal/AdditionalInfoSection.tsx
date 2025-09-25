// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { motion, Variants } from "motion/react";
import { oswald } from "../ui/fonts";
import { LucideIcon } from "lucide-react";

interface InfoItem {
  title: string;
  content: string;
}

interface AdditionalInfoSectionProps {
  title: string;
  icon: LucideIcon;
  items: InfoItem[];
  backgroundClass?: string;
  iconColor?: string;
  itemVariants: Variants;
}

const AdditionalInfoSection = ({
  title,
  icon: Icon,
  items,
  backgroundClass = "bg-gradient-to-br from-slate-50 to-sky-50",
  iconColor = "text-blue-600",
  itemVariants,
}: AdditionalInfoSectionProps) => {
  return (
    <motion.section
      className={`${backgroundClass} p-8 rounded-xl`}
      variants={itemVariants}
    >
      <motion.h2
        className={`${oswald.className} text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3`}
        variants={itemVariants}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
        {title}
      </motion.h2>

      <motion.div className="grid md:grid-cols-2 gap-6" variants={itemVariants}>
        {items.map((item, index) => (
          <div key={index}>
            <h3 className="font-semibold text-slate-800 mb-3">{item.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {item.content}
            </p>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default AdditionalInfoSection;
