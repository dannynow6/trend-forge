import type { Metadata } from "next";
import MyPostsMain from "@/components/my-posts/MyPostsMain";

export const metadata: Metadata = {
  title: "My Posts",
  description: "My saved LinkedIn posts",
};

const MyPostsPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen max-w-[1440px] mx-auto mt-20 px-6 py-12">
      <MyPostsMain />
    </div>
  );
};

export default MyPostsPage;
