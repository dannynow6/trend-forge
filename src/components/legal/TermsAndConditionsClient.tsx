"use client";
import { motion } from "motion/react";
import {
  FileText,
  Scale,
  AlertTriangle,
  Shield,
  Users,
  CheckCircle,
} from "lucide-react";
import Contact from "./Contact";
import LegalPageLayout from "./LegalPageLayout";
import LegalHero from "./LegalHero";
import LegalSection from "./LegalSection";
import AdditionalInfoSection from "./AdditionalInfoSection";
import AcceptableUseSection from "./AcceptableUseSection";
import { useLegalAnimations } from "./useLegalAnimations";

const TermsAndConditionsClient = () => {
  const { itemVariants, iconVariants } = useLegalAnimations();

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: [
        "By accessing and using TrendForge, you accept and agree to be bound by these terms",
        "If you do not agree to these terms, please discontinue use of our services",
        "We reserve the right to update these terms at any time with reasonable notice",
        "Continued use after changes constitutes acceptance of the modified terms",
      ],
    },
    {
      title: "Service Description",
      icon: FileText,
      content: [
        "TrendForge provides AI-powered LinkedIn content generation services",
        "Our platform helps users create professional posts, ideas, and social media content",
        "Services are provided on an 'as-is' basis and may be modified or discontinued",
        "We do not guarantee specific results or outcomes from using our platform",
      ],
    },
    {
      title: "User Responsibilities",
      icon: Users,
      content: [
        "You are responsible for maintaining the security of your account credentials",
        "Content you create must comply with LinkedIn's terms of service and community guidelines",
        "You may not use our service for illegal, harmful, or malicious purposes",
        "You are solely responsible for the content you publish on social media platforms",
      ],
    },
    {
      title: "Intellectual Property",
      icon: Shield,
      content: [
        "You retain ownership of content you create using our platform",
        "TrendForge retains rights to our proprietary AI technology and platform",
        "You grant us a limited license to process your content for service delivery",
        "Respect third-party intellectual property rights when creating content",
      ],
    },
    {
      title: "Limitations & Disclaimers",
      icon: AlertTriangle,
      content: [
        "Our AI-generated content is for inspiration and may require human review",
        "We are not liable for consequences of content you publish on social platforms",
        "Service availability may be subject to maintenance, updates, or technical issues",
        "Total liability is limited to the amount paid for services in the past 12 months",
      ],
    },
  ];

  const acceptableUse = [
    { text: "Creating professional LinkedIn content", allowed: true },
    { text: "Generating business and industry insights", allowed: true },
    { text: "Personal branding and thought leadership", allowed: true },
    { text: "Sharing generated content on social platforms", allowed: true },
    { text: "Creating misleading or false information", allowed: false },
    {
      text: "Generating content that violates platform policies",
      allowed: false,
    },
    {
      text: "Attempting to reverse engineer our AI technology",
      allowed: false,
    },
    {
      text: "Using the service for spam or malicious purposes",
      allowed: false,
    },
  ];

  const additionalTermsItems = [
    {
      title: "Account Termination",
      content:
        "We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful activities. Users may also terminate their accounts at any time through account settings.",
    },
    {
      title: "Service Modifications",
      content:
        "TrendForge may modify, suspend, or discontinue any aspect of the service at any time. We will provide reasonable notice for significant changes that affect user experience.",
    },
    {
      title: "Governing Law",
      content:
        "These terms are governed by the laws of the jurisdiction where TrendForge operates. Any disputes will be resolved through appropriate legal channels in that jurisdiction.",
    },
    {
      title: "Contact & Support",
      content:
        "For questions about these terms or to report violations, please contact our support team. We are committed to addressing concerns promptly and fairly.",
    },
  ];

  const iconColors = {
    bg: "bg-gradient-to-br from-blue-100 to-indigo-100",
    icon: "text-blue-600",
    bullet: "bg-blue-500",
  };

  const gradientColors = {
    iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
    iconColor: "text-blue-600",
    divider: "bg-gradient-to-r from-blue-400 to-indigo-500",
  };

  return (
    <LegalPageLayout>
      <LegalHero
        icon={Scale}
        title="Terms and Conditions"
        description="Please read these terms carefully. They govern your use of TrendForge and outline the rights and responsibilities of all users."
        gradientColors={gradientColors}
        itemVariants={itemVariants}
        iconVariants={iconVariants}
      />

      <motion.div className="space-y-12" variants={itemVariants}>
        {sections.map((section, index) => (
          <LegalSection
            key={index}
            title={section.title}
            icon={section.icon}
            content={section.content}
            iconColors={iconColors}
            itemVariants={itemVariants}
            iconVariants={iconVariants}
          />
        ))}

        <AcceptableUseSection
          items={acceptableUse}
          itemVariants={itemVariants}
        />

        <AdditionalInfoSection
          title="Additional Terms"
          icon={FileText}
          items={additionalTermsItems}
          backgroundClass="bg-white/70 backdrop-blur-sm border border-slate-200"
          iconColor="text-slate-600"
          itemVariants={itemVariants}
        />

        <Contact
          itemVariants={itemVariants}
          iconVariants={iconVariants}
          title="Questions About These Terms?"
          description="If you have any questions about these terms and conditions or need clarification, we're here to help."
        />
      </motion.div>
    </LegalPageLayout>
  );
};

export default TermsAndConditionsClient;
