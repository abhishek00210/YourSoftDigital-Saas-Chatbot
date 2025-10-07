import { Bot, Zap, Shield, BarChart3, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturesPage() {
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
        {/* Hero Section */}
        <section className="py-20 px-4 bg-muted/50"> {/* Adjusted background color to fit theme */}
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Powerful Features to Grow Your Business
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our AI-powered chatbot is packed with features designed to enhance customer engagement and boost your sales.
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="px-8">
                Get Started for Free
                <ChevronsRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 border rounded-lg bg-card">
                <Bot className="h-12 w-12 text-primary mb-4" /> {/* Adjusted color to primary */}
                <h3 className="text-xl font-semibold mb-2">Advanced AI Integration</h3>
                <p className="text-muted-foreground">
                  Leverage the power of cutting-edge AI to understand and respond to your customers' needs with human-like conversation.
                </p>
              </div>
              <div className="p-8 border rounded-lg bg-card">
                <Zap className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-Time WooCommerce Sync</h3>
                <p className="text-muted-foreground">
                  Keep your chatbot's product knowledge up-to-date with automatic, real-time synchronization of your WooCommerce inventory.
                </p>
              </div>
              <div className="p-8 border rounded-lg bg-card">
                <Shield className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Seamless Website Integration</h3>
                <p className="text-muted-foreground">
                  Easily embed the chatbot on any website with a simple copy-paste script or our dedicated WordPress plugin.
                </p>
              </div>
              <div className="p-8 border rounded-lg bg-card">
                <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">In-Depth Analytics</h3>
                <p className="text-muted-foreground">
                  Gain valuable insights into your customer interactions with a comprehensive analytics dashboard.
                </p>
              </div>
              <div className="p-8 border rounded-lg bg-card">
                <ChevronsRight className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Customizable Branding</h3>
                <p className="text-muted-foreground">
                  Match the chatbot's appearance to your brand's look and feel with customizable colors, logos, and more.
                </p>
              </div>
              <div className="p-8 border rounded-lg bg-card">
                <Bot className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Proactive Engagement</h3>
                <p className="text-muted-foreground">
                  Engage your website visitors with proactive messages and personalized recommendations to drive sales.
                </p>
              </div>
            </div>
          </div>
        </section>
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