import { Input } from "@/components/ui/input";
import { LifeBuoy, Book, MessageSquare } from "lucide-react";

export default function HelpCenterPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help?
          </h1>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for articles..."
              className="w-full p-4 text-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <Book className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Documentation</h3>
            <p className="text-gray-600">
              Browse our detailed documentation for in-depth information.
            </p>
          </div>
          <div>
            <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Forums</h3>
            <p className="text-gray-600">
              Ask questions and share your knowledge with other users.
            </p>
          </div>
          <div>
            <LifeBuoy className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
            <p className="text-gray-600">
              Can't find what you're looking for? Our support team is here to help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}