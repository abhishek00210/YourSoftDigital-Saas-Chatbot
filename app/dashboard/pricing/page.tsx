import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/utils/database"
import { getUserSubscription } from "@/lib/utils/subscriptions"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"

export default async function PricingPage() {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const user = await getCurrentUser()
  const { data: subscription } = user ? await getUserSubscription(user.id) : { data: null }
  const currentPlanName = subscription?.prices?.products?.name || "Free Plan"

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
      cta: "Get Started",
      href: "/dashboard",
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
      cta: "Upgrade to Basic",
      href: "/subscribe?plan=price_basic_29",
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
      cta: "Upgrade to Pro",
      href: "/subscribe?plan=pro_plan_49",
    },
  ]

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose the Right Plan for Your Business
        </h1>
        <p className="text-gray-600 text-lg">
          Start for free and scale up as you grow. All plans include our core features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.name === currentPlanName ? "border-blue-600" : ""}`}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="text-4xl font-bold">
                {plan.price}
                {plan.price !== "$0" && (
                  <span className="text-lg font-medium text-gray-500">
                    / month
                  </span>
                )}
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.negative ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.name === currentPlanName ? (
                <Button size="lg" className="w-full" disabled>
                  You are using {plan.name}
                </Button>
              ) : (
                <Button asChild size="lg" className="w-full">
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}