import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Check your email</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Thank you for signing up!</CardTitle>
            <CardDescription className="text-center">We&apos;ve sent you a confirmation email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                You&apos;ve successfully signed up for our AI chatbot platform. Please check your email and click the
                confirmation link to activate your account.
              </p>
              <p className="text-xs text-gray-500">
                Once confirmed, you&apos;ll be able to access your dashboard and start creating chatbots.
              </p>
              <div className="mt-4 text-center text-xs text-gray-500">
                <a
                  href="https://yoursoftdigital.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 underline"
                >
                  Powered by YourSoftDigital
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
