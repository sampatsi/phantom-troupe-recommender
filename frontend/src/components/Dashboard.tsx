import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { internshipAPI, Recommendation } from '../services/api';
import RecommendationCard from './RecommendationCard';
import LoadingSpinner from './LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchRecommendations();
  }, [limit, user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await internshipAPI.getRecommendations(limit);
      setRecommendations(data.items);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Phantom Troupe</h1>
                <p className="text-sm text-gray-500">Internship Recommender</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Welcome back, {user?.name}! 👋
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-primary-800">Education</h3>
                  <p className="text-sm text-primary-600">
                    {user?.education.degree} in {user?.education.branch} - Year {user?.education.year}
                  </p>
                  <p className="text-xs text-primary-500">CGPA: {user?.education.cgpa}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Skills</h3>
                  <p className="text-sm text-green-600">
                    {user?.skills?.length || 0} skills registered
                  </p>
                  <p className="text-xs text-green-500">
                    {user?.skills?.slice(0, 3).join(', ')}
                    {user?.skills && user.skills.length > 3 && '...'}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">Preferences</h3>
                  <p className="text-sm text-purple-600">
                    Min stipend: ₹{user?.preferences.stiped_min?.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-500">
                    {user?.preferences.locations.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Personalized Recommendations
                </h2>
                <div className="flex items-center space-x-2">
                  <label htmlFor="limit" className="text-sm font-medium text-gray-700">
                    Show:
                  </label>
                  <select
                    id="limit"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="mt-1 block w-20 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <button
                    onClick={fetchRecommendations}
                    className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {recommendations.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We couldn't find any internships that match your profile. Try updating your preferences or skills.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <RecommendationCard
                      key={recommendation.internshipId}
                      recommendation={recommendation}
                      rank={index + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
