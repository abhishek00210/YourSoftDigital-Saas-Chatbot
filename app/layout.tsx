import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export const metadata: Metadata = {
  title: "YourSoftDigital - AI Chatbot SaaS Platform",
  description: "AI-powered chatbots for eCommerce businesses - Powered by YourSoftDigital",
  generator: "YourSoftDigital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} flex flex-col min-h-screen`}>
        {/* === GLOBAL HEADER === */}
        <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">YourSoftDigital</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* === PAGE CONTENT WILL BE RENDERED HERE === */}
        <main className="flex-grow">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        
        <Analytics />

        {/* === GLOBAL FOOTER === */}
        <footer className="bg-[#1E1E2D] text-white py-12 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-6 w-6" />
                  <span className="text-lg font-bold">YourSoftDigital</span>
                </div>
                <p className="text-gray-400">AI-powered chatbots for eCommerce businesses</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/features" className="hover:text-white">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                  <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                  <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 YourSoftDigital. All rights reserved.</p>
              <p className="mt-2">
                <a
                  href="https://yoursoftdigital.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline"
                >
                  Powered by YourSoftDigital
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}