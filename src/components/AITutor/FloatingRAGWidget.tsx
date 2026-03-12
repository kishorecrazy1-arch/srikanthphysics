import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RAGChatbot } from './RAGChatbot';
import './FloatingRAGWidget.css';

export const FloatingRAGWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide floating widget on landing page since it has its own embedded chatbot
  if (location.pathname === '/') {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <button 
        className="floating-chat-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Tutor"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Widget Overlay */}
      {isOpen && (
        <div className="chat-widget-overlay">
          <div className="chat-widget-container">
            <RAGChatbot />
          </div>
        </div>
      )}
    </>
  );
};
