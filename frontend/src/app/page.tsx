"use client"
import Hero from "@/components/Hero";
import CategoryScroll from "@/components/CategoryScroll";
import { DEMO_BLOGS } from "@/lib/demo-data";
import { motion } from "framer-motion";

export default function Home() {
  const categories = [
    { title: "Back to Basics", subtitle: "Foundational concepts every investor should know", id: "back-to-basics" },
    { title: "Case Studies", subtitle: "Deep dives into corporate strategies", id: "case-studies" },
    { title: "Stock Analysis", subtitle: "In-depth company and market analysis", id: "stock-analysis" },
    { title: "100 Days Challenge", subtitle: "Your journey to financial literacy", id: "100-days-challenge" },
    { title: "M&A Diaries", subtitle: "Mergers, acquisitions, and corporate restructuring", id: "ma-diaries" }
  ];

  return (
    <main className="bg-transparent">
      <Hero />

      <div className="main-content">
        <div className="content-container max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
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

      {/* Decorative mid-page break */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1152d410] to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white/20 select-none">
            RESTORING DEPTH TO FINANCIAL DISCOURSE
          </h2>
        </div>
      </section>
    </main>
  );
}
