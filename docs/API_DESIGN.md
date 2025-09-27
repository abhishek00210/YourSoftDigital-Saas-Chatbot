# API Design Specification

## Base URL
\`\`\`
Production: https://your-domain.com/api
Development: http://localhost:3000/api
\`\`\`

## Authentication
All API endpoints (except public ones) require JWT authentication via `Authorization: Bearer <token>` header.

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
\`\`\`

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

#### POST /api/auth/logout
Invalidate current JWT token.

### Business Management Endpoints

#### GET /api/businesses
Get all businesses for authenticated user.

#### POST /api/businesses
Create a new business profile.

**Request Body:**
\`\`\`json
{
  "name": "My Store",
  "category": "electronics",
  "description": "Electronics store",
  "contactEmail": "contact@mystore.com",
  "workingHours": {
    "monday": "9:00-17:00",
    "tuesday": "9:00-17:00"
  },
  "websiteUrl": "https://mystore.com"
}
\`\`\`

#### PUT /api/businesses/[businessId]
Update business profile.

#### DELETE /api/businesses/[businessId]
Delete business profile.

### WooCommerce Integration Endpoints

#### POST /api/businesses/[businessId]/woocommerce
Connect WooCommerce store.

**Request Body:**
\`\`\`json
{
  "apiUrl": "https://mystore.com/wp-json/wc/v3",
  "apiKey": "ck_xxxxx",
  "apiSecret": "cs_xxxxx"
}
\`\`\`

#### POST /api/businesses/[businessId]/sync-products
Sync products from WooCommerce.

#### GET /api/businesses/[businessId]/products
Get synced products for business.

### Chatbot Management Endpoints

#### GET /api/businesses/[businessId]/chatbots
Get all chatbots for a business.

#### POST /api/businesses/[businessId]/chatbots
Create a new chatbot.

**Request Body:**
\`\`\`json
{
  "name": "Customer Support Bot",
  "description": "Helps customers with product inquiries",
  "tone": "friendly",
  "config": {
    "maxTokens": 150,
    "temperature": 0.7,
    "enableProductSearch": true,
    "enableOrderTracking": false
  }
}
\`\`\`

#### PUT /api/chatbots/[chatbotId]
Update chatbot configuration.

#### DELETE /api/chatbots/[chatbotId]
Delete chatbot.

#### GET /api/chatbots/[chatbotId]/widget-code
Get embed code for chatbot widget.

### Chat Endpoints (Public)

#### POST /api/chat/[widgetKey]
Send message to chatbot (public endpoint).

**Request Body:**
\`\`\`json
{
  "message": "What products do you have?",
  "sessionId": "session_uuid",
  "context": {
    "page": "/products",
    "userAgent": "Mozilla/5.0..."
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "response": "We have a wide range of electronics including...",
    "conversationId": "uuid",
    "suggestions": ["Show me laptops", "What's on sale?"]
  }
}
\`\`\`

### Analytics Endpoints

#### GET /api/chatbots/[chatbotId]/analytics
Get analytics data for chatbot.

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string
- `granularity`: 'day' | 'week' | 'month'

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "totalConversations": 1250,
    "totalMessages": 4800,
    "avgConversationLength": 3.8,
    "topQueries": [
      {"query": "product availability", "count": 45},
      {"query": "shipping info", "count": 32}
    ],
    "dailyStats": [
      {
        "date": "2024-01-01",
        "conversations": 25,
        "messages": 95,
        "avgResponseTime": 1.2
      }
    ]
  }
}
\`\`\`

## Error Handling

All API responses follow this structure:

**Success Response:**
\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
\`\`\`

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **Chat endpoints**: 60 requests per minute per widget
- **API endpoints**: 100 requests per minute per user
- **Sync endpoints**: 10 requests per hour per business

## Webhook Support

### WooCommerce Webhooks
Receive real-time updates when products change in WooCommerce.

#### POST /api/webhooks/woocommerce/[businessId]
Handle WooCommerce product updates.

**Headers:**
- `X-WC-Webhook-Source`: WooCommerce store URL
- `X-WC-Webhook-Topic`: product.created | product.updated | product.deleted
- `X-WC-Webhook-Signature`: HMAC signature for verification
