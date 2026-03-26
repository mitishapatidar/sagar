"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatBot from "../components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>KhetMitra – Smart Farming Assistant</title>
        <meta name="description" content="KhetMitra - AI-powered smart farming assistant with real-time sensor monitoring, crop recommendations, and irrigation alerts." />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
