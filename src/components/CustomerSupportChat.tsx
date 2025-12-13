import { useState, useEffect } from 'react';
import { Send, User, Mail, Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  type: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface UserInfo {
  name?: string;
  email?: string;
  phone?: string;
}

type ConversationState = 'greeting' | 'collecting_name' | 'collecting_contact' | 'ready_to_help' | 'routing_to_demo';

export function CustomerSupportChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [conversationState, setConversationState] = useState<ConversationState>('greeting');
  const [loading, setLoading] = useState(false);

  // Initialize with greeting message
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        type: 'bot',
        text: "Thanks for connecting! 👋\n\nI'm here to help you. To get started, could you please provide:\n\n1. Your name\n2. Your contact information (email or phone)\n\nWhat can I help you with today?",
        timestamp: new Date()
      };
      setMessages([greeting]);
      setConversationState('collecting_name');
    }
  }, []);

  // Keywords that indicate user wants to contact Srikanth Sir
  const contactKeywords = [
    'contact srikanth',
    'srikanth sir',
    'talk to srikanth',
    'speak with srikanth',
    'meet srikanth',
    'srikanth contact',
    'how to contact',
    'contact teacher',
    'contact instructor',
    'book demo',
    'schedule demo',
    'free demo',
    'demo session'
  ];

  const checkIfContactRequest = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return contactKeywords.some(keyword => lowerText.includes(keyword));
  };

  const extractName = (text: string): string | null => {
    // Remove phone numbers and email addresses first
    let cleanText = text
      .replace(/[\d\s\-\+\(\)]{10,}/g, '') // Remove phone numbers
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '') // Remove emails
      .replace(/\s+/g, ' ')
      .trim();
    
    // Look for patterns like "I'm John" or "My name is John"
    const patterns = [
      /(?:my name is|i'm|i am|name is|call me|this is)\s+([a-z]+(?:\s+[a-z]+)?)/i,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
    ];
    
    for (const pattern of patterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    // If text contains "and" or "&", take the part before it (likely the name)
    if (cleanText.includes(' and ') || cleanText.includes(' & ')) {
      const parts = cleanText.split(/\s+(?:and|&)\s+/i);
      if (parts[0] && parts[0].trim().length > 0) {
        const namePart = parts[0].trim();
        // Check if it looks like a name (letters only, 2-30 chars)
        if (/^[a-zA-Z\s]{2,30}$/.test(namePart)) {
          return namePart;
        }
      }
    }
    
    // Check if it's a simple name (letters only, 2-30 chars, no numbers)
    const words = cleanText.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length > 0 && words.length <= 3) {
      const potentialName = words.join(' ');
      // Check if all words are letters (no numbers, no special chars except spaces)
      if (/^[a-zA-Z\s]{2,30}$/.test(potentialName)) {
        return potentialName;
      }
    }
    
    return null;
  };

  const extractContact = (text: string): { email?: string; phone?: string } => {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phonePattern = /[\d\s\-\+\(\)]{10,}/;
    
    const email = text.match(emailPattern)?.[0];
    const phone = text.match(phonePattern)?.[0]?.replace(/\s/g, '');
    
    return { email, phone };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const messageText = input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      type: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    // Check if user wants to contact Srikanth Sir
    if (checkIfContactRequest(messageText)) {
      setTimeout(() => {
        const botMessage: Message = {
          type: 'bot',
          text: "Great! I'll help you connect with Srikanth Sir. Let me take you to our demo booking page where you can schedule a free session with him. 🎓",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);
        setInput('');
        
        // Route to demo page after a short delay
        setTimeout(() => {
          navigate('/demo');
        }, 2000);
      }, 1000);
      return;
    }

    // Collect user information
    if (conversationState === 'collecting_name') {
      const name = extractName(messageText);
      const contact = extractContact(messageText);
      
      // If user provided both name and contact in one message
      if (name && (contact.email || contact.phone)) {
        setUserInfo({ name, ...contact });
        const botMessage: Message = {
          type: 'bot',
          text: `Perfect! Thank you, ${name}! I have your contact information. How can I help you today? 😊\n\nYou can ask me about:\n• Course information\n• How to contact Srikanth Sir\n• Demo sessions\n• Course enrollment\n• Any other questions!`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setConversationState('ready_to_help');
      } else if (name) {
        // Only name provided
        setUserInfo(prev => ({ ...prev, name }));
        const botMessage: Message = {
          type: 'bot',
          text: `Nice to meet you, ${name}! 👋\n\nCould you please share your contact information? You can provide your email address or phone number.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setConversationState('collecting_contact');
      } else if (contact.email || contact.phone) {
        // Only contact provided, no name
        setUserInfo(prev => ({ ...prev, ...contact }));
        const botMessage: Message = {
          type: 'bot',
          text: `Thank you for the contact information! Could you please also tell me your name?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Neither name nor contact detected
        const botMessage: Message = {
          type: 'bot',
          text: "I'd love to know your name! Could you please tell me your name?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } else if (conversationState === 'collecting_contact') {
      const contact = extractContact(messageText);
      if (contact.email || contact.phone) {
        setUserInfo(prev => ({ ...prev, ...contact }));
        const botMessage: Message = {
          type: 'bot',
          text: `Perfect! Thank you for providing your contact information. ${userInfo.name ? `Hi ${userInfo.name}, ` : ''}how can I help you today? 😊\n\nYou can ask me about:\n• Course information\n• How to contact Srikanth Sir\n• Demo sessions\n• Course enrollment\n• Any other questions!`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setConversationState('ready_to_help');
      } else {
        const botMessage: Message = {
          type: 'bot',
          text: "Could you please provide your email address or phone number? For example: john@example.com or +1234567890",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } else if (conversationState === 'ready_to_help') {
      // General help responses
      const lowerInput = messageText.toLowerCase();
      let response = "";

      if (lowerInput.includes('course') || lowerInput.includes('enroll') || lowerInput.includes('class')) {
        response = "Great question! We offer AP Physics, IGCSE, SAT Physics, IIT-JEE, and NEET courses. Would you like to know more about a specific course, or would you like to book a free demo session with Srikanth Sir?";
      } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('fee')) {
        response = "I'd be happy to help you with pricing information! The best way to get detailed pricing and course information is to book a free demo session with Srikanth Sir. Would you like me to take you to the demo booking page?";
      } else if (lowerInput.includes('demo') || lowerInput.includes('trial') || lowerInput.includes('free')) {
        response = "Absolutely! We offer free demo sessions. Let me take you to our demo booking page where you can schedule a session with Srikanth Sir. 🎓";
        setTimeout(() => {
          navigate('/demo');
        }, 2000);
      } else {
        response = "I understand your question. For detailed information and personalized assistance, I'd recommend booking a free demo session with Srikanth Sir. He can answer all your questions and help you choose the right course. Would you like me to take you to the demo booking page?";
      }

      const botMessage: Message = {
        type: 'bot',
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-slate-700/50 text-slate-200 border border-slate-600'
              }`}
            >
              <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-white/70' : 'text-slate-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              conversationState === 'collecting_name'
                ? "Enter your name..."
                : conversationState === 'collecting_contact'
                ? "Enter your email or phone..."
                : "Type your message..."
            }
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none text-white placeholder-slate-400 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        
        {/* Quick Actions */}
        {conversationState === 'ready_to_help' && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setInput('How can I contact Srikanth Sir?');
                setTimeout(() => handleSubmit(), 0);
              }}
              className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-600 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              Contact Srikanth Sir
            </button>
            <button
              type="button"
              onClick={() => {
                setInput('Tell me about the courses');
                setTimeout(() => handleSubmit(), 0);
              }}
              className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-600 transition-colors"
            >
              Course Info
            </button>
            <button
              type="button"
              onClick={() => {
                setInput('I want to book a demo');
                setTimeout(() => handleSubmit(), 0);
              }}
              className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-600 transition-colors"
            >
              Book Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

