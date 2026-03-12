import React, { useState, useRef, useEffect } from 'react';
import { ragService, RAGAnswer } from '../../services/ragService';
import './RAGChatbot.css';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  sources?: RAGAnswer['sources'];
  timestamp: Date;
}

export const RAGChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const questionText = input;
    setInput('');
    setIsLoading(true);

    try {
      // Try Anthropic first
      let response;
      try {
        response = await ragService.askQuestion({
          question: questionText,
          llm_provider: 'anthropic',
          num_sources: 5,
        });
      } catch (anthropicError: any) {
        // If Anthropic fails due to credits/quota, fallback to OpenAI
        console.warn('Anthropic failed, trying OpenAI:', anthropicError);
        response = await ragService.askQuestion({
          question: questionText,
          llm_provider: 'openai',
          num_sources: 5,
        });
      }

      const assistantMessage: Message = {
        type: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting answer:', error);
      const errorMessage: Message = {
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the RAG service is running on http://localhost:8000 and that you have API credits available. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What is Newton's First Law?",
    "Explain Ohm's Law with examples",
    "What is the difference between AC and DC?",
    "Derive the equation for kinetic energy",
  ];

  return (
    <div className="rag-chatbot">
      <div className="chat-header">
        <h3>🤖 AI Physics Tutor</h3>
        <p>Powered by NCERT Knowledge Base</p>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h4>👋 Hi! I'm your AI Physics Tutor</h4>
            <p>Ask me anything about AP Physics or NCERT curriculum!</p>
            
            <div className="quick-questions">
              <p>Try these questions:</p>
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  className="quick-question-btn"
                  onClick={() => setInput(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content}
            </div>
            
            {message.sources && message.sources.length > 0 && (
              <div className="message-sources">
                <button
                  className="show-sources-btn"
                  onClick={() => setShowSources(!showSources)}
                >
                  📚 {message.sources.length} sources
                </button>
                
                {showSources && (
                  <div className="sources-list">
                    {message.sources.map((source, idx) => (
                      <div key={idx} className="source-item">
                        <p className="source-metadata">
                          {source.source} - Page {source.page}
                        </p>
                        <p className="source-content">{source.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a physics question..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
};
