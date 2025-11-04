import { useState } from 'react';
import { Send, Sparkles, BookOpen, Image as ImageIcon, Lightbulb, TrendingUp } from 'lucide-react';

interface StudentQuestionInputProps {
  topicName: string;
  subtopicName?: string;
  onSubmit?: (question: string) => void;
}

export function StudentQuestionInput({ topicName, subtopicName, onSubmit }: StudentQuestionInputProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    explanation: string;
    formulas: string[];
    diagram: string;
    keyPoints: string[];
    relatedConcepts: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);

    try {
      // Call OpenAI API to generate answer with formulas and diagrams
      // Note: You'll need to set up your OpenAI API key in environment variables
      const context = subtopicName 
        ? `${topicName} - ${subtopicName}: ${question}`
        : `${topicName}: ${question}`;

      // TODO: Replace with actual OpenAI API call
      // For now, using a mock response that includes formulas and diagrams
      // In production, this should call: https://api.openai.com/v1/chat/completions
      
      const aiResponse = await generateAIResponse(context, question);
      
      setResponse({
        explanation: aiResponse.explanation,
        formulas: aiResponse.formulas,
        diagram: aiResponse.diagram,
        keyPoints: aiResponse.keyPoints,
        relatedConcepts: aiResponse.relatedConcepts
      });
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fallback response
      setResponse({
        explanation: `Let me explain this ${subtopicName || topicName} concept:\n\n${question}\n\nThis question involves understanding the fundamental principles. Here's a detailed breakdown:\n\n1. First, identify the given information and what you need to find.\n2. Apply the relevant physics formulas and laws.\n3. Solve step by step, showing all work.\n4. Verify your answer makes physical sense.`,
        formulas: [
          'v = u + at',
          's = ut + ½at²',
          'v² = u² + 2as'
        ],
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
    } finally {
      setLoading(false);
    }

    if (onSubmit) {
      onSubmit(question);
    }
  };

  // AI Response Generation Function
  const generateAIResponse = async (context: string, question: string) => {
    // This is a placeholder - replace with actual OpenAI API call
    // Example implementation:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a physics tutor. Answer questions about ${context} with detailed explanations, formulas, and suggest relevant diagrams. Always include mathematical formulas in LaTeX format.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    // Parse the response to extract formulas, explanation, etc.
    */

    // Mock response for now
    return {
      explanation: `**Detailed Explanation for ${context}:**\n\n${question}\n\nThis is a comprehensive step-by-step explanation:\n\n**Step 1:** Identify the given values and what needs to be found.\n\n**Step 2:** Apply the relevant physics principles.\n\n**Step 3:** Use the appropriate formulas to solve.\n\n**Step 4:** Verify the solution makes physical sense.`,
      formulas: [
        'v = u + at (First equation of motion)',
        's = ut + ½at² (Second equation of motion)',
        'v² = u² + 2as (Third equation of motion)',
        'F = ma (Newton\'s Second Law)'
      ],
      diagram: 'https://images.pexels.com/photos/8327999/pexels-photo-8327999.jpeg?auto=compress&cs=tinysrgb&w=800',
      keyPoints: [
        'Identify all given values and units',
        'Select appropriate formulas',
        'Substitute values correctly',
        'Check units and reasonableness of answer'
      ],
      relatedConcepts: [
        'Kinematic Equations',
        'Newton\'s Laws',
        'Motion Graphs',
        'Vector Components'
      ]
    };
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask a question about ${subtopicName || topicName}...`}
            className="w-full px-4 py-2 pr-12 bg-slate-900/50 border-2 border-slate-600 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none text-white placeholder-slate-400 text-sm"
            rows={2}
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {response && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h4 className="text-lg font-bold text-white">Detailed Explanation</h4>
            </div>
            <p className="text-slate-200 whitespace-pre-line leading-relaxed text-sm">
              {response.explanation}
            </p>
          </div>

          {response.formulas && response.formulas.length > 0 && (
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <h4 className="text-lg font-bold text-white">Relevant Formulas</h4>
              </div>
              <div className="space-y-2">
                {response.formulas.map((formula, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                    <code className="text-cyan-300 text-sm font-mono">{formula}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600/50 to-blue-600/50 p-3">
              <div className="flex items-center gap-2 text-white">
                <ImageIcon className="w-5 h-5" />
                <h4 className="text-base font-bold">Visual Diagram</h4>
              </div>
            </div>
            <div className="p-3">
              <img
                src={response.diagram}
                alt="Physics diagram"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-xs text-slate-400 mt-2 text-center italic">
                Diagram illustrating the concept
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <h4 className="text-base font-bold text-white">Key Points</h4>
              </div>
              <ul className="space-y-1.5">
                {response.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-200 text-sm">
                    <span className="text-blue-400 font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-lg p-4 border border-violet-500/30">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                <h4 className="text-base font-bold text-white">Related Concepts</h4>
              </div>
              <ul className="space-y-1.5">
                {response.relatedConcepts.map((concept, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-200 text-sm">
                    <span className="text-violet-400 font-bold mt-0.5">→</span>
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
            className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all text-sm"
          >
            Ask Another Question
          </button>
        </div>
      )}
    </div>
  );
}
