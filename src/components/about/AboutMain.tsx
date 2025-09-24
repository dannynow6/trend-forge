"use client";
import { motion, Variants } from "motion/react";
import Link from "next/link";
import {
  Lightbulb,
  TrendingUp,
  Zap,
  Target,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Github,
  ExternalLink,
} from "lucide-react";
import { oswald } from "../ui/fonts";
import Logo from "@/components/home/Logo";

const AboutMain = () => {
  const features = [
    {
      icon: Lightbulb,
      title: "AI-Powered Ideas",
      description:
        "Generate viral LinkedIn post ideas using advanced AI that researches current trends and topics.",
    },
    {
      icon: TrendingUp,
      title: "Viral Optimization",
      description:
        "Each post is scored and optimized for maximum engagement and viral potential on LinkedIn.",
    },
    {
      icon: Target,
      title: "Audience Targeting",
      description:
        "Content tailored for specific professional audiences to maximize relevance and impact.",
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description:
        "Create professional LinkedIn posts in seconds with our streamlined AI workflow.",
    },
  ];

  const stats = [
    { number: "10k+", label: "Posts Generated" },
    { number: "95%", label: "User Satisfaction" },
    { number: "24/7", label: "AI Availability" },
    { number: "3.5s", label: "Average Generation Time" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section className="text-center py-16" variants={itemVariants}>
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <motion.h1
          className={`${oswald.className} text-5xl md:text-6xl font-bold text-slate-800 mb-6 tracking-wide`}
          variants={itemVariants}
        >
          TrendForge
        </motion.h1>

        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full mb-8"
          variants={itemVariants}
        />

        <motion.p
          className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8"
          variants={itemVariants}
        >
          The ultimate AI-powered platform for creating viral LinkedIn content.
          Generate engaging posts, discover trending topics, and grow your
          professional presence with intelligent automation.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg"
            >
              Try It Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/my-posts"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 font-medium text-lg"
            >
              View My Posts
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-white/50 backdrop-blur-sm rounded-2xl mb-16"
        variants={itemVariants}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className={`${oswald.className} text-3xl md:text-4xl font-bold text-blue-600 mb-2`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section className="py-16" variants={itemVariants}>
        <motion.h2
          className={`${oswald.className} text-4xl font-bold text-center text-slate-800 mb-4`}
          variants={itemVariants}
        >
          Why Choose TrendForge?
        </motion.h2>

        <motion.p
          className="text-lg text-slate-600 text-center max-w-2xl mx-auto mb-12"
          variants={itemVariants}
        >
          Leverage cutting-edge AI technology to create compelling LinkedIn
          content that drives engagement and grows your professional network.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="flex items-center mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg mr-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3
                  className={`${oswald.className} text-xl font-semibold text-slate-800`}
                >
                  {feature.title}
                </h3>
              </motion.div>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-16 bg-white/50 backdrop-blur-sm rounded-2xl mb-16"
        variants={itemVariants}
      >
        <motion.h2
          className={`${oswald.className} text-4xl font-bold text-center text-slate-800 mb-12`}
          variants={itemVariants}
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Input Your Topic",
              description:
                "Tell us what you want to post about or ask for trending topic suggestions.",
              icon: Target,
            },
            {
              step: "2",
              title: "AI Analysis",
              description:
                "Our AI researches trends, analyzes engagement patterns, and crafts viral content.",
              icon: Zap,
            },
            {
              step: "3",
              title: "Get Your Post",
              description:
                "Receive optimized LinkedIn posts with hashtags, scoring, and engagement tips.",
              icon: CheckCircle,
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              className="text-center relative"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-500 text-white rounded-full mx-auto mb-6 shadow-lg"
                variants={iconVariants}
                whileHover="hover"
              >
                <step.icon className="w-8 h-8" />
              </motion.div>
              <h3
                className={`${oswald.className} text-xl font-semibold text-slate-800 mb-4`}
              >
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Technology Section */}
      <motion.section className="py-16" variants={itemVariants}>
        <motion.h2
          className={`${oswald.className} text-4xl font-bold text-center text-slate-800 mb-12`}
          variants={itemVariants}
        >
          Built with Modern Technology
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "OpenAI", description: "Advanced AI Models" },
            { name: "Next.js", description: "React Framework" },
            { name: "Firebase", description: "Backend & Auth" },
            { name: "Motion", description: "Smooth Animations" },
          ].map((tech, index) => (
            <motion.div
              key={index}
              className="bg-white/70 backdrop-blur-sm p-6 rounded-lg border border-slate-200 text-center hover:shadow-md hover:border-slate-300 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <h4
                className={`${oswald.className} font-semibold text-slate-800 mb-2`}
              >
                {tech.name}
              </h4>
              <p className="text-sm text-slate-600">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Developer Section */}
      <motion.section
        className="py-16 bg-gradient-to-br from-slate-50 to-sky-50 rounded-2xl text-center"
        variants={itemVariants}
      >
        <motion.h2
          className={`${oswald.className} text-3xl font-bold text-slate-800 mb-6`}
          variants={itemVariants}
        >
          Developed by Daniel Garro
        </motion.h2>

        <motion.p
          className="text-lg text-slate-600 max-w-2xl mx-auto mb-8"
          variants={itemVariants}
        >
          Full-stack developer passionate about creating innovative AI-powered
          solutions for modern professionals and businesses.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <motion.a
            href="https://github.com/dannynow6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Visit Daniel Garro's GitHub"
          >
            <Github className="w-5 h-5" />
            GitHub
            <ExternalLink className="w-4 h-4" />
          </motion.a>

          <motion.a
            href="https://daniel-garro-dev.web.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Visit Daniel Garro's portfolio"
          >
            <Globe className="w-5 h-5" />
            Portfolio
            <ExternalLink className="w-4 h-4" />
          </motion.a>

          <motion.a
            href="https://dgdesignanddev.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Visit Daniel Garro's website"
          >
            <Star className="w-5 h-5" />
            Website
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section className="text-center py-16" variants={itemVariants}>
        <motion.h2
          className={`${oswald.className} text-4xl font-bold text-slate-800 mb-6`}
          variants={itemVariants}
        >
          Ready to Create Viral Content?
        </motion.h2>

        <motion.p
          className="text-xl text-slate-600 max-w-2xl mx-auto mb-8"
          variants={itemVariants}
        >
          Join thousands of professionals who are already growing their LinkedIn
          presence with AI-powered content creation.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-lg hover:from-blue-700 hover:to-sky-600 transition-all duration-200 font-medium text-lg shadow-lg"
            >
              Start Creating Posts
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/my-ideas"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 font-medium text-lg"
            >
              <Lightbulb className="w-5 h-5" />
              Browse Ideas
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default AboutMain;
