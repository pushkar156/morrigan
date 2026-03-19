"use client"
import Hero from "@/components/Hero";
import CategoryScroll from "@/components/CategoryScroll";
import { DEMO_BLOGS } from "@/lib/demo-data";
import { useRef } from "react";

export default function Home() {
  const categories = [
    { title: "Back to Basics", subtitle: "Essential groundwork for institutional knowledge", id: "back-to-basics", theme: "light" },
    { title: "Strategy Series", subtitle: "Analyzing corporate maneuvers and M&A trends", id: "case-studies", theme: "light" },
    { title: "Market Insights", subtitle: "Data-driven stock analysis and market psychology", id: "stock-analysis", theme: "light" },
    { title: "Financial Literacy", subtitle: "Advanced concepts simplified for contemporary leaders", id: "100-days-challenge", theme: "light" },
    { title: "Corporate Restructuring", subtitle: "The mechanics of mergers, acquisitions, and deals", id: "ma-diaries", theme: "light" }
  ];



  return (
    <main className="bg-[#f8f9fa] relative overflow-x-hidden">
      <Hero />

      {/* Main Content Area - Alternating Category Scrollers */}
      <div className="relative z-10 w-[100vw]">
        <div className="flex flex-col w-full m-0 p-0">
          {categories.map((cat, index) => (
            <CategoryScroll
              key={cat.id}
              title={cat.title}
              subtitle={cat.subtitle}
              category={cat.id}
              blogs={DEMO_BLOGS}
              theme={cat.theme as "light" | "dark"}
              index={index}
            />
          ))}
        </div>
      </div>


    </main>
  );
}
