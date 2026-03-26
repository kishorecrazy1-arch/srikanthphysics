import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Sparkles } from 'lucide-react';

export function FoundationHomework() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          to="/foundation-dashboard"
          className="inline-flex items-center gap-2 text-cyan-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Foundation Dashboard
        </Link>

        <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-6 md:p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <FileText className="w-8 h-8" />
                Foundation Homework
              </h1>
              <p className="text-orange-50 text-lg">
                Instructor-assigned homework with AI-powered practice
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[180px]">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm opacity-90">Active Assignments</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Upload className="w-6 h-6 text-orange-400" />
            Upload New Homework
          </h2>
          <p className="text-slate-300 mb-4">
            Upload a PDF homework file to create AI-generated Foundation practice questions.
          </p>

          <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 bg-slate-900/50">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-200 mb-1">
                  File Upload Coming Soon
                </p>
                <p className="text-sm text-slate-400">
                  This follows the same AP homework section behavior. Attachment processing will be enabled next.
                </p>
              </div>
              <button
                disabled
                className="px-6 py-2 bg-slate-700 text-slate-400 rounded-lg font-semibold cursor-not-allowed"
              >
                Upload Disabled
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold mb-2">No Homework Assigned Yet</h3>
          <p className="text-slate-300 mb-6">
            Once homework attachments are enabled, uploaded files will appear here with AI question generation tools.
          </p>
          <Link
            to="/foundation-dashboard/practice?mode=homework"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            Start Homework Practice
          </Link>
        </div>
      </div>
    </div>
  );
}
