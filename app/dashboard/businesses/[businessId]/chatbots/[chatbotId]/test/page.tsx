"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Bot, Send, User } from "lucide-react"
import Link from "next/link"

interface TestChatPageProps {
  params: Promise<{ businessId: string; chatbotId: string }>
}

interface Message {
  id: string
  content: string
  sender_type: "user" | "bot"
  timestamp: Date
  metadata?: any
}

interface RelevantProduct {
  id: string
  name: string
  price: number | null
  image?: string
  permalink?: string
}

export default function TestChatPage({ params }: TestChatPageProps) {
  const [businessId, setBusinessId] = useState<string>("")
  const [chatbotId, setChatbotId] = useState<string>("")
  const [chatbot, setChatbot] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [visitorId] = useState(() => `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadChatbot = async () => {
      const resolvedParams = await params
      setBusinessId(resolvedParams.businessId)
      setChatbotId(resolvedParams.chatbotId)

      const supabase = createClient()
      const { data: chatbotData, error } = await supabase
        .from("chatbots")
        .select(`
          *,
          businesses!inner(
            name,
            user_id
          )
        `)
        .eq("id", resolvedParams.chatbotId)
        .eq("business_id", resolvedParams.businessId)
        .single()

      if (error || !chatbotData) {
        console.error("Failed to load chatbot:", error)
        return
      }

      setChatbot(chatbotData)

      // Add welcome message
      setMessages([
        {
          id: "welcome",
          content: chatbotData.welcome_message,
          sender_type: "bot",
          timestamp: new Date(),
        },
      ])
    }

    loadChatbot()
  }, [params])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !chatbotId) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: inputMessage,
      sender_type: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/chat/${chatbotId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationId,
          visitorId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const botMessage: Message = {
          id: `bot_${Date.now()}`,
          content: data.response,
          sender_type: "bot",
          timestamp: new Date(),
          metadata: {
            intent: data.intent,
            relevantProducts: data.relevantProducts,
          },
        }

        setMessages((prev) => [...prev, botMessage])
        setConversationId(data.conversationId)
      } else {
        const errorMessage: Message = {
          id: `error_${Date.now()}`,
          content: data.error || "Sorry, something went wrong. Please try again.",
          sender_type: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: "Sorry, I'm having trouble connecting. Please try again.",
        sender_type: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  if (!chatbot) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chatbot
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: chatbot.widget_color }}
              >
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Test Chat - {chatbot.name}</h1>
                <p className="text-sm text-gray-600">Try out your chatbot before deploying</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-4" style={{ backgroundColor: chatbot.widget_color }}>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {chatbot.name}
                <span className="ml-auto text-sm opacity-90">Test Mode</span>
              </CardTitle>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.sender_type === "user" ? "justify-end" : ""}`}>
                  {message.sender_type === "bot" && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: chatbot.widget_color }}
                    >
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className="flex flex-col max-w-xs lg:max-w-md">
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender_type === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* Show relevant products if available */}
                    {message.metadata?.relevantProducts && message.metadata.relevantProducts.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs text-gray-500">Recommended products:</p>
                        {message.metadata.relevantProducts.map((product: RelevantProduct) => (
                          <div key={product.id} className="bg-white border rounded-lg p-2 text-sm">
                            <div className="flex items-center gap-2">
                              {product.image && (
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-8 h-8 rounded object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-gray-600">{formatPrice(product.price)}</p>
                              </div>
                              {product.permalink && (
                                <a
                                  href={product.permalink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-500 text-xs"
                                >
                                  View
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                      {message.metadata?.intent && (
                        <span className="ml-2 text-blue-600">({message.metadata.intent})</span>
                      )}
                    </span>
                  </div>

                  {message.sender_type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: chatbot.widget_color }}
                  >
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  style={{ backgroundColor: chatbot.widget_color }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Test Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Test Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Try asking about products, pricing, or general questions</p>
                <p>• Test different types of inquiries to see how the AI responds</p>
                <p>• Product recommendations will appear when relevant</p>
                <p>• Intent analysis is shown next to timestamps for debugging</p>
                <p>• This is a test environment - real conversations will be tracked separately</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
