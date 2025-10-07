"use client"; // Keep this as it's a client component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X, Bot } from "lucide-react"; // Added Bot for header/footer
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [selectedPlanId, setSelectedPlanId] = useState("pro_plan_49"); // Default to Pro plan

  const plans = [
    {
      id: "price_free",
      name: "Free Plan",
      price: "$0",
      description: "Get a feel for our platform",
      features: [
        { text: "1 Chatbot" },
        { text: "100 messages/month" },
        { text: "10 products sync" },
        { text: "Basic Analytics" },
        { text: "'Powered by' branding", negative: true },
      ],
      isFeatured: false,
    },
    {
      id: "price_basic_29",
      name: "Basic Plan",
      price: "$29",
      description: "For small to medium businesses",
      features: [
        { text: "3 Chatbots" },
        { text: "1,000 messages/month" },
        { text: "Unlimited product sync" },
        { text: "Customizable Widget" },
        { text: "Standard Analytics" },
        { text: "Email Support" },
      ],
      isFeatured: false,
    },
    {
      id: "pro_plan_49",
      name: "Pro Plan",
      price: "$49",
      description: "For businesses at scale",
      features: [
        { text: "Unlimited Chatbots" },
        { text: "10,000 messages/month" },
        { text: "Remove 'Powered by' branding" },
        { text: "Advanced Analytics" },
        { text: "Priority Support" },
        { text: "API Access (soon)" },
      ],
      isFeatured: true,
    },
  ];

  const getStartedLink = `/auth/sign-up?plan=${selectedPlanId}`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* === PUBLIC HEADER === */}
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

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose the plan that's right for you.
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "flex flex-col cursor-pointer transition-all",
                  plan.isFeatured && "border-primary/50",
                  selectedPlanId === plan.id
                    ? "border-primary border-2 shadow-lg scale-105"
                    : "hover:shadow-md"
                )}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                  <div className="text-4xl font-bold">
                    {plan.price}
                    {plan.price !== "$0" && (
                      <span className="text-lg font-medium text-muted-foreground">
                        / month
                      </span>
                    )}
                  </div>
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        {feature.negative ? (
                          <X className="h-5 w-5 text-destructive" />
                        ) : (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <div className="w-full text-center text-sm font-medium text-primary">
                      {selectedPlanId === plan.id ? "Selected" : "Select Plan"}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center">
              <Button asChild size="lg" className="px-12 py-6 text-lg">
                  <Link href={getStartedLink}>Get Started with the {plans.find(p => p.id === selectedPlanId)?.name}</Link>
              </Button>
          </div>
        </div>
      </main>

      {/* === PUBLIC FOOTER === */}
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
    </div>
  );
}