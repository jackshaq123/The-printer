/**
 * THE PRINTER - Embeddable Chat Widget
 * Add this script to any website to embed the AI business assistant
 */

(function() {
  'use strict';

  // THE PRINTER Chat Widget
  // Embed this script on any website to add AI business assistance
  
  class PrinterWidget {
    constructor(config = {}) {
      this.config = {
        apiUrl: config.apiUrl || 'https://the-printer.com',
        widgetId: config.widgetId || 'printer-widget',
        position: config.position || 'bottom-right',
        theme: config.theme || 'dark',
        primaryColor: config.primaryColor || '#3B82F6',
        ...config
      };
      
      this.isOpen = false;
      this.messages = [];
      this.currentUser = null;
      this.init();
    }

    init() {
      this.createWidget();
      this.attachEventListeners();
      this.loadUserSession();
      this.trackPageView();
    }

    createWidget() {
      // Create widget container
      const widget = document.createElement('div');
      widget.id = this.config.widgetId;
      widget.className = `printer-widget printer-widget--${this.config.theme}`;
      widget.style.cssText = `
        position: fixed;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        ${this.getPositionStyles()}
      `;

      // Create chat button
      const chatButton = document.createElement('div');
      chatButton.className = 'printer-widget__button';
      chatButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
        </svg>
        <span class="printer-widget__button-text">AI Assistant</span>
      `;
      chatButton.style.cssText = `
        background: ${this.config.primaryColor};
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        font-weight: 500;
      `;

      // Create chat window
      const chatWindow = document.createElement('div');
      chatWindow.className = 'printer-widget__window';
      chatWindow.style.cssText = `
        display: none;
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        border: 1px solid #e5e7eb;
        overflow: hidden;
        flex-direction: column;
      `;

      // Chat header
      const chatHeader = document.createElement('div');
      chatHeader.className = 'printer-widget__header';
      chatHeader.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; padding: 16px;">
          <div style="width: 32px; height: 32px; background: ${this.config.primaryColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2"/>
              <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <div style="font-weight: 600; color: #111827;">THE PRINTER</div>
            <div style="font-size: 12px; color: #6b7280;">AI Business Assistant</div>
          </div>
          <button class="printer-widget__close" style="margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#6b7280" stroke-width="2"/>
            </svg>
          </button>
        </div>
      `;

      // Chat messages container
      const chatMessages = document.createElement('div');
      chatMessages.className = 'printer-widget__messages';
      chatMessages.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f9fafb;
      `;

      // Chat input
      const chatInput = document.createElement('div');
      chatInput.className = 'printer-widget__input';
      chatInput.style.cssText = `
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        background: white;
      `;
      chatInput.innerHTML = `
        <div style="display: flex; gap: 8px;">
          <input type="text" class="printer-widget__input-field" placeholder="Ask me anything about business..." style="
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
          ">
          <button class="printer-widget__send" style="
            background: ${this.config.primaryColor};
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            cursor: pointer;
            font-weight: 500;
          ">Send</button>
        </div>
      `;

      // Assemble chat window
      chatWindow.appendChild(chatHeader);
      chatWindow.appendChild(chatMessages);
      chatWindow.appendChild(chatInput);

      // Add to widget
      widget.appendChild(chatButton);
      widget.appendChild(chatWindow);

      // Add to page
      document.body.appendChild(widget);

      // Store references
      this.widget = widget;
      this.chatButton = chatButton;
      this.chatWindow = chatWindow;
      this.chatMessages = chatMessages;
      this.chatInput = chatInput.querySelector('.printer-widget__input-field');
      this.sendButton = chatInput.querySelector('.printer-widget__send');
      this.closeButton = chatHeader.querySelector('.printer-widget__close');
    }

    getPositionStyles() {
      const positions = {
        'bottom-right': 'bottom: 20px; right: 20px;',
        'bottom-left': 'bottom: 20px; left: 20px;',
        'top-right': 'top: 20px; right: 20px;',
        'top-left': 'top: 20px; left: 20px;'
      };
      return positions[this.config.position] || positions['bottom-right'];
    }

    attachEventListeners() {
      // Toggle chat window
      this.chatButton.addEventListener('click', () => this.toggleChat());
      this.closeButton.addEventListener('click', () => this.closeChat());

      // Send message
      this.sendButton.addEventListener('click', () => this.sendMessage());
      this.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.closeChat();
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!this.widget.contains(e.target) && this.isOpen) {
          this.closeChat();
        }
      });
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      this.chatWindow.style.display = 'flex';
      this.chatButton.style.transform = 'scale(0.95)';
      
      // Add welcome message if first time
      if (this.messages.length === 0) {
        this.addMessage({
          type: 'assistant',
          content: 'Hello! I\'m THE PRINTER, your AI business assistant. I can help you with business strategy, marketing, content creation, and more. What would you like to work on today?',
          timestamp: new Date()
        });
      }

      this.trackEvent('chat_opened');
    }

    closeChat() {
      this.isOpen = false;
      this.chatWindow.style.display = 'none';
      this.chatButton.style.transform = 'scale(1)';
      this.trackEvent('chat_closed');
    }

    async sendMessage() {
      const content = this.chatInput.value.trim();
      if (!content) return;

      // Add user message
      this.addMessage({
        type: 'user',
        content,
        timestamp: new Date()
      });

      // Clear input
      this.chatInput.value = '';

      // Show typing indicator
      const typingId = this.showTypingIndicator();

      try {
        // Send to API
        const response = await fetch(`${this.config.apiUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            saveToDocument: true,
            source: 'widget',
            pageUrl: window.location.href,
            userAgent: navigator.userAgent
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Remove typing indicator
          this.hideTypingIndicator(typingId);
          
          // Add AI response
          this.addMessage({
            type: 'assistant',
            content: data.data.message,
            timestamp: new Date(),
            documentId: data.data.documentId
          });

          // Track successful interaction
          this.trackEvent('message_sent', { success: true });
          
          // Check for lead generation opportunity
          this.checkLeadOpportunity(content, data.data.message);

        } else {
          throw new Error('API request failed');
        }

      } catch (error) {
        console.error('Error sending message:', error);
        
        // Remove typing indicator
        this.hideTypingIndicator(typingId);
        
        // Show error message
        this.addMessage({
          type: 'assistant',
          content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
          timestamp: new Date()
        });

        this.trackEvent('message_sent', { success: false, error: error.message });
      }
    }

    addMessage(message) {
      this.messages.push(message);
      
      const messageElement = document.createElement('div');
      messageElement.className = `printer-widget__message printer-widget__message--${message.type}`;
      messageElement.style.cssText = `
        margin-bottom: 12px;
        display: flex;
        flex-direction: ${message.type === 'user' ? 'row-reverse' : 'row'};
        gap: 8px;
      `;

      const messageContent = document.createElement('div');
      messageContent.style.cssText = `
        max-width: 80%;
        padding: 8px 12px;
        border-radius: 12px;
        background: ${message.type === 'user' ? this.config.primaryColor : 'white'};
        color: ${message.type === 'user' ? 'white' : '#111827'};
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        word-wrap: break-word;
      `;
      messageContent.textContent = message.content;

      const timestamp = document.createElement('div');
      timestamp.style.cssText = `
        font-size: 11px;
        color: #9ca3af;
        margin-top: 4px;
        text-align: ${message.type === 'user' ? 'right' : 'left'};
      `;
      timestamp.textContent = message.timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      messageContent.appendChild(timestamp);
      messageElement.appendChild(messageContent);
      
      this.chatMessages.appendChild(messageElement);
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
      const typingId = `typing_${Date.now()}`;
      const typingElement = document.createElement('div');
      typingElement.id = typingId;
      typingElement.className = 'printer-widget__typing';
      typingElement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="display: flex; gap: 2px;">
            <div class="typing-dot" style="width: 6px; height: 6px; background: #9ca3af; border-radius: 50%; animation: typing 1.4s infinite ease-in-out;"></div>
            <div class="typing-dot" style="width: 6px; height: 6px; background: #9ca3af; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.2s;"></div>
            <div class="typing-dot" style="width: 6px; height: 6px; background: #9ca3af; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.4s;"></div>
          </div>
          <span style="font-size: 12px; color: #6b7280;">AI is typing...</span>
        </div>
      `;
      
      this.chatMessages.appendChild(typingElement);
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
      
      return typingId;
    }

    hideTypingIndicator(typingId) {
      const typingElement = document.getElementById(typingId);
      if (typingElement) {
        typingElement.remove();
      }
    }

    async checkLeadOpportunity(userMessage, aiResponse) {
      // Check if this interaction qualifies as a lead
      const leadKeywords = ['help', 'consulting', 'strategy', 'marketing', 'business', 'startup', 'growth'];
      const hasLeadIntent = leadKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );

      if (hasLeadIntent) {
        try {
          // Generate lead
          await fetch(`${this.config.apiUrl}/api/leads`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'generate',
              source: 'widget',
              vertical: this.detectVertical(userMessage),
              city: this.detectLocation(),
              context: userMessage,
              aiResponse: aiResponse
            }),
          });

          this.trackEvent('lead_generated', { source: 'widget' });
        } catch (error) {
          console.error('Error generating lead:', error);
        }
      }
    }

    detectVertical(message) {
      const verticals = {
        'tech': ['software', 'app', 'saas', 'technology', 'digital'],
        'health': ['health', 'fitness', 'wellness', 'medical', 'nutrition'],
        'finance': ['money', 'investment', 'finance', 'banking', 'crypto'],
        'education': ['course', 'training', 'education', 'learning', 'school'],
        'retail': ['store', 'shop', 'ecommerce', 'retail', 'product']
      };

      for (const [vertical, keywords] of Object.entries(verticals)) {
        if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
          return vertical;
        }
      }
      return 'general';
    }

    detectLocation() {
      // Try to detect location from various sources
      // This is a simplified version - in production you'd use IP geolocation or user input
      return 'Unknown';
    }

    loadUserSession() {
      // Load or create user session
      const sessionId = localStorage.getItem('printer_widget_session') || 
                       `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      localStorage.setItem('printer_widget_session', sessionId);
      
      this.currentUser = {
        sessionId,
        firstVisit: !localStorage.getItem('printer_widget_visited'),
        visitCount: parseInt(localStorage.getItem('printer_widget_visit_count') || '0') + 1
      };

      localStorage.setItem('printer_widget_visited', 'true');
      localStorage.setItem('printer_widget_visit_count', this.currentUser.visitCount.toString());
    }

    trackPageView() {
      this.trackEvent('page_view', {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      });
    }

    trackEvent(eventName, properties = {}) {
      try {
        // Send analytics event
        const eventData = {
          event: eventName,
          timestamp: new Date().toISOString(),
          sessionId: this.currentUser?.sessionId,
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          ...properties
        };

        // Send to analytics endpoint
        fetch(`${this.config.apiUrl}/api/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        }).catch(() => {
          // Silently fail if analytics endpoint is not available
        });

        // Also log locally for debugging
        console.log('Printer Widget Event:', eventData);
      } catch (error) {
        console.error('Error tracking event:', error);
      }
    }
  }

  // Add typing animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.PrinterWidget = new PrinterWidget();
    });
  } else {
    window.PrinterWidget = new PrinterWidget();
  }

  // Export for manual initialization
  window.PrinterWidgetClass = PrinterWidget;
})(); 