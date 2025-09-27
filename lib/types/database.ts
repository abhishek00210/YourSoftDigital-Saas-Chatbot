export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  user_id: string
  name: string
  description?: string
  website_url?: string
  woocommerce_url?: string
  woocommerce_consumer_key?: string
  woocommerce_consumer_secret?: string
  created_at: string
  updated_at: string
}

export interface Chatbot {
  id: string
  business_id: string
  name: string
  description?: string
  welcome_message: string
  fallback_message: string
  is_active: boolean
  widget_color: string
  widget_position: "bottom-right" | "bottom-left"
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  business_id: string
  woocommerce_id: number
  name: string
  description?: string
  short_description?: string
  price?: number
  regular_price?: number
  sale_price?: number
  sku?: string
  stock_quantity?: number
  in_stock: boolean
  categories: string[]
  tags: string[]
  images: string[]
  permalink?: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  chatbot_id: string
  visitor_id: string
  visitor_email?: string
  visitor_name?: string
  status: "active" | "closed" | "archived"
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  content: string
  sender_type: "user" | "bot"
  metadata: Record<string, any>
  created_at: string
}

export interface Analytics {
  id: string
  chatbot_id: string
  event_type:
    | "conversation_started"
    | "message_sent"
    | "product_viewed"
    | "product_recommended"
  event_data: Record<string, any>
  visitor_id?: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      // Your existing tables for WooCommerce, users, etc. are implicitly here.
      // This section defines the subscription-related tables with the corrected names.

      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id: string | null
        }
        Update: {
          id: string
          stripe_customer_id: string | null
        }
      }
      subscription_products: { // Renamed from 'products'
        Row: {
          id: string
          active: boolean | null
          name: string | null
          description: string | null
          image: string | null
          metadata: Json | null
        }
        Insert: {
          id: string
          active: boolean | null
          name: string | null
          description: string | null
          image: string | null
          metadata: Json | null
        }
        Update: {
          id: string
          active: boolean | null
          name: string | null
          description: string | null
          image: string | null
          metadata: Json | null
        }
      }
      subscription_prices: { // Renamed from 'prices'
        Row: {
          id: string
          product_id: string
          active: boolean | null
          description: string | null
          unit_amount: number | null
          currency: string | null
          type: "one_time" | "recurring" | null
          interval: "day" | "week" | "month" | "year" | null
          interval_count: number | null
          trial_period_days: number | null
          metadata: Json | null
        }
        Insert: {
          id: string
          product_id: string
          active: boolean | null
          description: string | null
          unit_amount: number | null
          currency: string | null
          type: "one_time" | "recurring" | null
          interval: "day" | "week" | "month" | "year" | null
          interval_count: number | null
          trial_period_days: number | null
          metadata: Json | null
        }
        Update: {
          id: string
          product_id: string
          active: boolean | null
          description: string | null
          unit_amount: number | null
          currency: string | null
          type: "one_time" | "recurring" | null
          interval: "day" | "week" | "month" | "year" | null
          interval_count: number | null
          trial_period_days: number | null
          metadata: Json | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status:
            | "trialing"
            | "active"
            | "canceled"
            | "incomplete"
            | "incomplete_expired"
            | "past_due"
            | "unpaid"
            | null
          price_id: string // This will reference subscription_prices.id
          quantity: number | null
          cancel_at_period_end: boolean | null
          created: string
          current_period_start: string
          current_period_end: string
          ended_at: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
          metadata: Json | null
        }
        Insert: {
          id: string
          user_id: string
          status:
            | "trialing"
            | "active"
            | "canceled"
            | "incomplete"
            | "incomplete_expired"
            | "past_due"
            | "unpaid"
            | null
          price_id: string
          quantity: number | null
          cancel_at_period_end: boolean | null
          created: string
          current_period_start: string
          current_period_end: string
          ended_at: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
          metadata: Json | null
        }
        Update: {
          id: string
          user_id: string
          status:
            | "trialing"
            | "active"
            | "canceled"
            | "incomplete"
            | "incomplete_expired"
            | "past_due"
            | "unpaid"
            | null
          price_id: string
          quantity: number | null
          cancel_at_period_end: boolean | null
          created: string
          current_period_start: string
          current_period_end: string
          ended_at: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
          metadata: Json | null
        }
      }
    }
  }
}