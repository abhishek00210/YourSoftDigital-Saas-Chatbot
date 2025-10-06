# YourSoft Digital - SaaS AI Chatbot Platform

![Project Banner](https://via.placeholder.com/1200x300.png?text=YourSoft+Digital+AI+Chatbot)

A multi-tenant SaaS platform that enables eCommerce businesses to create and manage AI-powered chatbots for their websites. Built with a modern, full-stack TypeScript architecture.

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🚀 Technology Stack](#-technology-stack)
- [⚙️ Getting Started](#️-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Development Server](#running-the-development-server)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

- **Multi-tenant Architecture:** Supports multiple businesses with data isolation.
- **User Authentication:** Secure sign-up and login functionality.
- **Subscription Plans:** Tiered subscription model (Free, Basic, Pro) with feature gating, managed through Stripe.
- **Business & Chatbot Management:** A user-friendly dashboard to create and manage businesses and their associated chatbots.
- **WooCommerce Integration:** Seamlessly connect to a WooCommerce store to sync products for the chatbot to use.
- **Embeddable Chatbot Widget:** A lightweight, customizable JavaScript widget that can be easily embedded on any website.
- **AI-Powered Chat Engine:** Utilizes OpenAI's GPT models to understand user intent and generate human-like responses.
- **Analytics:** Provides insights into chatbot performance.

---

## 🚀 Technology Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

---

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A [Supabase](https://supabase.com/) account
- A [Stripe](https://stripe.com/) account
- An [OpenAI](https://openai.com/) API key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd yoursoftdigital-saas-chatbot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env.local` in the root of your project and add the following environment variables.

    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

    # Stripe
    STRIPE_SECRET_KEY=your-stripe-secret-key

    # OpenAI
    OPENAI_API_KEY=your-openai-api-key

    # App URL
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

### Database Setup

1.  **Go to your Supabase project dashboard.**
2.  Navigate to the **SQL Editor**.
3.  Copy the content from `scripts/001_create_database_schema.sql` and run it to create the necessary tables and policies.
4.  Copy the content from `scripts/002_create_user_profile_trigger.sql` and run it to set up the trigger for new user profiles.
5.  Run the SQL queries to populate the `subscription_products` and `subscription_prices` tables with your plans.

### Running the Development Server

Once the installation and database setup are complete, you can start the development server.

```bash
npm run dev
# chatbot
