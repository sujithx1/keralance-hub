import type { Metadata } from "next";
// Keralance Hub MVP release v1.0.0 - Premium community dashboard
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Keralance Hub | Kerala's Elite Freelancing Community",
  description: "Connect, collaborate, and grow with the premier freelancer network in Kerala. Developers, designers, content writers, creators, and marketers working together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-bg-base text-text-main selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
