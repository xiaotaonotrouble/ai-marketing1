import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";
import { useCampaignCreate } from '../context/CampaignCreateContext';
import { SettingAdvancedSettings } from './SettingAdvancedSettings';

interface SettingProps {
  onContentChange: (complete: boolean) => void;
}

// 预定义的选项列表
const placementOptions = [
  'Youtube dedicated videos',
  'Youtube integrated videos',
  'TikTok videos',
  'Instagram Reels',
  'Instagram carousel posts',
  'Twitter / X posts',
  'LinkedIn posts'
];

const languageOptions = [
  'Arabic',
  'Bengali',
  'Chinese',
  'Dutch',
  'English',
  'French',
  'German',
  'Hindi',
  'Indonesian',
  'Italian',
  'Japanese',
  'Korean',
  'Portuguese',
  'Russian',
  'Spanish',
  'Swedish',
  'Thai',
  'Turkish',
  'Vietnamese'
];

const postTimeOptions = [
  'Flexible post time: Creators can publish their content as soon as it\'s approved',
  'Fixed post time: Creators are required to post within a designated time window'
];

interface Region {
  name: string;
  countries: string[];
}

const locationOptions: Region[] = [
  {
    name: 'North America',
    countries: ['United States', 'Canada', 'Mexico']
  },
  {
    name: 'Latin America',
    countries: ['Brazil', 'Argentina', 'Colombia', 'Chile']
  },
  {
    name: 'Western Europe',
    countries: ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands']
  },
  {
    name: 'Eastern Europe',
    countries: ['Poland', 'Romania', 'Ukraine', 'Czech Republic']
  },
  {
    name: 'Middle East',
    countries: ['UAE', 'Saudi Arabia', 'Israel', 'Turkey']
  },
  {
    name: 'South Asia',
    countries: ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka']
  },
  {
    name: 'Southeast Asia',
    countries: ['Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Malaysia']
  },
  {
    name: 'East Asia',
    countries: ['China', 'Japan', 'South Korea', 'Taiwan']
  },
  {
    name: 'Oceania',
    countries: ['Australia', 'New Zealand']
  },
  {
    name: 'Africa',
    countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt']
  }
];

