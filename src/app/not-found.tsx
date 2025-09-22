import { urbanist } from "@/components/ui/fonts";
import NotFoundClient from "@/components/not-found/NotFoundClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found 404",
  description: "Page Not Found 404",
};

export default function NotFound() {
  return (
    <section
      className={`${urbanist.className} antialiased bg-gradient-to-br from-slate-100 to-sky-100 max-w-[1440px] mx-auto px-6 py-12`}
    >
      <NotFoundClient />
    </section>
  );
}
