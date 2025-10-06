import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Zap, Shield, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">YourSoftDigital</span>
          </div>
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-balance">
            AI-Powered Chatbots for Your eCommerce Store
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Create intelligent chatbots that understand your products, answer customer questions, and boost sales - all
            without writing a single line of code.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Bot className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart AI Integration</CardTitle>
                <CardDescription>Powered by advanced AI that understands your products and customers</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>WooCommerce Sync</CardTitle>
                <CardDescription>Automatically sync your product catalog and inventory in real-time</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Easy Integration</CardTitle>
                <CardDescription>Add to any website with a simple embed code or WordPress plugin</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-destructive mb-4" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Track conversations, popular queries, and customer satisfaction</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get Started in Minutes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Store</h3>
              <p className="text-muted-foreground">Link your WooCommerce store and sync your product catalog automatically</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Configure Your Bot</h3>
              <p className="text-muted-foreground">Customize your chatbot's personality, branding, and responses</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Deploy & Monitor</h3>
              <p className="text-muted-foreground">Add the widget to your site and track performance with detailed analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Customer Support?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using AI chatbots to increase sales and customer satisfaction
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary" className="px-8">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
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
                <li>
                  <Link href="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
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
  )
}