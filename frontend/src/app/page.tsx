"use client"
import Hero from "@/components/Hero";
import CategoryScroll from "@/components/CategoryScroll";
import { DEMO_BLOGS } from "@/lib/demo-data";
import { useRef } from "react";

export default function Home() {
  const categories = [
    { title: "Back to Basics", subtitle: "Essential groundwork for institutional knowledge", id: "back-to-basics", theme: "light" },
    { title: "Strategy Series", subtitle: "Analyzing corporate maneuvers and M&A trends", id: "case-studies", theme: "dark" },
    { title: "Market Insights", subtitle: "Data-driven stock analysis and market psychology", id: "stock-analysis", theme: "light" },
    { title: "Financial Literacy", subtitle: "Advanced concepts simplified for contemporary leaders", id: "100-days-challenge", theme: "dark" },
    { title: "Corporate Restructuring", subtitle: "The mechanics of mergers, acquisitions, and deals", id: "ma-diaries", theme: "light" }
  ];

  const spotlightRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!spotlightRef.current) return;
    const rect = spotlightRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Inject the raw mouse coordinates into CSS variables directly
    spotlightRef.current.style.setProperty("--x", `${x}px`);
    spotlightRef.current.style.setProperty("--y", `${y}px`);
  };

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

      {/* Decorative Interactive Spotlight Section */}
      <section
        ref={spotlightRef}
        onMouseMove={handleMouseMove}
        className="py-60 md:py-80 relative flex items-center justify-center bg-[#000309] overflow-hidden group cursor-default"
      >
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Base ultra-dark text */}
        <h2 className="text-6xl md:text-9xl lg:text-[180px] leading-[0.8] font-serif text-white/5 select-none tracking-tighter uppercase font-black text-center relative z-10 mx-[-20%]">
          RESTORING DEPTH <br /> TO DISCOURSE
        </h2>

        {/* Hover Spotlight Mask Reveal Layer */}
        <div
          className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            // A massive glowing radial mask acts like a flashlight exposing the cyan text underneath
            maskImage: `radial-gradient(circle 350px at var(--x, 50%) var(--y, 50%), black 20%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 350px at var(--x, 50%) var(--y, 50%), black 20%, transparent 100%)`
          }}
        >
          <h2 className="text-6xl md:text-9xl lg:text-[180px] leading-[0.8] font-serif text-[#00d1ff] select-none tracking-tighter uppercase font-black text-center drop-shadow-[0_0_20px_rgba(0,209,255,0.4)] mx-[-20%]">
            RESTORING DEPTH <br /> TO DISCOURSE
          </h2>
        </div>
      </section>
    </main>
  );
}
