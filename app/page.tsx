import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-10 py-12 sm:py-24">
      <p>zach marino is a multi-hyphenate experience designer and web developer focused on the media and entertainment space. his work refines the experiences creatives and consumers have with the media they love. <Link href={"/about"} className="underline">read more</Link></p>
    </main>
  );
}
