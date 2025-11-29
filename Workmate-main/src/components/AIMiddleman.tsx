'use client';

import { useState, useEffect } from 'react';
import { Bot, Sparkles, TrendingUp, Users, MapPin, Star, MessageCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface AIMiddlemanProps {
  user: any;
  jobs: any[];
  onRecommendationClick: (job: any) => void;
}

export default function AIMiddleman({ user, jobs, onRecommendationClick }: AIMiddlemanProps) {
  const { theme } = useTheme();
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    if (user && jobs.length > 0) {
      generateAIInsights();
    }
  }, [user, jobs]);

  const generateAIInsights = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: user.role === 'labourer' ? 'jobs' : 'labourers',
          userId: user.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarketInsights = () => {
    const totalJobs = jobs.length;
    const avgWage = totalJobs > 0 ? jobs.reduce((sum, job) => sum + job.wage, 0) / totalJobs : 0;
    const topCategories = jobs.reduce((acc, job) => {
      const category = job.category || 'General';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as any);
    
    const mostPopularCategory = Object.entries(topCategories)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];

    return {
      totalJobs,
      avgWage: Math.round(avgWage),
      mostPopularCategory: mostPopularCategory ? String(mostPopularCategory[0]) : 'General',
      categoryCount: mostPopularCategory ? Number(mostPopularCategory[1]) : 0
    };
  };

  const getPersonalizedTips = () => {
    if (user.role === 'labourer') {
      return [
        "Complete your profile to increase visibility by 40%",
        "Add specific skills to get better job matches",
        "Apply to jobs within 24 hours for higher success rates",
        "Include a personalized message when applying"
      ];
    } else {
      return [
        "Post jobs with detailed descriptions for better matches",
        "Set competitive wages to attract quality workers",
        "Respond to applications within 48 hours",
        "Use specific skill requirements for better filtering"
      ];
    }
  };

  const marketInsights = getMarketInsights();
  const tips = getPersonalizedTips();

  return (
    <div className={`rounded-lg shadow-lg p-6 ${theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="flex items-center mb-6">
        <div className="p-2 bg-blue-100 rounded-lg mr-3">
          <Bot className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
            AI Assistant
          </h3>
          <p className={`text-sm ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
            Your intelligent job matching companion
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'insights'
              ? 'bg-blue-600 text-white'
              : theme === 'LIGHT'
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Market Insights
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'recommendations'
              ? 'bg-blue-600 text-white'
              : theme === 'LIGHT'
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Sparkles className="h-4 w-4 inline mr-2" />
          Recommendations
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'tips'
              ? 'bg-blue-600 text-white'
              : theme === 'LIGHT'
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <MessageCircle className="h-4 w-4 inline mr-2" />
          Tips
        </button>
      </div>

      {/* Content */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <h4 className={`font-semibold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
            Market Insights
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${theme === 'LIGHT' ? 'bg-blue-50' : 'bg-blue-900'}`}>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <span className={`text-sm font-medium ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Total Jobs
                </span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                {marketInsights.totalJobs}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${theme === 'LIGHT' ? 'bg-green-50' : 'bg-green-900'}`}>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-green-600 mr-2" />
                <span className={`text-sm font-medium ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Avg Wage
                </span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                ₹{marketInsights.avgWage}/day
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'LIGHT' ? 'bg-yellow-50' : 'bg-yellow-900'}`}>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-yellow-600 mr-2" />
              <span className={`text-sm font-medium ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                Most Popular Category
              </span>
            </div>
            <p className={`text-lg font-semibold mt-1 ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
              {String(marketInsights.mostPopularCategory)} ({marketInsights.categoryCount} jobs)
            </p>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <h4 className={`font-semibold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
            AI Recommendations
          </h4>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-2 text-sm ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                Analyzing your profile...
              </p>
            </div>
          ) : aiInsights?.recommendations?.length > 0 ? (
            <div className="space-y-3">
              {aiInsights.recommendations.slice(0, 3).map((rec: any, index: number) => (
                <div
                  key={index}
                  onClick={() => onRecommendationClick(rec)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    theme === 'LIGHT' 
                      ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50' 
                      : 'border-gray-600 hover:border-blue-500 hover:bg-blue-900'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className={`font-medium ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                        {rec.title || rec.name}
                      </h5>
                      <p className={`text-sm mt-1 ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {rec.description || rec.skills}
                      </p>
                      <p className={`text-xs mt-2 ${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Match Score: {Math.round(rec.matchScore * 100)}%
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.matchScore > 0.8 ? 'bg-green-100 text-green-800' :
                        rec.matchScore > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Math.round(rec.matchScore * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recommendations available yet.</p>
              <p className="text-sm mt-1">Complete your profile for better matches!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="space-y-4">
          <h4 className={`font-semibold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
            Personalized Tips
          </h4>
          
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div key={index} className={`p-3 rounded-lg ${theme === 'LIGHT' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <p className={`text-sm ${theme === 'LIGHT' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
