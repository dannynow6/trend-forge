// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

"use client";
import { motion, Variants } from "motion/react";
import { oswald } from "../ui/fonts";
import { CheckCircle, XCircle } from "lucide-react";

interface UseItem {
  text: string;
  allowed: boolean;
}

interface AcceptableUseSectionProps {
  items: UseItem[];
  itemVariants: Variants;
}

const AcceptableUseSection = ({
  items,
  itemVariants,
}: AcceptableUseSectionProps) => {
  const allowedItems = items.filter((item) => item.allowed);
  const prohibitedItems = items.filter((item) => !item.allowed);

  return (
    <motion.section
      className="bg-gradient-to-br from-slate-50 to-sky-50 p-8 rounded-xl"
      variants={itemVariants}
    >
      <motion.h2
        className={`${oswald.className} text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3`}
        variants={itemVariants}
      >
        <CheckCircle className="w-6 h-6 text-green-600" />
        Acceptable Use Policy
      </motion.h2>

      <motion.div className="grid md:grid-cols-2 gap-6" variants={itemVariants}>
        <div>
          <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Acceptable Uses
          </h3>
          <motion.ul className="space-y-3" variants={itemVariants}>
            {allowedItems.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 text-slate-600 text-sm"
                variants={itemVariants}
              >
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {item.text}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div>
          <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Prohibited Uses
          </h3>
          <motion.ul className="space-y-3" variants={itemVariants}>
            {prohibitedItems.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 text-slate-600 text-sm"
                variants={itemVariants}
              >
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                {item.text}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default AcceptableUseSection;
