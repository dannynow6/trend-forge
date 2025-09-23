"use client";
import { motion } from "motion/react";
import LogoImg from "../../../public/logo.png";
import Image from "next/image";

const Logo = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex items-center justify-center p-2 rounded-full h-32 w-32 bg-gradient-to-br from-sky-100 to-blue-100 shadow-lg"
    >
      <Image src={LogoImg} alt="Logo" className="w-24 h-24" priority />
    </motion.div>
  );
};

export default Logo;
