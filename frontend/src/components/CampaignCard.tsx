import React from 'react';
import { Campaign } from '../types/campaign';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: (campaign: Campaign) => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-700 border border-gray-300',
  active: 'bg-green-100 text-green-700 border border-green-300',
  done: 'bg-blue-100 text-blue-700 border border-blue-300',
};

export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  return (
    <div 
      className="card cursor-pointer"
      onClick={() => onClick(campaign)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[campaign.status]}`}>
          {campaign.status}
        </span>
      </div>
      
      {campaign.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
      )}
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          {new Date(campaign.createdAt).toLocaleDateString()}
        </span>
        {campaign.budget && (
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ${campaign.budget.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
} 