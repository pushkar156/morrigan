import type { Metadata } from "next";
import { Inter, Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import Global3D from "@/components/Global3D";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import CustomCursor from "@/components/CustomCursor";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Morrigan | Perspectives on Modern Intelligence",
  description: "AI-powered editorial platform focused on finance, business strategy, and technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#f8f9fa]" suppressHydrationWarning>
      <body className={`${manrope.variable} ${playfair.variable} antialiased bg-transparent selection:bg-[#00d1ff] selection:text-black`} suppressHydrationWarning>
        <SmoothScrolling>
          <CustomCursor />
          <Global3D />
          <Navbar />
          <div className="relative z-10 min-h-screen">
            {children}
            <Footer />
          </div>
          <Chatbot />
        </SmoothScrolling>
      </body>
    </html>
  );
}
