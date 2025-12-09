import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SecurityProvider from "@/components/security-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyVault - Free MBBS Study Materials",
  description:
    "Access free MBBS study PDFs securely. Medicine, Pediatrics, Gynecology, Surgery, and more. View-only, watermarked documents for medical students.",
  keywords: [
    "MBBS",
    "medical education",
    "study materials",
    "PDFs",
    "medicine",
    "pediatrics",
    "surgery",
    "gynecology",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <SecurityProvider>{children}</SecurityProvider>
      </body>
    </html>
  );
}
