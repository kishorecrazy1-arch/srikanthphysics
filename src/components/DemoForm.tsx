import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, GraduationCap, MapPin, Globe, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { demoFormSchema, type DemoFormData } from '../lib/demoSchemas';
import { submitDemoLead } from '../services/demoService';

interface DemoFormProps {
  showCalendly?: boolean;
}

export function DemoForm({ showCalendly = false }: DemoFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedBatch = (location.state as any)?.selectedBatch || localStorage.getItem('selectedBatch');
  
  const [formData, setFormData] = useState<Partial<DemoFormData>>({
    name: '',
    email: '',
    phone: '',
    grade: '',
    board: selectedBatch ? getBatchLabel(selectedBatch) : '',
    city: '',
    country: '',
    agreeToContact: false,
  });

  function getBatchLabel(batchId: string): string {
    const batchMap: Record<string, string> = {
      'foundation-batch-1': 'Foundation Batch 1',
      'foundation-batch-2': 'Foundation Batch 2',
      'foundation-batch-3': 'Foundation Batch 3'
    };
    return batchMap[batchId] || '';
  }

  useEffect(() => {
    if (selectedBatch) {
      setFormData(prev => ({ ...prev, board: getBatchLabel(selectedBatch) }));
    }
  }, [selectedBatch]);
  const [errors, setErrors] = useState<Partial<Record<keyof DemoFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof DemoFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});

    // Validate form
    const validation = demoFormSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof DemoFormData, string>> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof DemoFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitDemoLead(validation.data);

      if (result.success) {
        // Store form data in sessionStorage for success page
        sessionStorage.setItem('demoLead', JSON.stringify({
          name: validation.data.name,
          email: validation.data.email,
        }));
        
        // Redirect to success page
        navigate('/demo/success');
      } else {
        setSubmitError(result.error || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          <User className="inline w-4 h-4 mr-1" />
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your full name"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          <Mail className="inline w-4 h-4 mr-1" />
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="your@email.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          <Phone className="inline w-4 h-4 mr-1" />
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+1 234 567 8900"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.phone}
          </p>
        )}
      </div>

      {/* Grade and Board Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <GraduationCap className="inline w-4 h-4 mr-1" />
            Grade
          </label>
          <select
            value={formData.grade || ''}
            onChange={(e) => handleChange('grade', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={isSubmitting}
          >
            <option value="">Select grade</option>
            <option value="7">7th</option>
            <option value="8">8th</option>
            <option value="9">9th</option>
            <option value="10">10th</option>
            <option value="11">11th</option>
            <option value="12">12th</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <GraduationCap className="inline w-4 h-4 mr-1" />
            Courses
          </label>
          <select
            value={formData.board || ''}
            onChange={(e) => handleChange('board', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={isSubmitting || !!selectedBatch}
          >
            <option value="">Select course</option>
            {selectedBatch ? (
              // If a batch is selected, only show that batch
              <option value={getBatchLabel(selectedBatch)}>{getBatchLabel(selectedBatch)}</option>
            ) : (
              // Otherwise show all courses
              <>
                <option value="Foundation Batch 1">Foundation Batch 1</option>
                <option value="Foundation Batch 2">Foundation Batch 2</option>
                <option value="Foundation Batch 3">Foundation Batch 3</option>
                <option value="AP Physics">AP Physics</option>
                <option value="AP Chemistry">AP Chemistry</option>
                <option value="AP Mathematics">AP Mathematics</option>
                <option value="AP Biology">AP Biology</option>
                <option value="AP Computer Science">AP Computer Science</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="IB">IB (International Baccalaureate)</option>
                <option value="IGCSE">IGCSE</option>
                <option value="State Board">State Board</option>
                <option value="SAT">SAT</option>
                <option value="ACT">ACT</option>
                <option value="IIT JEE">IIT JEE</option>
                <option value="NEET">NEET</option>
                <option value="Other">Other</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* City and Country Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <MapPin className="inline w-4 h-4 mr-1" />
            City
          </label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Your city"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <Globe className="inline w-4 h-4 mr-1" />
            Country
          </label>
          <input
            type="text"
            value={formData.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Your country"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToContact || false}
            onChange={(e) => handleChange('agreeToContact', e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-700">
            I agree to be contacted via WhatsApp/Email for the free demo and course information{' '}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.agreeToContact && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.agreeToContact}
          </p>
        )}
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <p className="text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {submitError}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Submit
          </>
        )}
      </button>
    </form>
  );
}

