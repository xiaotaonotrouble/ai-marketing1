import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignCard } from '../components/CampaignCard';
import { Campaign } from '../types/campaign';

interface HomePageProps {
  campaigns: Campaign[];
}

export function HomePage({ campaigns }: HomePageProps) {
  const navigate = useNavigate();

  const handleCampaignClick = (campaign: Campaign) => {
    navigate(`/campaign/${campaign.id}`);
  };

  const handleCreateCampaign = () => {
    navigate('/campaign/create/develop-strategy');
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
          <button
            onClick={handleCreateCampaign}
            className="btn-primary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onClick={handleCampaignClick}
            />
          ))}
        </div>
      </div>
    </main>
  );
} 