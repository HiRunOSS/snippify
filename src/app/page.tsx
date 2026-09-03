"use client";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import LandingFooter from "@/components/landing/Footer";

import Feedback from "@/components/landing/Feedback";
import LiveExamples from "@/components/landing/LiveExamples";
// import SupportDialog from "@/components/landing/SupportDialog";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50 dark:from-[#111010] dark:via-[#111010] dark:to-[#111010]">
      <Navbar />
      <main className="flex min-h-screen flex-col justify-between pb-0">
        <Hero />
        <LiveExamples />
        <Feedback />
        <LandingFooter />
      </main>
      {/* <SupportDialog /> */}
    </div>
  );
}
