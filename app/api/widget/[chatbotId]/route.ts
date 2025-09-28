import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserSubscription } from "@/lib/utils/subscriptions"

export async function GET(
  request: NextRequest,
  { params }: { params: { chatbotId: string } }
) {
  try {
    const { chatbotId } = params
    const supabase = await createClient()

    // Get chatbot configuration
    const { data: chatbot, error } = await supabase
      .from("chatbots")
      .select(
        `
        *,
        businesses!inner(
          name,
          website_url,
          user_id
        )
      `
      )
      .eq("id", chatbotId)
      .eq("is_active", true)
      .single()

    if (error || !chatbot) {
      return new NextResponse("Chatbot not found or inactive", { status: 404 })
    }

    const userId = chatbot.businesses.user_id
    const { data: subscription } = await getUserSubscription(userId)
    const planName = subscription?.prices?.products?.name || "Free"
    const showBranding = planName !== "Pro"

    const footerHTML = showBranding
      ? `<div class="chatbot-footer">
            Powered by <a href="https://yoursoftdigital.ca/" target="_blank" rel="noopener noreferrer">yoursoftdigital.ca</a>
          </div>`
      : ""

    // Generate the widget JavaScript
    const widgetScript = `
(function() {
  // Prevent multiple initializations
  if (window.ChatbotWidget) return;

  const CHATBOT_CONFIG = {
    id: "${chatbot.id}",
    name: "${chatbot.name.replace(/"/g, '\\"')}",
    welcomeMessage: "${(chatbot.welcome_message || "Hello! How can I help you today?").replace(/"/g, '\\"')}",
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
          position: fixed !important;
          bottom: 20px !important;
          z-index: 2147483647 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          \${this.config.position === 'bottom-left' ? 'left: 20px !important;' : 'right: 20px !important;'}
        }

        .chatbot-button {
          width: 60px !important;
          height: 60px !important;
          border-radius: 50% !important;
          background: \${this.config.color} !important;
          border: none !important;
          cursor: pointer !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: transform 0.2s, box-shadow 0.2s !important;
        }

        .chatbot-button:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 6px 16px rgba(0,0,0,0.2) !important;
        }

        .chatbot-button svg {
          width: 24px !important;
          height: 24px !important;
          fill: white !important;
        }

        .chatbot-window {
          position: absolute !important;
          bottom: 80px !important;
          width: 350px !important;
          height: 500px !important;
          background: white !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
          display: none !important;
          flex-direction: column !important;
          overflow: hidden !important;
          \${this.config.position === 'bottom-left' ? 'left: 0 !important;' : 'right: 0 !important;'}
        }

        .chatbot-window.open {
          display: flex !important;
          animation: slideUp 0.3s ease-out;
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
          ${footerHTML}
        </div>
      \`;

      document.body.appendChild(widget);
      this.bindEvents();
    }

    bindEvents() {
      const toggleButton = document.getElementById('chatbot-toggle');
      const windowEl = document.getElementById('chatbot-window');
      const closeButton = document.getElementById('chatbot-close');

      toggleButton.addEventListener('click', () => {
        windowEl.classList.toggle('open');
      });

      closeButton.addEventListener('click', () => {
        windowEl.classList.remove('open');
      });
    }

    addWelcomeMessage() {
      const messagesEl = document.getElementById('chatbot-messages');
      const msg = document.createElement('div');
      msg.textContent = this.config.welcomeMessage;
      messagesEl.appendChild(msg);
    }
  }

  // Initialize the widget
  window.ChatbotWidget = new ChatbotWidget(CHATBOT_CONFIG);
})();
`

    return new NextResponse(widgetScript, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Widget generation error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

