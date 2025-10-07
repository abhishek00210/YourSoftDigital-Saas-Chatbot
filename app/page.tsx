import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Zap, Shield, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
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
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Everything You Need to Succeed</h2>
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
                <Zap className="h-12 w-12 text-[#07bc0c] mb-4" />
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
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Get Started in Minutes</h2>
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
    </>
  )
}