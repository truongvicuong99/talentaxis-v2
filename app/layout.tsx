
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "TalentAxis",

  title: {
    default: "TalentAxis | Global Remote & AI Jobs",
    template: "%s | TalentAxis",
  },

  description:
    "Discover global remote jobs, AI training, data annotation, and freelance career opportunities. TalentAxis connects talent with opportunities worldwide.",

  keywords: [
    "TalentAxis",
    "Remote Jobs",
    "AI Jobs",
    "AI Training Jobs",
    "Data Annotation Jobs",
    "Freelance Jobs",
    "Work From Home",
    "Global Careers",
  ],

  authors: [{ name: "TalentAxis" }],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: "website",
    siteName: "TalentAxis",
    title: "TalentAxis | Global Remote & AI Jobs",
    description:
      "Connecting talent to global remote and AI career opportunities.",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "TalentAxis | Global Remote & AI Jobs",
    description:
      "Discover remote AI training, data annotation, and freelance opportunities worldwide.",
  },

  category: "jobs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
