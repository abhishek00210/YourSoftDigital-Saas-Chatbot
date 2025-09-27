import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            See Our Chatbot in Action
          </h1>
          <p className="text-gray-600 text-lg">
            Watch a quick demo to see how our AI-powered chatbot can transform your customer experience.
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle className="text-center">Chatbot Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <PlayCircle className="h-24 w-24 text-gray-400" />
              </div>
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
                <p className="text-gray-600 mb-6">
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
    </div>
  );
}