export function Setting({ onContentChange }: SettingProps) {
  const { state, setWindowStartDate, setWindowDueDate, setLandingPageUrl, setBudget, setSelectedPlacements, setSelectedLanguages, setSelectedLocations } = useCampaignCreate();
  const [selectedPostTime, setSelectedPostTime] = useState(postTimeOptions[0]);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPostTimeOpen, setIsPostTimeOpen] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  // 使用 useCallback 记忆化检查表单完整性的函数
  const checkFormComplete = useCallback((): boolean => {
    const hasRequiredDates = selectedPostTime === postTimeOptions[0] || 
      (state.windowStartDate !== null && state.windowDueDate !== null);

    return Boolean(
      state.selectedPlacements.length > 0 && 
      state.selectedLanguages.length > 0 && 
      state.selectedLocations.length > 0 &&
      hasRequiredDates &&
      state.landingPageUrl.trim() !== '' &&
      typeof state.budget === 'number' &&
      state.budget >= 0 &&
      state.budget !== 0
    );
  }, [
    state.selectedPlacements,
    state.selectedLanguages,
    state.selectedLocations,
    selectedPostTime,
    state.windowStartDate,
    state.windowDueDate,
    state.landingPageUrl,
    state.budget
  ]);

  // 检查表单是否完整
  useEffect(() => {
    onContentChange(checkFormComplete());
  }, [checkFormComplete, onContentChange]);

  // 处理选项选择
  const handlePlacementSelect = (placement: string) => {
    if (state.selectedPlacements.includes(placement)) {
      setSelectedPlacements(state.selectedPlacements.filter(p => p !== placement));
    } else {
      setSelectedPlacements([...state.selectedPlacements, placement]);
    }
    setIsPlacementOpen(false);
  };

  const handleLanguageSelect = (language: string) => {
    if (state.selectedLanguages.includes(language)) {
      setSelectedLanguages(state.selectedLanguages.filter(l => l !== language));
    } else {
      setSelectedLanguages([...state.selectedLanguages, language]);
    }
    setIsLanguageOpen(false);
  };

  const handleLocationSelect = (location: string) => {
    if (state.selectedLocations.includes(location)) {
      setSelectedLocations(state.selectedLocations.filter(l => l !== location));
    } else {
      setSelectedLocations([...state.selectedLocations, location]);
    }
  };

  const handlePostTimeSelect = (option: string) => {
    setSelectedPostTime(option);
    setIsPostTimeOpen(false);
    if (option === postTimeOptions[0]) {
      setWindowStartDate(null);
      setWindowDueDate(null);
    }
  };

  // 处理选项移除
  const handlePlacementRemove = (placement: string) => {
    setSelectedPlacements(state.selectedPlacements.filter(p => p !== placement));
  };

  const handleLanguageRemove = (language: string) => {
    setSelectedLanguages(state.selectedLanguages.filter(l => l !== language));
  };

  const handleLocationRemove = (location: string) => {
    setSelectedLocations(state.selectedLocations.filter(l => l !== location));
  };

  return (
    <div className="space-y-6">
      {/* Placements 和 Languages 选择 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Placements */}
        <div className="relative">
          <label className="text-sm text-gray-700">
            Placements
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div
            className="mt-1 relative"
            onBlur={() => setTimeout(() => setIsPlacementOpen(false), 200)}
          >
            <div
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg bg-white cursor-pointer min-h-[36px] flex flex-wrap items-center"
              onClick={() => setIsPlacementOpen(!isPlacementOpen)}
            >
              {state.selectedPlacements.length === 0 && (
                <span className="text-gray-400 text-sm">Select placement</span>
              )}
              <div className="flex flex-wrap gap-1 max-w-[calc(100%-4px)]">
                {state.selectedPlacements.map((placement) => (
                  <span
                    key={placement}
                    className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded text-sm flex items-center gap-0.5 h-[22px]"
                  >
                    <span>{placement}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlacementRemove(placement);
                      }}
                      className="cursor-pointer text-gray-500 hover:text-gray-700 select-none outline-none focus:outline-none"
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            </div>
            {isPlacementOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {placementOptions.map((placement) => (
                  <button
                    key={placement}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none hover:border hover:border-white ${
                      state.selectedPlacements.includes(placement)
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-700'
                    }`}
                    onClick={() => handlePlacementSelect(placement)}
                  >
                    {placement}
                    {state.selectedPlacements.includes(placement) && (
                      <span className="float-right text-orange-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="relative">
          <label className="text-sm text-gray-700">
            Languages
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div
            className="mt-1 relative"
            onBlur={() => setTimeout(() => setIsLanguageOpen(false), 200)}
          >
            <div
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg bg-white cursor-pointer min-h-[36px] flex flex-wrap items-center"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
              {state.selectedLanguages.length === 0 && (
                <span className="text-gray-400 text-sm">Select language</span>
              )}
              <div className="flex flex-wrap gap-1 max-w-[calc(100%-4px)]">
                {state.selectedLanguages.map((language) => (
                  <span
                    key={language}
                    className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded text-sm flex items-center gap-0.5 h-[22px]"
                  >
                    <span>{language}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLanguageRemove(language);
                      }}
                      className="cursor-pointer text-gray-500 hover:text-gray-700 select-none outline-none focus:outline-none"
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            </div>
            {isLanguageOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[252px] overflow-y-auto">
                {languageOptions.map((language) => (
                  <button
                    key={language}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none hover:border hover:border-white ${
                      state.selectedLanguages.includes(language)
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-700'
                    }`}
                    onClick={() => handleLanguageSelect(language)}
                  >
                    {language}
                    {state.selectedLanguages.includes(language) && (
                      <span className="float-right text-orange-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="relative">
        <label className="text-sm text-gray-700">
          Locations
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div
          className="mt-1 relative"
          onBlur={() => {
            setTimeout(() => {
              setIsLocationOpen(false);
              setExpandedRegion(null);
            }, 200);
          }}
        >
          <div
            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg bg-white cursor-pointer min-h-[36px] flex flex-wrap items-center"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
          >
            {state.selectedLocations.length === 0 && (
              <span className="text-gray-400 text-sm">Select locations</span>
            )}
            <div className="flex flex-wrap gap-1 max-w-[calc(100%-4px)]">
              {state.selectedLocations.map((location) => (
                <span
                  key={location}
                  className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded text-sm flex items-center gap-0.5 h-[22px]"
                >
                  <span>{location}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLocationRemove(location);
                    }}
                    className="cursor-pointer text-gray-500 hover:text-gray-700 select-none outline-none focus:outline-none"
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
          </div>
          {isLocationOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[252px] overflow-y-auto">
              {locationOptions.map((region) => (
                <div key={region.name}>
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none hover:border hover:border-white flex items-center justify-between"
                    onClick={() => setExpandedRegion(expandedRegion === region.name ? null : region.name)}
                  >
                    <span>{region.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expandedRegion === region.name ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedRegion === region.name && (
                    <div className="bg-gray-50">
                      {region.countries.map((country) => (
                        <button
                          key={country}
                          className={`w-full px-8 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none hover:border hover:border-white ${
                            state.selectedLocations.includes(country)
                              ? 'bg-orange-50 text-orange-700'
                              : 'text-gray-700'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocationSelect(country);
                          }}
                        >
                          {country}
                          {state.selectedLocations.includes(country) && (
                            <span className="float-right text-orange-500">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Influencer marketing post date */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700">
          Influencer marketing post date
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex gap-4 items-start">
          <div className="relative w-1/2">
            <div
              className="mt-1 relative"
              onBlur={() => setTimeout(() => setIsPostTimeOpen(false), 200)}
            >
              <div
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg bg-white cursor-pointer min-h-[36px] flex items-center"
                onClick={() => setIsPostTimeOpen(!isPostTimeOpen)}
              >
                <span className="text-gray-900 text-sm truncate">
                  {selectedPostTime === postTimeOptions[0] ? 'Flexible post time' : 'Fixed post time'}
                </span>
              </div>
              {isPostTimeOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {postTimeOptions.map((option) => (
                    <button
                      key={option}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none hover:border hover:border-white ${
                        selectedPostTime === option
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700'
                      }`}
                      onClick={() => handlePostTimeSelect(option)}
                    >
                      {option}
                      {selectedPostTime === option && (
                        <span className="float-right text-orange-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {selectedPostTime === postTimeOptions[1] && (
            <div className="flex items-center gap-2 w-1/2">
              <DatePicker
                selected={state.windowStartDate}
                onChange={(date) => setWindowStartDate(date)}
                selectsStart
                startDate={state.windowStartDate}
                endDate={state.windowDueDate}
                dateFormat="MMM d, yyyy"
                placeholderText="Start date"
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                wrapperClassName="flex-1"
                minDate={new Date()}
                showPopperArrow={false}
                customInput={
                  <input
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                }
              />
              <span className="text-gray-500">→</span>
              <DatePicker
                selected={state.windowDueDate}
                onChange={(date) => setWindowDueDate(date)}
                selectsEnd
                startDate={state.windowStartDate}
                endDate={state.windowDueDate}
                minDate={state.windowStartDate || new Date()}
                dateFormat="MMM d, yyyy"
                placeholderText="End date"
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                wrapperClassName="flex-1"
                showPopperArrow={false}
                customInput={
                  <input
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Affiliate marketing content post date */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700">
          Affiliate marketing content post date
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="max-w-[660px]">
          <input
            type="text"
            value="Influencers are required to post content within 1 month after their applications are approved"
            disabled
            className="w-full px-4 py-2 text-sm text-gray-700 bg-[#fafafa] border border-gray-300 rounded-lg focus:outline-none cursor-not-allowed"
            readOnly
          />
        </div>
      </div>

      {/* Landing page URL */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700">
          Provide the link where audience will be taken when they click (Landing page)
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="url"
          value={state.landingPageUrl}
          onChange={(e) => setLandingPageUrl(e.target.value)}
          placeholder="Enter landing page URL"
          className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700">
          Budget
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative w-[200px]">
          <input
            type="number"
            value={state.budget || ''}
            onChange={(e) => {
              const value = e.target.value;
              // 允许输入任何数字，包括负数
              if (value === '') {
                setBudget(0);
              } else {
                setBudget(Number(value));
              }
            }}
            placeholder="Enter budget"
            className="w-full pl-8 pr-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
        </div>
        {typeof state.budget === 'number' && state.budget < 0 && (
          <p className="text-red-500 text-sm mt-1">Budget must be greater than or equal to 0</p>
        )}
      </div>

      {/* Advanced Settings */}
      <SettingAdvancedSettings className="mt-8" />
    </div>
  );
} 