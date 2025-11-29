'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Briefcase, 
  Star, 
  Save,
  Camera,
  Edit3
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  skills?: string;
  experience?: number;
  location?: string;
  imageUrl?: string;
  theme: string;
  profileCompletion: number;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    experience: '',
    location: ''
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/');
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setFormData({
        name: userObj.name || '',
        skills: userObj.skills || '',
        experience: userObj.experience?.toString() || '',
        location: userObj.location || ''
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const calculateProfileCompletion = (data: any) => {
    let completion = 0;
    const fields = ['name', 'skills', 'experience', 'location'];
    
    fields.forEach(field => {
      if (data[field] && data[field].toString().trim()) {
        completion += 25;
      }
    });
    
    return completion;
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const profileCompletion = calculateProfileCompletion(formData);
      
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          experience: formData.experience ? parseInt(formData.experience) : null,
          profileCompletion
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update local storage
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'LIGHT' ? 'bg-gray-50' : 'bg-gray-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen ${theme === 'LIGHT' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b ${theme === 'LIGHT' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className={`p-2 rounded-lg ${theme === 'LIGHT' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className={`text-2xl font-bold ${theme === 'LIGHT' ? 'text-blue-600' : 'text-blue-400'}`}>
                Profile
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <img 
                  src={user.imageUrl || '/api/dicebear/7.x/avataaars/svg?seed=default'} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className={`font-medium ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {user.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow p-6 ${theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'}`}>
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={user.imageUrl || '/api/dicebear/7.x/avataaars/svg?seed=default'} 
                    alt={user.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className={`text-xl font-semibold mb-2 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                  {user.name}
                </h2>
                <p className={`text-sm mb-4 ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {user.role === 'contractor' ? 'Contractor' : 'Job Seeker'}
                </p>
                
                {/* Profile Completion */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-medium ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Profile Completion
                    </span>
                    <span className={`text-sm ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {user.profileCompletion}%
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${theme === 'LIGHT' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${user.profileCompletion}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg shadow p-6 ${theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'}`}>
              <h3 className={`text-lg font-semibold mb-6 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                Profile Information
              </h3>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {success}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'LIGHT' 
                          ? 'border-gray-300 bg-white text-gray-900' 
                          : 'border-gray-600 bg-gray-700 text-white'
                      }`}
                    />
                  ) : (
                    <p className={`${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                      {user.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Email
                  </label>
                  <p className={`${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Skills
                  </label>
                  {isEditing ? (
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'LIGHT' 
                          ? 'border-gray-300 bg-white text-gray-900' 
                          : 'border-gray-600 bg-gray-700 text-white'
                      }`}
                      placeholder="e.g., Plumbing, Electrical, Carpentry"
                    />
                  ) : (
                    <p className={`${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                      {user.skills || 'No skills listed'}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Experience (Years)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'LIGHT' 
                          ? 'border-gray-300 bg-white text-gray-900' 
                          : 'border-gray-600 bg-gray-700 text-white'
                      }`}
                    />
                  ) : (
                    <p className={`${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                      {user.experience ? `${user.experience} years` : 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'LIGHT' 
                          ? 'border-gray-300 bg-white text-gray-900' 
                          : 'border-gray-600 bg-gray-700 text-white'
                      }`}
                      placeholder="e.g., Mumbai, Maharashtra"
                    />
                  ) : (
                    <p className={`${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                      {user.location || 'Location not specified'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        theme === 'LIGHT'
                          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {saving ? (
                        'Saving...'
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
