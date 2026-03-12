import { useState, useEffect } from 'react';
import { Upload, FileText, Calendar, User, Download, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import type { Topic, Homework } from '../../types/topics';

interface HomeworkSectionProps {
  topic: Topic;
  onProgressUpdate: () => void;
}

export function HomeworkSection({ topic, onProgressUpdate }: HomeworkSectionProps) {
  const user = useAuthStore((state) => state.user);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPDF, setUploadingPDF] = useState(false);

  useEffect(() => {
    loadHomework();
  }, [topic.id]);

  const loadHomework = async () => {
    try {
      const { data, error } = await supabase
        .from('homework')
        .select('*')
        .eq('topic_id', topic.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHomework(data || []);
    } catch (error) {
      console.error('Error loading homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploadingPDF(true);

    try {
      const fileName = `homework_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('homework-pdfs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('homework-pdfs')
        .getPublicUrl(fileName);

      const { data: newHomework, error: insertError } = await supabase
        .from('homework')
        .insert({
          topic_id: topic.id,
          title: file.name.replace('.pdf', ''),
          uploaded_by: user.id,
          pdf_url: publicUrl,
          status: 'active'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (newHomework) {
        setHomework([newHomework, ...homework]);
      }

      alert('Homework uploaded successfully!');
    } catch (error) {
      console.error('Error uploading homework:', error);
      alert('Failed to upload homework. Please try again.');
    } finally {
      setUploadingPDF(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'active': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading homework...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-6 md:p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Homework
            </h2>
            <p className="text-orange-50 text-lg">
              Instructor-assigned homework with AI-powered practice
            </p>
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[180px]">
            <div className="text-2xl font-bold">{homework.filter(h => h.status === 'active').length}</div>
            <div className="text-sm opacity-90">Active Assignments</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border-2 border-orange-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Upload className="w-6 h-6 text-orange-600" />
          Upload New Homework
        </h3>
        <p className="text-gray-600 mb-4">
          Upload a PDF homework file to create AI-generated practice questions
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-600 mb-1">
                File Upload Coming Soon
              </p>
              <p className="text-sm text-gray-500">
                PDF upload and AI question generation feature is under development
              </p>
            </div>
            <button
              disabled
              className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
            >
              Upload Disabled
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {homework.length > 0 ? 'Your Homework Assignments' : 'No Homework Yet'}
        </h3>

        {homework.length > 0 ? (
          <div className="grid gap-4">
            {homework.map((hw) => (
              <div
                key={hw.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-2 border-gray-100 hover:border-orange-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{hw.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(hw.created_at).toLocaleDateString()}
                          </span>
                          {hw.due_date && (
                            <span className="flex items-center gap-1 text-orange-600 font-semibold">
                              Due: {new Date(hw.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(hw.status)}`}>
                        {hw.status.charAt(0).toUpperCase() + hw.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hw.pdf_url && (
                        <a
                          href={hw.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-medium">Download PDF</span>
                        </a>
                      )}
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Generate AI Questions</span>
                      </button>
                    </div>
                  </div>
                </div>

                {hw.extracted_text && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Extracted Content:</h5>
                    <p className="text-sm text-gray-700 line-clamp-3">{hw.extracted_text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Homework Assigned Yet</h3>
            <p className="text-gray-600 mb-6">
              Upload a homework PDF to get started with AI-generated practice questions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
