"use client";
import { motion } from "motion/react";
import { Shield, Lock, UserCheck, Globe, FileText } from "lucide-react";
import Contact from "./Contact";
import LegalPageLayout from "./LegalPageLayout";
import LegalHero from "./LegalHero";
import LegalSection from "./LegalSection";
import AdditionalInfoSection from "./AdditionalInfoSection";
import { useLegalAnimations } from "./useLegalAnimations";

const PrivacyPolicyClient = () => {
  const { itemVariants, iconVariants } = useLegalAnimations();

  const sections = [
    {
      title: "Information We Collect",
      icon: UserCheck,
      content: [
        "Account information including email address and profile details",
        "Content you create including LinkedIn posts and ideas",
        "Usage data to improve our AI algorithms and user experience",
        "Technical information such as IP address, browser type, and device information",
      ],
    },
    {
      title: "How We Use Your Information",
      icon: Globe,
      content: [
        "To provide and improve our AI-powered content generation services",
        "To personalize your experience and content recommendations",
        "To communicate with you about updates, features, and support",
        "To analyze usage patterns and optimize our platform performance",
      ],
    },
    {
      title: "Data Protection & Security",
      icon: Lock,
      content: [
        "We implement industry-standard encryption to protect your data",
        "Regular security audits and vulnerability assessments",
        "Secure cloud infrastructure with Firebase and advanced access controls",
        "Your content and personal information are never shared with third parties",
      ],
    },
    {
      title: "Your Privacy Rights",
      icon: Shield,
      content: [
        "Access and download your personal data at any time",
        "Request correction or deletion of your information",
        "Opt-out of non-essential communications",
        "Control your content visibility and sharing preferences",
      ],
    },
  ];

  const additionalInfoItems = [
    {
      title: "Cookies & Analytics",
      content:
        "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie preferences through your browser settings.",
    },
    {
      title: "Third-Party Services",
      content:
        "Our platform integrates with OpenAI for content generation and Firebase for secure data storage. These services have their own privacy policies which we encourage you to review.",
    },
    {
      title: "Data Retention",
      content:
        "We retain your data only as long as necessary to provide our services or as required by law. You can request data deletion at any time through your account settings.",
    },
    {
      title: "Updates to Policy",
      content:
        "We may update this privacy policy periodically. Significant changes will be communicated via email or platform notifications before they take effect.",
    },
  ];

  const iconColors = {
    bg: "bg-gradient-to-br from-green-100 to-emerald-100",
    icon: "text-green-600",
    bullet: "bg-green-500",
  };

  const gradientColors = {
    iconBg: "bg-gradient-to-br from-green-100 to-emerald-100",
    iconColor: "text-green-600",
    divider: "bg-gradient-to-r from-green-400 to-emerald-500",
  };

  return (
    <LegalPageLayout>
      <LegalHero
        icon={Shield}
        title="Privacy Policy"
        description="Your privacy is important to us. This policy explains how Agent Growth Hub collects, uses, and protects your personal information."
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

        <AdditionalInfoSection
          title="Additional Information"
          icon={FileText}
          items={additionalInfoItems}
          itemVariants={itemVariants}
        />

        <Contact
          itemVariants={itemVariants}
          iconVariants={iconVariants}
          title="Questions About Privacy?"
          description="If you have any questions about this privacy policy or how we handle your data, please don't hesitate to contact us."
        />
      </motion.div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicyClient;
