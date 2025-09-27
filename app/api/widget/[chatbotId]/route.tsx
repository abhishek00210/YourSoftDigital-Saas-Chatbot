import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ chatbotId: string }> }) {
  try {
    const { chatbotId } = await params
    const supabase = await createClient()

    // Get chatbot configuration
    const { data: chatbot, error } = await supabase
      .from("chatbots")
      .select(`
        *,
        businesses!inner(
          name,
          website_url
        )
      `)
      .eq("id", chatbotId)
      .eq("is_active", true)
      .single()

    if (error || !chatbot) {
      return new NextResponse("Chatbot not found or inactive", { status: 404 })
    }

    // Generate the widget JavaScript
    const widgetScript = `
(function() {
  // Prevent multiple initializations
  if (window.ChatbotWidget) return;

  const CHATBOT_CONFIG = {
    id: "${chatbot.id}",
    name: "${chatbot.name.replace(/"/g, '\\"')}",
    welcomeMessage: "${chatbot.welcome_message.replace(/"/g, '\\"')}",
    color: "${chatbot.widget_color}",
    position: "${chatbot.widget_position}",
    apiUrl: "${request.nextUrl.origin}"
  };

  class ChatbotWidget {
    constructor(config) {
      this.config = config;
      this.isOpen = false;
      this.conversationId = null;
      this.visitorId = this.generateVisitorId();
      this.messages = [];
      this.init();
    }

    generateVisitorId() {
      const stored = localStorage.getItem('chatbot_visitor_id');
      if (stored) return stored;
      
      const id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatbot_visitor_id', id);
      return id;
    }

    init() {
      this.createStyles();
      this.createWidget();
      this.addWelcomeMessage();
    }

    createStyles() {
      const styles = \`
        .chatbot-widget {
          position: fixed;
          \${this.config.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
          bottom: 20px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .chatbot-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: \${this.config.color};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .chatbot-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        .chatbot-button svg {
          width: 24px;
          height: 24px;
          fill: white;
        }

        .chatbot-window {
          position: absolute;
          bottom: 80px;
          \${this.config.position === 'bottom-left' ? 'left: 0;' : 'right: 0;'}
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: none;
          flex-direction: column;
          overflow: hidden;
        }

        .chatbot-window.open {
          display: flex;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chatbot-header {
          background: \${this.config.color};
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chatbot-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .chatbot-header p {
          margin: 0;
          font-size: 12px;
          opacity: 0.9;
        }

        .chatbot-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0.8;
        }

        .chatbot-close:hover {
          opacity: 1;
          background: rgba(255,255,255,0.1);
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chatbot-message {
          display: flex;
          gap: 8px;
          max-width: 80%;
        }

        .chatbot-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .chatbot-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: \${this.config.color};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chatbot-avatar svg {
          width: 16px;
          height: 16px;
          fill: white;
        }

        .chatbot-message-content {
          background: #f1f5f9;
          padding: 12px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.4;
        }

        .chatbot-message.user .chatbot-message-content {
          background: \${this.config.color};
          color: white;
        }

        .chatbot-products {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chatbot-product {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px;
          display: flex;
          gap: 8px;
          align-items: center;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s;
        }

        .chatbot-product:hover {
          border-color: \${this.config.color};
        }

        .chatbot-product-image {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          object-fit: cover;
          background: #f8fafc;
        }

        .chatbot-product-info {
          flex: 1;
        }

        .chatbot-product-name {
          font-size: 12px;
          font-weight: 500;
          margin: 0 0 2px 0;
        }

        .chatbot-product-price {
          font-size: 11px;
          color: #64748b;
          margin: 0;
        }

        .chatbot-input-area {
          padding: 16px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 8px;
        }

        .chatbot-input {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          outline: none;
        }

        .chatbot-input:focus {
          border-color: \${this.config.color};
        }

        .chatbot-send {
          background: \${this.config.color};
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          color: white;
          cursor: pointer;
          font-size: 14px;
          transition: opacity 0.2s;
        }

        .chatbot-send:hover:not(:disabled) {
          opacity: 0.9;
        }

        .chatbot-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chatbot-typing {
          display: flex;
          gap: 4px;
          padding: 12px;
          background: #f1f5f9;
          border-radius: 12px;
          align-items: center;
        }

        .chatbot-typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #94a3b8;
          animation: typing 1.4s infinite;
        }

        .chatbot-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .chatbot-typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }

        .chatbot-footer {
          padding: 8px 16px;
          text-align: center;
          font-size: 12px;
          background-color: #f9fafb;
          border-top: 1px solid #e2e8f0;
        }

        .chatbot-footer a {
          color: #3b82f6;
          text-decoration: none;
        }

        .chatbot-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 120px);
            max-height: 600px;
          }
        }
      \`;

      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    createWidget() {
      const widget = document.createElement('div');
      widget.className = 'chatbot-widget';
      widget.innerHTML = \`
        <button class="chatbot-button" id="chatbot-toggle">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.7-.3-3.87-.87L7 20l.87-1.13C7.3 17.7 7 16.4 7 15c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5z"/>
          </svg>
        </button>
        <div class="chatbot-window" id="chatbot-window">
          <div class="chatbot-header">
            <div>
              <h3>\${this.config.name}</h3>
              <p>Online now</p>
            </div>
            <button class="chatbot-close" id="chatbot-close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          <div class="chatbot-messages" id="chatbot-messages"></div>
          <div class="chatbot-input-area">
            <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Type your message...">
            <button class="chatbot-send" id="chatbot-send">Send</button>
          </div>
          <div class="chatbot-footer">
            Powered by <a href="https://yoursoftdigital.ca/" target="_blank" rel="noopener noreferrer">yoursoftdigital.ca</a>
          </div>
        </div>
      \`;

      document.body.appendChild(widget);
      this.bindEvents();
    }

    bindEvents() {
      const toggle = document.getElementById('chatbot-toggle');
      const close = document.getElementById('chatbot-close');
      const input = document.getElementById('chatbot-input');
      const send = document.getElementById('chatbot-send');

      toggle.addEventListener('click', () => this.toggleWidget());
      close.addEventListener('click', () => this.closeWidget());
      send.addEventListener('click', () => this.sendMessage());
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }

    toggleWidget() {
      const window = document.getElementById('chatbot-window');
      this.isOpen = !this.isOpen;
      window.classList.toggle('open', this.isOpen);
      
      if (this.isOpen) {
        document.getElementById('chatbot-input').focus();
      }
    }

    closeWidget() {
      const window = document.getElementById('chatbot-window');
      this.isOpen = false;
      window.classList.remove('open');
    }

    addWelcomeMessage() {
      this.addMessage(this.config.welcomeMessage, 'bot');
    }

    addMessage(content, sender, products = []) {
      const messagesContainer = document.getElementById('chatbot-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = \`chatbot-message \${sender}\`;

      let productsHtml = '';
      if (products && products.length > 0) {
        productsHtml = \`
          <div class="chatbot-products">
            \${products.map(product => \`
              <a href="\${product.permalink || '#'}" target="_blank" class="chatbot-product">
                <img src="\${product.image || ''}" alt="\${product.name}" class="chatbot-product-image" onerror="this.style.display='none'">
                <div class="chatbot-product-info">
                  <p class="chatbot-product-name">\${product.name}</p>
                  <p class="chatbot-product-price">\${product.price ? '$' + product.price.toFixed(2) : 'Price not available'}</p>
                </div>
              </a>
            \`).join('')}
          </div>
        \`;
      }

      messageDiv.innerHTML = \`
        \${sender === 'bot' ? \`
          <div class="chatbot-avatar">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.7-.3-3.87-.87L7 20l.87-1.13C7.3 17.7 7 16.4 7 15c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5z"/>
            </svg>
          </div>
        \` : ''}
        <div class="chatbot-message-content">
          \${content}
          \${productsHtml}
        </div>
      \`;

      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
      const messagesContainer = document.getElementById('chatbot-messages');
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chatbot-message bot';
      typingDiv.id = 'chatbot-typing';
      typingDiv.innerHTML = \`
        <div class="chatbot-avatar">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.7-.3-3.87-.87L7 20l.87-1.13C7.3 17.7 7 16.4 7 15c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5z"/>
          </svg>
        </div>
        <div class="chatbot-typing">
          <div class="chatbot-typing-dot"></div>
          <div class="chatbot-typing-dot"></div>
          <div class="chatbot-typing-dot"></div>
        </div>
      \`;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
      const typing = document.getElementById('chatbot-typing');
      if (typing) typing.remove();
    }

    async sendMessage() {
      const input = document.getElementById('chatbot-input');
      const send = document.getElementById('chatbot-send');
      const message = input.value.trim();

      if (!message) return;

      // Add user message
      this.addMessage(message, 'user');
      input.value = '';
      send.disabled = true;

      // Show typing indicator
      this.showTyping();

      try {
        const response = await fetch(\`\${this.config.apiUrl}/api/chat/\${this.config.id}\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            conversationId: this.conversationId,
            visitorId: this.visitorId,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          this.conversationId = data.conversationId;
          this.hideTyping();
          this.addMessage(data.response, 'bot', data.relevantProducts || []);
        } else {
          this.hideTyping();
          this.addMessage('Sorry, something went wrong. Please try again.', 'bot');
        }
      } catch (error) {
        this.hideTyping();
        this.addMessage('Sorry, I\\'m having trouble connecting. Please try again.', 'bot');
      } finally {
        send.disabled = false;
      }
    }
  }

  // Initialize the widget
  window.ChatbotWidget = new ChatbotWidget(CHATBOT_CONFIG);
})();
`

    return new NextResponse(widgetScript, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Widget generation error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}