import { useState } from 'react';
import { MessageCircle, X, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import { StudentQuestionInput } from './topics/StudentQuestionInput';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();
  const params = useParams();

  // Extract topic and subtopic from current route/page
  const getContextFromRoute = () => {
    const path = location.pathname;
    
    // Default values
    let topicName = 'Physics';
    let subtopicName: string | undefined;

    // Check if we're on a topic detail page
    if (path.includes('/ap-physics/topic/') && params.topicId) {
      topicName = 'AP Physics';
      // The actual topic name would need to be fetched from the topic ID
      // For now, we'll use a generic name
    } else if (path.includes('/course/igcse')) {
      topicName = 'IGCSE Physics';
    } else if (path.includes('/course/sat')) {
      topicName = 'SAT Physics';
    } else if (path.includes('/course/iit-jee')) {
      topicName = 'IIT-JEE Physics';
    } else if (path.includes('/course/neet')) {
      topicName = 'NEET Physics';
    } else if (path.includes('/ap-physics')) {
      topicName = 'AP Physics';
    }

    return { topicName, subtopicName };
  };

  const { topicName, subtopicName } = getContextFromRoute();

  return (
    <>
      {/* Chatbot Toggle Button - Always visible */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
          aria-label="Open chatbot"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></span>
        </button>
      )}

      {/* Chatbot Box - Right Side */}
      {isOpen && (
        <div
          className={`fixed right-6 z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-6 w-80 h-16'
              : 'bottom-6 w-96 h-[600px]'
          }`}
        >
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border-2 border-slate-700 flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">AI Physics Tutor</h3>
                  <p className="text-cyan-100 text-xs">Powered by GPT-4</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Close chatbot"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content - Only show when not minimized */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4">
                  <div className="bg-slate-700/50 rounded-lg p-3 mb-3">
                    <p className="text-slate-300 text-xs mb-2">
                      <strong className="text-cyan-400">Ask me anything</strong> about physics!
                    </p>
                    <p className="text-slate-400 text-xs">
                      I can help with explanations, formulas, problem-solving, and more.
                    </p>
                  </div>
                  
                  {/* Chat Input Component */}
                  <StudentQuestionInput 
                    topicName={topicName} 
                    subtopicName={subtopicName}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

