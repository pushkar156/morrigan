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
  openGraph: {
    title: "Morrigan | Perspectives on Modern Intelligence",
    description: "AI-powered editorial platform focused on finance, business strategy, and technology.",
    url: 'https://themorrigan.com', // Replace with your actual domain
    siteName: 'The Morrigan',
    images: [
      {
        url: '/logo.png', // Replace with a custom OG banner image URL ideally
        width: 1200,
        height: 630,
        alt: 'Morrigan Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Morrigan | Perspectives on Modern Intelligence",
    description: "AI-powered editorial platform focused on finance, business strategy, and technology.",
    images: ['/logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
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
