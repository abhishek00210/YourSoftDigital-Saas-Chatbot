# Project Structure

## Folder Organization

\`\`\`
saas-chatbot-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── businesses/
│   │   ├── chatbots/
│   │   └── analytics/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── businesses/
│   │   ├── chatbots/
│   │   ├── chat/
│   │   └── webhooks/
│   ├── widget/                   # Chatbot widget routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── auth/
│   ├── dashboard/
│   ├── chatbot/
│   └── widget/
├── lib/                          # Utility libraries
│   ├── auth.ts
│   ├── db.ts
│   ├── openai.ts
│   ├── woocommerce.ts
│   └── utils.ts
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts
│   ├── use-businesses.ts
│   └── use-chatbots.ts
├── types/                        # TypeScript type definitions
│   ├── auth.ts
│   ├── business.ts
│   ├── chatbot.ts
│   └── api.ts
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DESIGN.md
│   └── DEPLOYMENT.md
├── scripts/                      # Database scripts
│   ├── init-db.sql
│   └── seed-data.sql
├── public/                       # Static assets
│   ├── widget/                   # Widget assets
│   └── images/
└── prisma/                       # Database schema
    ├── schema.prisma
    └── migrations/
\`\`\`

## Key Directories Explained

### `/app` - Next.js App Router
- **Route groups**: `(auth)` for authentication pages
- **Protected routes**: `dashboard/` requires authentication
- **API routes**: RESTful API endpoints
- **Widget routes**: Public chatbot widget endpoints

### `/components` - React Components
- **ui/**: shadcn/ui component library
- **auth/**: Authentication forms and components
- **dashboard/**: Business management interfaces
- **chatbot/**: Chatbot configuration components
- **widget/**: Embeddable chatbot widget

### `/lib` - Core Libraries
- **auth.ts**: JWT authentication utilities
- **db.ts**: Database connection and queries
- **openai.ts**: OpenAI API integration
- **woocommerce.ts**: WooCommerce API client

### `/hooks` - Custom Hooks
- **use-auth.ts**: Authentication state management
- **use-businesses.ts**: Business data fetching
- **use-chatbots.ts**: Chatbot management

### `/types` - TypeScript Definitions
- Shared type definitions for API responses
- Database model types
- Component prop types

## Development Workflow

1. **Database Setup**: Run Prisma migrations
2. **Environment Variables**: Configure API keys
3. **Development Server**: `npm run dev`
4. **Testing**: Component and API testing
5. **Deployment**: Vercel deployment pipeline

## Next Steps

1. Set up database schema with Prisma
2. Implement authentication system
3. Build business management dashboard
4. Create chatbot configuration interface
5. Develop AI chatbot engine
6. Build embeddable widget
7. Add analytics and monitoring
