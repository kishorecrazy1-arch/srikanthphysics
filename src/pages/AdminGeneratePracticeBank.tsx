/**
 * Admin page to generate practice bank questions
 * Access: /admin/generate-practice-bank
 */

import { useState } from 'react';
import { PracticeBankGenerator } from '../services/practiceBankGenerator';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function AdminGeneratePracticeBank() {
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleGenerateAll = async () => {
    setGenerating(true);
    setStatus(null);

    try {
      const generator = new PracticeBankGenerator();
      await generator.generateAllPracticeBanks();
      setStatus({
        type: 'success',
        message: 'Practice bank generation completed successfully! All questions have been generated.'
      });
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: `Error: ${error.message || 'Failed to generate practice bank'}`
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generate Practice Bank Questions
          </h1>
          <p className="text-gray-600 mb-6">
            This will generate 5 questions for each topic/subtopic/difficulty combination.
            This may take several minutes depending on the number of topics.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What will be generated:</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>5 questions per topic/subtopic/difficulty combination</li>
              <li>Foundation (Level 1), Intermediate (Level 2), Advanced (Level 3)</li>
              <li>All topics and subtopics in your database</li>
              <li>Estimated: ~480 total questions (8 topics × 4 subtopics × 3 levels × 5)</li>
            </ul>
          </div>

          <button
            onClick={handleGenerateAll}
            disabled={generating}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Practice Bank Questions...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Generate All Practice Bank Questions
              </>
            )}
          </button>

          {status && (
            <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
              status.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold ${
                  status.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {status.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className={`text-sm ${
                  status.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {status.message}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Fetches all topics and subtopics from your database</li>
              <li>For each combination, checks if 5 questions already exist</li>
              <li>Generates missing questions using AI (if API key available)</li>
              <li>Stores questions with <code className="bg-gray-100 px-1 rounded">segment_type = 'practice_bank'</code></li>
              <li>Questions are filtered by difficulty level when accessed</li>
            </ol>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Note:</h3>
            <p className="text-sm text-gray-600">
              Questions are also generated automatically when you first access Practice Bank mode.
              This page is for bulk generation. Check the browser console for progress updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}












