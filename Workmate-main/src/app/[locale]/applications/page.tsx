'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Star
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

interface Application {
  id: number;
  status: string;
  message?: string;
  createdAt: string;
  labourer: {
    id: number;
    name: string;
    skills?: string;
    experience?: number;
    location?: string;
    imageUrl?: string;
  };
  job: {
    id: number;
    title: string;
    description: string;
    wage: number;
    location: string;
    duration: string;
  };
}

export default function ApplicationsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

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
      
      if (userObj.role !== 'contractor') {
        router.push('/dashboard');
        return;
      }
      
      fetchApplications();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/');
    }
  }, [router]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications?contractor=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatus = async (applicationId: number, status: string) => {
    setUpdating(applicationId);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId,
          status
        })
      });

      if (response.ok) {
        fetchApplications(); // Refresh applications
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update application');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (!user || user.role !== 'contractor') {
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
                Job Applications
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Applications List */}
        <div className="space-y-6">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className={`h-12 w-12 mx-auto mb-4 ${theme === 'LIGHT' ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                No applications yet
              </h3>
              <p className={`${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>
                Applications for your jobs will appear here
              </p>
            </div>
          ) : (
            applications.map((application) => (
              <div key={application.id} className={`rounded-lg shadow p-6 ${
                theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={application.labourer.imageUrl || '/api/dicebear/7.x/avataaars/svg?seed=default'} 
                      alt={application.labourer.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className={`text-lg font-semibold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                        {application.labourer.name}
                      </h3>
                      <p className={`text-sm ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                        Applied for: {application.job.title}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className={`p-4 rounded-lg ${theme === 'LIGHT' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                    <h4 className={`font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                      Job Seeker Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className={`flex items-center ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                        <User className="h-4 w-4 mr-2" />
                        {application.labourer.skills || 'No skills listed'}
                      </div>
                      <div className={`flex items-center ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                        <MapPin className="h-4 w-4 mr-2" />
                        {application.labourer.location || 'Location not specified'}
                      </div>
                      {application.labourer.experience && (
                        <div className={`flex items-center ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                          <Star className="h-4 w-4 mr-2" />
                          {application.labourer.experience} years experience
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${theme === 'LIGHT' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                    <h4 className={`font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                      Job Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className={`flex items-center ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                        <MapPin className="h-4 w-4 mr-2" />
                        {application.job.location}
                      </div>
                      <div className={`flex items-center ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                        <Clock className="h-4 w-4 mr-2" />
                        {application.job.duration}
                      </div>
                      <div className={`${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                        ₹{application.job.wage}/day
                      </div>
                    </div>
                  </div>
                </div>

                {application.message && (
                  <div className={`mb-4 p-4 rounded-lg ${theme === 'LIGHT' ? 'bg-blue-50' : 'bg-blue-900'}`}>
                    <h4 className={`font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                      Application Message
                    </h4>
                    <p className={`text-sm ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {application.message}
                    </p>
                  </div>
                )}

                {application.status === 'PENDING' && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleApplicationStatus(application.id, 'REJECTED')}
                      disabled={updating === application.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {updating === application.id ? (
                        'Updating...'
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleApplicationStatus(application.id, 'ACCEPTED')}
                      disabled={updating === application.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {updating === application.id ? (
                        'Updating...'
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
