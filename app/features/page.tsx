import { Bot, Zap, Shield, BarChart3, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features to Grow Your Business
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
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
            <div className="p-8 border rounded-lg">
              <Bot className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced AI Integration</h3>
              <p className="text-gray-600">
                Leverage the power of cutting-edge AI to understand and respond to your customers' needs with human-like conversation.
              </p>
            </div>
            <div className="p-8 border rounded-lg">
              <Zap className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-Time WooCommerce Sync</h3>
              <p className="text-gray-600">
                Keep your chatbot's product knowledge up-to-date with automatic, real-time synchronization of your WooCommerce inventory.
              </p>
            </div>
            <div className="p-8 border rounded-lg">
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Seamless Website Integration</h3>
              <p className="text-gray-600">
                Easily embed the chatbot on any website with a simple copy-paste script or our dedicated WordPress plugin.
              </p>
            </div>
            <div className="p-8 border rounded-lg">
              <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">In-Depth Analytics</h3>
              <p className="text-gray-600">
                Gain valuable insights into your customer interactions with a comprehensive analytics dashboard.
              </p>
            </div>
            <div className="p-8 border rounded-lg">
              <ChevronsRight className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customizable Branding</h3>
              <p className="text-gray-600">
                Match the chatbot's appearance to your brand's look and feel with customizable colors, logos, and more.
              </p>
            </div>
            <div className="p-8 border rounded-lg">
              <Bot className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Proactive Engagement</h3>
              <p className="text-gray-600">
                Engage your website visitors with proactive messages and personalized recommendations to drive sales.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}