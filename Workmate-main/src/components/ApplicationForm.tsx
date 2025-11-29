'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job: any;
}

export default function ApplicationForm({ isOpen, onClose, onSuccess, job }: ApplicationFormProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: job.id,
          message: message.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      onSuccess();
      onClose();
      setMessage('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl max-w-md w-full ${
        theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className={`text-xl font-semibold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
            Apply for Job
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${theme === 'LIGHT' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Job Details */}
          <div className={`mb-6 p-4 rounded-lg ${theme === 'LIGHT' ? 'bg-gray-50' : 'bg-gray-700'}`}>
            <h3 className={`font-semibold mb-2 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
              {job.title}
            </h3>
            <p className={`text-sm mb-2 ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
              {job.description}
            </p>
            <div className={`text-sm ${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>Location: {job.location}</p>
              <p>Wage: ₹{job.wage}/day</p>
              <p>Duration: {job.duration}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                Application Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'LIGHT' 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-700 text-white'
                }`}
                placeholder="Tell the contractor why you're a good fit for this job..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-medium ${
                  theme === 'LIGHT'
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
