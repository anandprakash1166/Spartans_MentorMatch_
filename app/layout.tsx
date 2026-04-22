import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MentorSpace | Find Your Guide",
  description: "Discover mentors, book sessions, and capture AI insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <SessionProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
