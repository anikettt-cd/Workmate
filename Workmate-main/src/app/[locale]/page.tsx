'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Eye, EyeOff, User, Mail, Lock, Briefcase, Hammer } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { theme } = useTheme();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'labourer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`min-h-screen ${theme === 'LIGHT' ? 'bg-gradient-to-br from-blue-50 to-yellow-50' : 'bg-gradient-to-br from-gray-900 to-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 ${theme === 'LIGHT' ? 'text-blue-600' : 'text-blue-400'}`}>
            Welcome to WorkMate
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
            AI-powered hiring platform connecting skilled contractors with reliable job seekers
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          {/* Form Toggle */}
          <div className={`rounded-lg shadow-lg p-8 ${theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="flex mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-colors ${
                  isLogin
                    ? 'bg-blue-600 text-white'
                    : theme === 'LIGHT' 
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-colors ${
                  !isLogin
                    ? 'bg-blue-600 text-white'
                    : theme === 'LIGHT' 
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'LIGHT' 
                          ? 'border-gray-300 bg-white text-gray-900' 
                          : 'border-gray-600 bg-gray-700 text-white'
                      }`}
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'LIGHT' 
                        ? 'border-gray-300 bg-white text-gray-900' 
                        : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'LIGHT' 
                        ? 'border-gray-300 bg-white text-gray-900' 
                        : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'LIGHT' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      theme === 'LIGHT' 
                        ? 'border-gray-300 hover:bg-gray-50' 
                        : 'border-gray-600 hover:bg-gray-700'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="labourer"
                        checked={formData.role === 'labourer'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <Hammer className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className={`text-sm ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>Job Seeker</span>
                    </label>
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      theme === 'LIGHT' 
                        ? 'border-gray-300 hover:bg-gray-50' 
                        : 'border-gray-600 hover:bg-gray-700'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="contractor"
                        checked={formData.role === 'contractor'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                      <span className={`text-sm ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>Contractor</span>
                    </label>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>
            </form>

            {/* Toggle Link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'LIGHT' ? 'text-gray-800' : 'text-white'}`}>Smart Job Matching</h3>
            <p className={`${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>AI-powered recommendations based on skills and experience</p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hammer className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'LIGHT' ? 'text-gray-800' : 'text-white'}`}>Verified Job Seekers</h3>
            <p className={`${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>Trusted workers with verified skills and ratings</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'LIGHT' ? 'text-gray-800' : 'text-white'}`}>Real-time Communication</h3>
            <p className={`${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>Instant chat and notifications for seamless coordination</p>
          </div>
        </div>
      </div>
    </div>
  );
}
