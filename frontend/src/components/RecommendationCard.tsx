import React, { useState } from 'react';
import { Recommendation, internshipAPI } from '../services/api';

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, rank }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [internshipDetails, setInternshipDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchInternshipDetails = async () => {
    if (internshipDetails) return;
    
    try {
      setLoadingDetails(true);
      const details = await internshipAPI.getInternship(recommendation.internshipId);
      setInternshipDetails(details);
    } catch (error) {
      console.error('Failed to fetch internship details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = () => {
    setShowDetails(!showDetails);
    if (!showDetails && !internshipDetails) {
      fetchInternshipDetails();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Good Match';
    if (score >= 0.4) return 'Fair Match';
    return 'Low Match';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                #{rank}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">
                {recommendation.title}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(recommendation.score)}`}>
                {getScoreLabel(recommendation.score)} ({(recommendation.score * 100).toFixed(0)}%)
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {recommendation.org}
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {recommendation.location}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                ₹{recommendation.stipend.toLocaleString()}/month
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {recommendation.duration_months} months
              </div>
            </div>

            {recommendation.why && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Why this matches:</strong> {recommendation.why}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleViewDetails}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loadingDetails ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
              {showDetails ? 'Hide Details' : 'View Details'}
            </button>
          </div>
        </div>

        {showDetails && internshipDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Description</h4>
                <p className="text-sm text-gray-600 mb-4">{internshipDetails.description}</p>
                
                <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {internshipDetails.skills_required.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {internshipDetails.skills_nice_to_have.length > 0 && (
                  <>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Nice to Have</h4>
                    <div className="flex flex-wrap gap-2">
                      {internshipDetails.skills_nice_to_have.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Requirements</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <strong>Education:</strong> {internshipDetails.education_required.degree.join(', ')} in {internshipDetails.education_required.branches.join(', ')}
                  </div>
                  <div>
                    <strong>Minimum Year:</strong> {internshipDetails.education_required.year_min}
                  </div>
                  <div>
                    <strong>Application Deadline:</strong> {new Date(internshipDetails.application_deadline).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Organization Type:</strong> {internshipDetails.org_type}
                  </div>
                  {internshipDetails.diversity_eligibility && (
                    <div>
                      <strong>Diversity:</strong>
                      <ul className="ml-4 mt-1">
                        {internshipDetails.diversity_eligibility.women_only && <li>• Women only</li>}
                        {internshipDetails.diversity_eligibility.pwd_friendly && <li>• PwD friendly</li>}
                        {internshipDetails.diversity_eligibility.ews_priority && <li>• EWS priority</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
