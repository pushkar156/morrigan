"use client"
import Hero from "@/components/Hero";
import CategoryScroll from "@/components/CategoryScroll";
import { DEMO_BLOGS } from "@/lib/demo-data";
import { motion } from "framer-motion";

export default function Home() {
  const categories = [
    { title: "Back to Basics", subtitle: "Essential groundwork for institutional knowledge", id: "back-to-basics" },
    { title: "Strategy Series", subtitle: "Analyzing corporate maneuvers and M&A trends", id: "case-studies" },
    { title: "Market Insights", subtitle: "Data-driven stock analysis and market psychology", id: "stock-analysis" },
    { title: "Financial Literacy", subtitle: "Advanced concepts simplified for contemporary leaders", id: "100-days-challenge" },
    { title: "Corporate restructuring", subtitle: "The mechanics of mergers, acquisitions, and deals", id: "ma-diaries" }
  ];

  return (
    <main className="bg-transparent relative">
      <Hero />

      {/* Main Content Area */}
      <div className="relative z-10 -mt-10 md:-mt-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="flex flex-col gap-12 md:gap-24"
          >
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-10% 0px" }}
              >
                <CategoryScroll
                  title={cat.title}
                  subtitle={cat.subtitle}
                  category={cat.id}
                  blogs={DEMO_BLOGS}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative mid-page break Section */}
      <section className="py-40 md:py-60 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00d1ff08] to-transparent pointer-events-none" />
        <div className="container-custom text-center relative z-20">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-serif text-white/10 select-none tracking-tighter uppercase font-black"
          >
            RESTORING DEPTH TO <br /> DISCOURSE
          </motion.h2>
          <div className="mt-12 h-[1px] w-40 bg-white/5 mx-auto" />
        </div>
      </section>
    </main>
  );
}
