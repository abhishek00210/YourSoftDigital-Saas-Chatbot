graph TD
    subgraph A [User Onboarding & Setup]
        U(Business Owner) -- Signs Up --> A1(Frontend: /auth/sign-up)
        A1 -- Submits Form --> A2(Backend: Supabase Auth)
        A2 -- Creates User --> DB1[(Database: users)]
        U -- Creates Business --> A3(Frontend: /dashboard/businesses/new)
        A3 -- API Call --> A4(Backend API)
        A4 -- Inserts Data --> DB2[(Database: businesses)]
        U -- Creates Chatbot --> A5(Frontend: /dashboard/.../chatbots/new)
        A5 -- API Call --> A6(Backend API)
        A6 -- Inserts Data --> DB3[(Database: chatbots)]
    end

    subgraph B [Live Chat Interaction]
        C(Website Visitor) -- Sends Message --> B1(Chat Widget)
        B1 -- POST Request --> B2(API: /api/chat/[chatbotId])
        B2 -- Fetches Context --> DB3
        B2 -- Fetches Products --> DB4[(Database: products)]
        B2 -- Gets History --> DB5[(Database: messages)]
        B2 -- Generates Response --> B3(AI Engine: ai-engine.ts)
        B3 -- Sends Response --> B2
        B2 -- Saves Messages --> DB5
        B2 -- Sends Response --> B1
        B1 -- Displays to --> C
    end

    subgraph C [Data Synchronization]
        U -- Clicks 'Sync' --> C1(Frontend: ProductSyncButton)
        C1 -- POST Request --> C2(API: /api/.../sync-products)
        C2 -- Fetches Credentials --> DB2
        C2 -- Makes API Call --> C3(WooCommerce API)
        C3 -- Returns Products --> C2
        C2 -- Transforms & Upserts Data --> DB4
    end

    style A fill:#f0f9ff,stroke:#3b82f6
    style B fill:#f0fdf4,stroke:#16a34a
    style C fill:#fefce8,stroke:#f59e0b