import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '../types/campaign';
import { CampaignCard } from '../components/CampaignCard';
import { getUserCampaigns } from '../services/campaign';
import { useAuth } from '../context/AuthContext';

// 生成临时 ID 的函数
const generateTempId = () => {
  return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 如果用户未登录，重定向到登录页面
    if (!user) {
      navigate('/auth/login');
      return;
    }

    // 加载用户的活动列表
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error('Error loading campaigns:', error);
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [user, navigate]);

  const handleCampaignClick = (campaign: Campaign) => {
    navigate(`/campaign/${campaign.id}`);
  };

  // 处理创建新活动
  const handleCreateCampaign = () => {
    const tempId = generateTempId();
    navigate(`/campaign/create/develop-strategy?campaignId=${tempId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
          <button
            onClick={handleCreateCampaign}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Create Campaign
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {campaigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new campaign.</p>
            <div className="mt-6">
              <button
                onClick={handleCreateCampaign}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Create Campaign
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onClick={handleCampaignClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 