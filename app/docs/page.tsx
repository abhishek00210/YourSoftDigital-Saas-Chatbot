import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LifeBuoy, Rocket } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-gray-600 text-lg">
            Everything you need to get started and make the most of our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-blue-600" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                A step-by-step guide to setting up your first business, creating a chatbot, and syncing your products.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-green-600" />
                API Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Detailed information about our API endpoints for advanced integrations and custom solutions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="h-6 w-6 text-orange-600" />
                Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Find solutions to common issues, including product syncing errors and widget installation problems.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}