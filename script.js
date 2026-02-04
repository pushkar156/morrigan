// ============================================
// MORRIGAN - INTERACTIVE FUNCTIONALITY
// ============================================

// ============================================
// MOBILE MENU TOGGLE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            // Toggle active class on menu
            navMenu.classList.toggle('active');
            // Toggle active class on button for animation
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
});

// ============================================
// CHATBOT FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const chatbotButton = document.querySelector('.chatbot-button');
    
    if (chatbotButton) {
        chatbotButton.addEventListener('click', function() {
            openChatbot();
        });
    }
});

// Demo messages for the chatbot
const demoMessages = [
    {
        type: 'bot',
        text: 'Hello! I\'m Morrigan, your AI assistant. How can I help you today?'
    },
    {
        type: 'user',
        text: 'What is this website about?'
    },
    {
        type: 'bot',
        text: 'Morrigan is a platform dedicated to perspectives on modern intelligence, offering thought-provoking insights for contemporary leaders navigating the intersection of human wisdom and artificial capability.'
    },
    {
        type: 'user',
        text: 'Can you tell me about the latest articles?'
    },
    {
        type: 'bot',
        text: 'Of course! We have several fascinating articles including "The Future of Autonomous Strategy", "Calm Leadership in the AI Era", and "Systems of Thought". Each explores different aspects of AI and leadership. Which topic interests you most?'
    }
];

let currentDemoIndex = 0;

function openChatbot() {
    // Check if chatbot already exists
    let chatbotContainer = document.querySelector('.chatbot-container');
    
    if (chatbotContainer) {
        // If it exists, just toggle visibility
        chatbotContainer.classList.toggle('active');
        return;
    }
    
    // Create chatbot container
    chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'chatbot-container active';
    
    chatbotContainer.innerHTML = `
        <div class="chatbot-header">
            <div class="chatbot-header-info">
                <div class="chatbot-avatar">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#1152d4;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#64b5f6;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <circle cx="12" cy="12" r="11" fill="url(#avatarGradient)" opacity="0.2"/>
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="url(#avatarGradient)"/>
                    </svg>
                </div>
                <div class="chatbot-header-text">
                    <h3>Morrigan AI</h3>
                    <span class="chatbot-status">
                        <span class="status-dot"></span>
                        Online
                    </span>
                </div>
            </div>
            <button class="chatbot-close" aria-label="Close chatbot">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>
        
        <div class="chatbot-messages" id="chatbotMessages">
            <div class="chatbot-welcome">
                <div class="welcome-avatar">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="welcomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#1152d4;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#64b5f6;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="url(#welcomeGradient)"/>
                    </svg>
                </div>
                <h4>Welcome to Morrigan AI</h4>
                <p>Ask me anything about our articles, insights, or how we can help you navigate modern intelligence.</p>
            </div>
        </div>
        
        <div class="chatbot-input-container">
            <input 
                type="text" 
                class="chatbot-input" 
                placeholder="Type your message..."
                id="chatbotInput"
            />
            <button class="chatbot-send" id="chatbotSend" aria-label="Send message">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
            </button>
        </div>
        
        <div class="chatbot-demo-trigger">
            <button class="demo-button" id="demoButton">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px; margin-right: 6px;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                Try Demo Conversation
            </button>
        </div>
    `;
    
    document.body.appendChild(chatbotContainer);
    
    // Add event listeners
    const closeButton = chatbotContainer.querySelector('.chatbot-close');
    const sendButton = chatbotContainer.querySelector('#chatbotSend');
    const input = chatbotContainer.querySelector('#chatbotInput');
    const demoButton = chatbotContainer.querySelector('#demoButton');
    
    closeButton.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
    });
    
    sendButton.addEventListener('click', function() {
        sendMessage();
    });
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    demoButton.addEventListener('click', function() {
        startDemoConversation();
    });
}

function sendMessage() {
    const input = document.querySelector('#chatbotInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    addMessage('user', message);
    input.value = '';
    
    // Simulate bot response
    setTimeout(function() {
        showTypingIndicator();
        setTimeout(function() {
            hideTypingIndicator();
            addMessage('bot', 'Thank you for your message! This is a demo chatbot. In the full version, I\'ll be able to answer questions about specific articles and provide intelligent insights based on the content you\'re viewing.');
        }, 1500);
    }, 500);
}

function addMessage(type, text) {
    const messagesContainer = document.querySelector('#chatbotMessages');
    const welcomeMessage = messagesContainer.querySelector('.chatbot-welcome');
    
    // Remove welcome message if it exists
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${type}-message`;
    
    if (type === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="msgGradient${Date.now()}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#1152d4;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#64b5f6;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="url(#msgGradient${Date.now()})"/>
                </svg>
            </div>
            <div class="message-content">${text}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.querySelector('#chatbotMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="typingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#1152d4;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#64b5f6;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="url(#typingGradient)"/>
            </svg>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('#typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function startDemoConversation() {
    const demoTrigger = document.querySelector('.chatbot-demo-trigger');
    if (demoTrigger) {
        demoTrigger.style.display = 'none';
    }
    
    currentDemoIndex = 0;
    showNextDemoMessage();
}

function showNextDemoMessage() {
    if (currentDemoIndex >= demoMessages.length) {
        return;
    }
    
    const message = demoMessages[currentDemoIndex];
    
    if (message.type === 'bot') {
        showTypingIndicator();
        setTimeout(function() {
            hideTypingIndicator();
            addMessage(message.type, message.text);
            currentDemoIndex++;
            setTimeout(showNextDemoMessage, 1000);
        }, 1500);
    } else {
        addMessage(message.type, message.text);
        currentDemoIndex++;
        setTimeout(showNextDemoMessage, 800);
    }
}
