import type { Metadata } from "next";
import PostDetailsClient from "@/components/post-details/PostDetailsClient";

export const metadata: Metadata = {
  title: "Post Details",
  description: "View LinkedIn post details",
};

const PostDetailsPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen max-w-[1440px] mx-auto mt-20 px-6 py-12">
      <PostDetailsClient />
    </div>
  );
};

export default PostDetailsPage;
