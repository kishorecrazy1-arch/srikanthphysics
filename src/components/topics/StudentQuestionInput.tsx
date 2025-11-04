import { useState } from 'react';
import { Send, Sparkles, BookOpen, Image as ImageIcon, Lightbulb, TrendingUp } from 'lucide-react';

interface StudentQuestionInputProps {
  topicName: string;
  onSubmit?: (question: string) => void;
}

export function StudentQuestionInput({ topicName, onSubmit }: StudentQuestionInputProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    explanation: string;
    diagram: string;
    keyPoints: string[];
    relatedConcepts: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);

    setTimeout(() => {
      setResponse({
        explanation: `Let me explain this ${topicName} concept:\n\nThis question involves understanding the fundamental principles. Here's a detailed breakdown:\n\n1. First, identify the given information and what you need to find.\n2. Apply the relevant physics formulas and laws.\n3. Solve step by step, showing all work.\n4. Verify your answer makes physical sense.`,
        diagram: 'https://images.pexels.com/photos/8327999/pexels-photo-8327999.jpeg?auto=compress&cs=tinysrgb&w=800',
        keyPoints: [
          'Understand the physical situation described',
          'Identify relevant equations and principles',
          'Use consistent units throughout',
          'Check if the answer is reasonable'
        ],
        relatedConcepts: [
          'Newton\'s Laws of Motion',
          'Kinematic Equations',
          'Conservation of Energy',
          'Work-Energy Theorem'
        ]
      });
      setLoading(false);
    }, 1500);

    if (onSubmit) {
      onSubmit(question);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Ask Your Question</h3>
          <p className="text-gray-600">Get detailed explanations with diagrams</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Type your ${topicName} question here... For example: "A car accelerates from 10 m/s to 30 m/s in 5 seconds. What is the acceleration?"`}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
            rows={4}
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {response && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-teal-600" />
              <h4 className="text-xl font-bold text-gray-900">Detailed Explanation</h4>
            </div>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {response.explanation}
            </p>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
              <div className="flex items-center gap-2 text-white">
                <ImageIcon className="w-6 h-6" />
                <h4 className="text-xl font-bold">Visual Diagram</h4>
              </div>
            </div>
            <div className="p-4">
              <img
                src={response.diagram}
                alt="Physics diagram"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-600 mt-3 text-center italic">
                Diagram illustrating the concept
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <h4 className="text-lg font-bold text-gray-900">Key Points</h4>
              </div>
              <ul className="space-y-2">
                {response.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border-2 border-violet-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-violet-600" />
                <h4 className="text-lg font-bold text-gray-900">Related Concepts</h4>
              </div>
              <ul className="space-y-2">
                {response.relatedConcepts.map((concept, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-violet-600 font-bold mt-0.5">→</span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => {
              setQuestion('');
              setResponse(null);
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all"
          >
            Ask Another Question
          </button>
        </div>
      )}

      {!response && (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">How it works:</h4>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">1.</span>
              <span>Type your physics question in the box above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">2.</span>
              <span>Get a detailed step-by-step explanation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">3.</span>
              <span>View relevant diagrams and visual aids</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">4.</span>
              <span>Learn key points and related concepts</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
