import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseNavigation } from '../components/CourseNavigation';
import { Clock, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

// Foundation batch selection – 1 month duration
interface FoundationBatch {
  id: string;
  name: string;
  timing: string;
  days: string;
  duration: string;
  seats: string;
  status: 'available' | 'full' | 'upcoming';
}

export function FoundationSelection() {
  const navigate = useNavigate();
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const batches: FoundationBatch[] = [
    {
      id: 'foundation-batch-1',
      name: 'Foundation Batch 1',
      timing: '7:00 PM IST',
      days: 'Commencing from 16th March, 2026',
      duration: '1 month',
      seats: 'Limited seats available',
      status: 'available'
    },
    {
      id: 'foundation-batch-2',
      name: 'Foundation Batch 2',
      timing: '6:00 PM IST',
      days: 'Commencing from 6th April, 2026',
      duration: '1 month',
      seats: 'Limited seats available',
      status: 'available'
    },
    {
      id: 'foundation-batch-3',
      name: 'Foundation Batch 3',
      timing: '7:00 PM IST',
      days: 'Commencing from 20th April, 2026',
      duration: '1 month',
      seats: 'Limited seats available',
      status: 'available'
    }
  ];

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatch(batchId);
  };

  const handleContinue = () => {
    if (selectedBatch) {
      localStorage.setItem('selectedBatch', selectedBatch);
      navigate('/demo', { state: { selectedBatch } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <CourseNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Foundation Course - Select Your Batch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the batch timing that works best for you
          </p>
        </div>

        {/* Batch Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {batches.map((batch) => (
            <div
              key={batch.id}
              onClick={() => handleBatchSelect(batch.id)}
              className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all border-2 ${
                selectedBatch === batch.id
                  ? 'border-blue-600 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{batch.name}</h3>
                {selectedBatch === batch.id && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">{batch.timing}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>{batch.days}</span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Duration:</span> {batch.duration}
                  </p>
                  <p className="text-sm text-blue-600 font-semibold">{batch.seats}</p>
                </div>
              </div>

              {batch.status === 'full' && (
                <div className="mt-4 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold text-center">
                  Batch Full
                </div>
              )}
              {batch.status === 'upcoming' && (
                <div className="mt-4 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-semibold text-center">
                  Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedBatch}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 mx-auto"
          >
            Continue to Registration
            <ArrowRight className="w-5 h-5" />
          </button>
          {!selectedBatch && (
            <p className="text-sm text-gray-500 mt-2">Please select a batch to continue</p>
          )}
        </div>
      </div>
    </div>
  );
}
