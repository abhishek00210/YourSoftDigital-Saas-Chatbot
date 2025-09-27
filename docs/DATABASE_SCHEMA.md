# Database Schema Design

## Entity Relationship Diagram

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Users       │    │   Businesses    │    │    Chatbots     │
│                 │    │                 │    │                 │
│ • id (PK)       │    │ • id (PK)       │    │ • id (PK)       │
│ • email         │◄──►│ • user_id (FK)  │◄──►│ • business_id   │
│ • password_hash │    │ • name          │    │ • name          │
│ • created_at    │    │ • category      │    │ • config        │
│ • updated_at    │    │ • description   │    │ • is_active     │
└─────────────────┘    │ • contact_email │    │ • created_at    │
                       │ • working_hours │    └─────────────────┘
                       │ • woo_api_url   │
                       │ • woo_api_key   │
                       │ • created_at    │
                       └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Products      │    │ Conversations   │    │    Messages     │
│                 │    │                 │    │                 │
│ • id (PK)       │    │ • id (PK)       │    │ • id (PK)       │
│ • business_id   │    │ • chatbot_id    │    │ • conversation  │
│ • woo_id        │    │ • session_id    │    │ • content       │
│ • name          │    │ • customer_ip   │    │ • role          │
│ • description   │    │ • started_at    │    │ • timestamp     │
│ • price         │    │ • ended_at      │    └─────────────────┘
│ • category      │    └─────────────────┘
│ • stock_status  │
│ • images        │
│ • synced_at     │
└─────────────────┘
\`\`\`

## Table Definitions

### Users Table
\`\`\`sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email_verified BOOLEAN DEFAULT FALSE,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Businesses Table
\`\`\`sql
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    working_hours JSONB,
    website_url VARCHAR(500),
    woo_api_url VARCHAR(500),
    woo_api_key VARCHAR(255),
    woo_api_secret VARCHAR(255),
    branding JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Chatbots Table
\`\`\`sql
CREATE TABLE chatbots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tone VARCHAR(50) DEFAULT 'friendly',
    config JSONB DEFAULT '{}',
    system_prompt TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    widget_key VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Products Table
\`\`\`sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    woo_id INTEGER,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2),
    regular_price DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    category VARCHAR(255),
    stock_status VARCHAR(50),
    stock_quantity INTEGER,
    images JSONB DEFAULT '[]',
    attributes JSONB DEFAULT '{}',
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Conversations Table
\`\`\`sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    customer_ip VARCHAR(45),
    customer_user_agent TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    message_count INTEGER DEFAULT 0,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5)
);
\`\`\`

### Messages Table
\`\`\`sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Analytics Table
\`\`\`sql
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    avg_conversation_length DECIMAL(5,2) DEFAULT 0,
    top_queries JSONB DEFAULT '[]',
    response_time_avg DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(chatbot_id, date)
);
\`\`\`

## Indexes for Performance

\`\`\`sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_status);

-- Business indexes
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_category ON businesses(category);

-- Chatbot indexes
CREATE INDEX idx_chatbots_business_id ON chatbots(business_id);
CREATE INDEX idx_chatbots_widget_key ON chatbots(widget_key);
CREATE INDEX idx_chatbots_active ON chatbots(is_active);

-- Product indexes
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_products_woo_id ON products(business_id, woo_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_synced_at ON products(synced_at);

-- Conversation indexes
CREATE INDEX idx_conversations_chatbot_id ON conversations(chatbot_id);
CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversations_started_at ON conversations(started_at);

-- Message indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- Analytics indexes
CREATE INDEX idx_analytics_chatbot_date ON analytics(chatbot_id, date);
\`\`\`

## Data Relationships

1. **One-to-Many**: User → Businesses → Chatbots
2. **One-to-Many**: Business → Products (synced from WooCommerce)
3. **One-to-Many**: Chatbot → Conversations → Messages
4. **One-to-Many**: Chatbot → Analytics (daily aggregations)

## Data Retention Policy

- **Messages**: Keep for 90 days (configurable per subscription tier)
- **Analytics**: Keep aggregated data for 2 years
- **Products**: Sync daily, keep historical data for 30 days
- **Conversations**: Archive after 30 days, delete after 1 year
