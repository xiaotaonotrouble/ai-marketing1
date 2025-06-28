import React, { useState } from 'react';
import { useCampaignCreate } from '../context/CampaignCreateContext';
import { CoreSellingPoint } from './CoreSellingPoint';

interface SettingAdvancedSettingsProps {
  className?: string;
}

export function SettingAdvancedSettings({ className = '' }: SettingAdvancedSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    state, 
    setProductExplainerVideo, 
    addCustomBrandGuideline,
    removeCustomBrandGuideline,
    updateCustomBrandGuideline
  } = useCampaignCreate();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with toggle */}
      <div className="flex items-center gap-1">
        <h2 className="text-lg font-medium text-gray-900">Advanced settings</h2>
                  <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full hover:border hover:border-gray-50 focus:outline-none"
        >
          <svg
            className={`w-5 h-5 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Product explainer video */}
          <div className="flex gap-6">
            <div className="w-[40%] space-y-1">
              <h3 className="text-sm font-medium text-gray-700">Product explainer video</h3>
              <p className="text-sm text-gray-600">
                Upload a YouTube video explaining your products or service to help creators better understand your campaign requirements.
              </p>
            </div>
            <div className="w-[60%]">
              <input
                type="text"
                value={state.productExplainerVideo}
                onChange={(e) => setProductExplainerVideo(e.target.value)}
                placeholder="e.g. https://youtu.be/nXyPLFQeddA?si=EoO5X98IP5lZ1sw8"
                className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Custom brand guidelines */}
          <div className="flex gap-6">
            <div className="w-[40%] space-y-1">
              <h3 className="text-sm font-medium text-gray-700">Custom brand guidelines</h3>
              <div className="text-sm text-gray-600">
                Requirements that you'd like the creators to follow.
              </div>
            </div>
            <div className="w-[60%] space-y-2">
              {state.customBrandGuidelines.map((guideline, index) => (
                <CoreSellingPoint
                  key={index}
                  value={guideline}
                  onChange={(value) => updateCustomBrandGuideline(index, value)}
                  onDelete={() => removeCustomBrandGuideline(index)}
                  showDelete={state.customBrandGuidelines.length > 1}
                />
              ))}
              {state.remainingGuidelines > 0 && (
                <div className="flex items-center gap-2">
                                      <button
                      onClick={addCustomBrandGuideline}
                      className="p-2 text-orange-500 border border-transparent hover:bg-gray-100 rounded-full hover:border-gray-50 select-none h-[40px] w-[60px] flex items-center justify-center focus:outline-none"
                    >
                      +  ({state.remainingGuidelines})
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 