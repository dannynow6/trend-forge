import type { Metadata } from "next";
import MyIdeasMain from "@/components/my-ideas/MyIdeasMain";

export const metadata: Metadata = {
  title: "My Ideas",
  description: "My saved LinkedIn post ideas",
};

const MyIdeasPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen max-w-[1440px] mx-auto mt-20 px-6 py-12">
      <MyIdeasMain />
    </div>
  );
};

export default MyIdeasPage;
