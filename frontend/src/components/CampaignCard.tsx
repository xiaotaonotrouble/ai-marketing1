import React from 'react';
import { Campaign } from '../types/campaign';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: (campaign: Campaign) => void;
}

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  archived: 'bg-gray-100 text-gray-800',
};

export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  return (
    <div 
      className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(campaign)}
    >
      <div className="px-4 py-5 sm:p-6">
        {/* Campaign Logo */}
        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg mb-4">
          {campaign.businessLogo ? (
            <img
              src={campaign.businessLogo}
              alt={`${campaign.businessName} logo`}
              className="h-24 w-24 object-contain"
            />
          ) : (
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        {/* Campaign Info */}
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {campaign.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 truncate">
          {campaign.businessName}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status] || statusColors.draft}`}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
          <span className="text-xs text-gray-500">
            {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : ''}
          </span>
        </div>
      </div>
    </div>
  );
} 