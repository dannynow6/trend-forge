import type { Metadata } from "next";
import IdeaDetailsClient from "@/components/idea-details/IdeaDetailsClient";

export const metadata: Metadata = {
  title: "Ideas Details",
  description: "View LinkedIn post ideas details",
};

const IdeaDetailsPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen max-w-[1440px] mx-auto mt-20 px-6 py-12">
      <IdeaDetailsClient />
    </div>
  );
};

export default IdeaDetailsPage;
