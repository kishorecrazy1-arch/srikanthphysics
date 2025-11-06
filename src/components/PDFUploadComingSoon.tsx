/**
 * PDF Upload Feature - Coming Soon
 * Placeholder component for future PDF question upload feature
 */

import { FileText, Sparkles } from 'lucide-react';

export function PDFUploadComingSoon() {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 p-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Upload PDF Questions</h4>
          <p className="text-sm text-slate-400">Extract questions from PDFs</p>
        </div>
      </div>
      <p className="text-slate-300 text-sm mb-4">
        Upload PDF files with physics questions and automatically extract them for practice.
      </p>
      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-300 font-semibold">Coming Soon</span>
        </div>
        <p className="text-xs text-yellow-200">
          PDF upload feature will be available in a future update
        </p>
      </div>
    </div>
  );
}

