import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PlayCircle, Bot } from "lucide-react"; // Added Bot for header/footer

export default function DemoPage() {
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
              See Our Chatbot in Action
            </h1>
            <p className="text-muted-foreground text-lg">
              Watch a quick demo to see how our AI-powered chatbot can transform your customer experience.
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="text-center">Chatbot Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-24 w-24 text-muted-foreground" />
                </div>
                <div className="mt-8 text-center">
                  <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
                  <p className="text-muted-foreground mb-6">
                    Sign up today and start building your own AI chatbot in minutes.
                  </p>
                  <Link href="/auth/sign-up">
                    <Button size="lg">
                      Sign Up Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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