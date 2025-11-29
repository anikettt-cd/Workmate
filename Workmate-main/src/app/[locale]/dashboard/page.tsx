'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Hammer, 
  User, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import JobForm from '@/components/JobForm';
import ApplicationForm from '@/components/ApplicationForm';
import AIMiddleman from '@/components/AIMiddleman';
import ChatSystem from '@/components/ChatSystem';
import { showNotification } from '@/components/NotificationSystem';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  imageUrl?: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  skill: string;
  category?: string;
  wage: number;
  location: string;
  duration: string;
  imageUrl?: string;
  createdAt?: string;
  contractor?: {
    name: string;
    imageUrl?: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterWage, setFilterWage] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatUser, setChatUser] = useState(null);

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
      fetchJobs();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/');
    }
  }, [router]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleJobFormSuccess = () => {
    fetchJobs(); // Refresh jobs list
    setEditingJob(null);
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchJobs(); // Refresh jobs list
        showNotification({
          type: 'success',
          title: 'Job Deleted',
          message: 'The job has been successfully deleted.',
          duration: 3000
        });
      } else {
        const data = await response.json();
        showNotification({
          type: 'error',
          title: 'Error',
          message: data.error || 'Failed to delete job',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete job. Please try again.',
        duration: 5000
      });
    }
  };

  const handleApplyToJob = (job: any) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    showNotification({
      type: 'success',
      title: 'Application Submitted!',
      message: 'Your application has been sent successfully. The contractor will review it soon.',
      duration: 5000
    });
  };

  const handleAIRecommendationClick = (recommendation: any) => {
    // If it's a job recommendation, scroll to it or highlight it
    if (recommendation.id) {
      const jobElement = document.getElementById(`job-${recommendation.id}`);
      if (jobElement) {
        jobElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        jobElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
        setTimeout(() => {
          jobElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
        }, 3000);
      }
    }
  };

  const handleStartChat = (job: any) => {
    if (user && user.role === 'labourer') {
      // Job seeker wants to chat with contractor
      setChatUser(job.contractor);
    } else {
      // Contractor wants to chat with job seekers who applied
      // For now, we'll show a message to view applications
      showNotification({
        type: 'info',
        title: 'Chat with Applicants',
        message: 'View applications to start chatting with labourers who applied to your jobs.',
        duration: 5000
      });
    }
    setSelectedJob(job);
    setShowChat(true);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || job.category === filterCategory;
    const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesWage = !filterWage || job.wage >= parseInt(filterWage);
    return matchesSearch && matchesCategory && matchesLocation && matchesWage;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'oldest':
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case 'wage-high':
        return b.wage - a.wage;
      case 'wage-low':
        return a.wage - b.wage;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
            <div className="flex items-center">
              <h1 className={`text-2xl font-bold ${theme === 'LIGHT' ? 'text-blue-600' : 'text-blue-400'}`}>WorkMate</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user.role === 'contractor' && (
                <button
                  onClick={() => router.push('/applications')}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'LIGHT'
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-blue-900 text-blue-300 hover:bg-blue-800'
                  }`}
                >
                  Applications
                </button>
              )}
              <button
                onClick={() => router.push('/profile')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'LIGHT'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Profile
              </button>
              <div className="flex items-center space-x-2">
                <img 
                  src={user.imageUrl || '/api/dicebear/7.x/avataaars/svg?seed=default'} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className={`font-medium ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className={`${theme === 'LIGHT' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
            Welcome, {user.name}!
          </h2>
          <p className={`${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
            {user.role === 'contractor' 
              ? 'Manage your job postings and applications'
              : 'Find and apply for jobs that match your skills'
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-lg shadow p-6 ${theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>Total Jobs</p>
                <p className={`text-2xl font-bold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>{jobs.length}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow p-6 ${theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Hammer className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>Active Jobs</p>
                <p className={`text-2xl font-bold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                  {jobs.filter(job => job.duration !== 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow p-6 ${theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>Messages</p>
                <p className={`text-2xl font-bold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>0</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow p-6 ${theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>Notifications</p>
                <p className={`text-2xl font-bold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={`rounded-lg shadow mb-8 p-6 ${theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'}`}>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search jobs, skills, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'LIGHT' 
                        ? 'border-gray-300 bg-white text-gray-900' 
                        : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                  />
                </div>
              </div>
              
              {user.role === 'contractor' && (
                <button 
                  onClick={() => setShowJobForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Post Job
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'LIGHT' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                >
                  <option value="">All Categories</option>
                  <option value="HOUSEKEEPING">Housekeeping</option>
                  <option value="PLUMBING">Plumbing</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="CARPENTRY">Carpentry</option>
                  <option value="PAINTING">Painting</option>
                  <option value="GARDENING">Gardening</option>
                  <option value="MASONRY">Masonry</option>
                  <option value="COOKING">Cooking</option>
                  <option value="CHILDCARE">Childcare</option>
                  <option value="DRIVING">Driving</option>
                  <option value="SECURITY">Security</option>
                  <option value="NURSING">Nursing</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'LIGHT' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Min Wage (₹)
                </label>
                <input
                  type="number"
                  placeholder="500"
                  value={filterWage}
                  onChange={(e) => setFilterWage(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'LIGHT' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'LIGHT' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="wage-high">Highest Wage</option>
                  <option value="wage-low">Lowest Wage</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(filterCategory || filterLocation || filterWage || searchTerm) && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('');
                    setFilterLocation('');
                    setFilterWage('');
                    setSortBy('newest');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'LIGHT'
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Middleman */}
        <div className="mb-8">
          <AIMiddleman 
            user={user} 
            jobs={jobs} 
            onRecommendationClick={handleAIRecommendationClick}
          />
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} id={`job-${job.id}`} className={`rounded-lg shadow hover:shadow-lg transition-shadow ${
              theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'
            }`}>
              <img 
                src={job.imageUrl || '/api/dicebear/7.x/icons/svg?seed=job&icon=briefcase&backgroundColor=3B82F6&iconColor=FACC15'} 
                alt={job.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              
              <div className="p-6">
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                  {job.title}
                </h3>
                <p className={`text-sm mb-4 line-clamp-2 ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {job.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className={`flex items-center text-sm ${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Briefcase className="h-4 w-4 mr-2" />
                    {job.category ? job.category.charAt(0) + job.category.slice(1).toLowerCase() : 'General'}
                  </div>
                  <div className={`flex items-center text-sm ${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Hammer className="h-4 w-4 mr-2" />
                    {job.skill}
                  </div>
                  <div className={`flex items-center text-sm ${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className={`flex items-center text-sm ${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Clock className="h-4 w-4 mr-2" />
                    {job.duration}
                  </div>
                  <div className={`flex items-center text-sm font-semibold ${theme === 'LIGHT' ? 'text-green-600' : 'text-green-400'}`}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    ₹{job.wage}/day
                  </div>
                </div>

                {user.role === 'labourer' && (
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleApplyToJob(job)}
                      className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                    >
                      Apply
                    </button>
                    <button 
                      onClick={() => handleStartChat(job)}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </button>
                  </div>
                )}

                {user.role === 'contractor' && (
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                      View Details
                    </button>
                    <button 
                      onClick={() => handleEditJob(job)}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job.id)}
                      className="bg-red-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className={`h-12 w-12 mx-auto mb-4 ${theme === 'LIGHT' ? 'text-gray-400' : 'text-gray-600'}`} />
            <h3 className={`text-lg font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>No jobs found</h3>
            <p className={`${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      <JobForm
        isOpen={showJobForm}
        onClose={() => {
          setShowJobForm(false);
          setEditingJob(null);
        }}
        onSuccess={handleJobFormSuccess}
        editingJob={editingJob}
      />

      {/* Application Form Modal */}
      <ApplicationForm
        isOpen={showApplicationForm}
        onClose={() => {
          setShowApplicationForm(false);
          setSelectedJob(null);
        }}
        onSuccess={handleApplicationSuccess}
        job={selectedJob}
      />

      {/* Chat System */}
      <ChatSystem
        user={user}
        isOpen={showChat}
        onClose={() => {
          setShowChat(false);
          setChatUser(null);
          setSelectedJob(null);
        }}
        selectedJob={selectedJob}
        selectedUser={chatUser}
      />
    </div>
  );
}
