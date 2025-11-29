'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingJob?: any;
}

const JOB_CATEGORIES = [
  'HOUSEKEEPING',
  'PLUMBING', 
  'ELECTRICAL',
  'CARPENTRY',
  'PAINTING',
  'GARDENING',
  'MASONRY',
  'COOKING',
  'CHILDCARE',
  'DRIVING',
  'SECURITY',
  'NURSING'
];

const JOB_DURATIONS = [
  '1 day',
  '2-3 days',
  '1 week',
  '2 weeks',
  '1 month',
  'Ongoing'
];

export default function JobForm({ isOpen, onClose, onSuccess, editingJob }: JobFormProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: editingJob?.title || '',
    description: editingJob?.description || '',
    skill: editingJob?.skill || '',
    category: editingJob?.category || 'HOUSEKEEPING',
    wage: editingJob?.wage || '',
    location: editingJob?.location || '',
    duration: editingJob?.duration || '1 day',
    tags: editingJob?.tags || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const endpoint = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          wage: parseFloat(formData.wage)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className={`text-xl font-semibold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
            {editingJob ? 'Edit Job' : 'Post New Job'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${theme === 'LIGHT' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'LIGHT' 
                  ? 'border-gray-300 bg-white text-gray-900' 
                  : 'border-gray-600 bg-gray-700 text-white'
              }`}
              placeholder="e.g., House Cleaning Service"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'LIGHT' 
                  ? 'border-gray-300 bg-white text-gray-900' 
                  : 'border-gray-600 bg-gray-700 text-white'
              }`}
              placeholder="Describe the job requirements and details..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'LIGHT' 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-700 text-white'
                }`}
              >
                {JOB_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                Required Skills *
              </label>
              <input
                type="text"
                name="skill"
                value={formData.skill}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'LIGHT' 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-700 text-white'
                }`}
                placeholder="e.g., Cleaning, Organization"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                Daily Wage (₹) *
              </label>
              <input
                type="number"
                name="wage"
                value={formData.wage}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'LIGHT' 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-700 text-white'
                }`}
                placeholder="500"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'LIGHT' 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-700 text-white'
                }`}
              >
                {JOB_DURATIONS.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'LIGHT' 
                  ? 'border-gray-300 bg-white text-gray-900' 
                  : 'border-gray-600 bg-gray-700 text-white'
              }`}
              placeholder="e.g., Mumbai, Maharashtra"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
              Tags (Optional)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'LIGHT' 
                  ? 'border-gray-300 bg-white text-gray-900' 
                  : 'border-gray-600 bg-gray-700 text-white'
              }`}
              placeholder="e.g., urgent, flexible hours, experienced"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : (editingJob ? 'Update Job' : 'Post Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
