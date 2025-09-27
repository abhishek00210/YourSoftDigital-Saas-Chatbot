YourSoft Digital - SaaS AI Chatbot Platform
This is a multi-tenant SaaS platform that enables eCommerce businesses to create and manage AI-powered chatbots for their websites. The platform is built with Next.js, Supabase, and Stripe, and it integrates with WooCommerce for product syncing.

✨ Key Features
Multi-tenant Architecture: Supports multiple businesses with data isolation between tenants.

User Authentication: Secure user sign-up and login functionality.

Subscription Plans: Tiered subscription model (Free, Basic, Pro) with feature gating, managed through Stripe.

Business & Chatbot Management: A user-friendly dashboard to create and manage businesses and their associated chatbots.

WooCommerce Integration: Seamlessly connect to a WooCommerce store to sync products, allowing the chatbot to provide accurate, real-time product information.

Embeddable Chatbot Widget: A lightweight, customizable JavaScript widget that can be easily embedded on any website.

AI-Powered Chat Engine: Utilizes OpenAI's GPT models to understand user intent, generate human-like responses, and recommend relevant products.

Analytics: Provides insights into chatbot performance, including conversation and message counts.

🚀 Technology Stack
Framework: [Next.js 14 (App Router)]

Language: [TypeScript]

Styling: [Tailwind CSS]

UI Components: [shadcn/ui]

Database & Auth: [Supabase (PostgreSQL)]

Payments: [Stripe]

AI: [OpenAI (via @ai-sdk/openai)]

⚙️ Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Node.js (v18 or later)

npm or yarn

A Supabase account

A Stripe account

An OpenAI API key

Installation
Clone the repository:

Bash

git clone <your-repository-url>
cd yoursoftdigital-saas-chatbot
Install dependencies:

Bash

npm install
Set up environment variables:
Create a new file named .env.local in the root of your project and add the following environment variables. You can get these from your Supabase and Stripe dashboards.

Code snippet

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
Database Setup
Go to your Supabase project dashboard.

Navigate to the SQL Editor.

Copy the content from scripts/001_create_database_schema.sql and run it to create the necessary tables and policies.

Copy the content from scripts/002_create_user_profile_trigger.sql and run it to set up the trigger for new user profiles.

Run the SQL queries provided in the chat to populate the subscription_products and subscription_prices tables with your plans.

Running the Development Server
Once the installation and database setup are complete, you can start the development server.

Bash

npm run dev
Open http://localhost:3000 with your browser to see the result.

📁 Project Structure
The project uses the Next.js App Router for routing and file organization.

app/: Contains all the routes, pages, and layouts.

api/: All backend API endpoints are defined here.

dashboard/: Protected routes and pages for the user dashboard.

(pages)/: Public-facing pages like Features, Pricing, etc.

components/: Shared and reusable React components.

lib/: Utility functions, helpers, and client configurations (Supabase, Stripe, etc.).

scripts/: SQL scripts for database setup.

docs/: Project documentation.
