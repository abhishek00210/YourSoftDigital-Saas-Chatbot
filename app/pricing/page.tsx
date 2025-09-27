import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-600 text-lg">
            Get access to all of our premium features with one simple plan.
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-md border-2 border-blue-600 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pro Plan</CardTitle>
              <CardDescription>
                Everything you need to supercharge your customer support.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-5xl font-bold text-center">
                $49
                <span className="text-lg font-medium text-gray-500">
                  / month
                </span>
              </div>

              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>
                    <strong>Full Access</strong> to All Features
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>
                    <strong>Unlimited</strong> Chatbots
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>
                    <strong>10,000</strong> Messages per Month
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>
                    <strong>WooCommerce</strong> Integration & Product Sync
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>
                    Embed on <strong>Unlimited</strong> Websites
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <span>
                    Access to All <strong>Future Updates</strong>
                  </span>
                </li>
              </ul>

              <Button size="lg" className="w-full">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}