import React, { useState } from 'react';

// 组件的主要功能：提供高级设置选项，包括性别、年龄选择和兴趣输入
// 支持多选、删除选项，并显示选中状态

interface AudienceAdvancedSettingsProps {
  selectedGenders: string[];
  selectedAges: string[];
  interests: string;
  onGenderChange: (genders: string[]) => void;
  onAgeChange: (ages: string[]) => void;
  onInterestChange: (interest: string) => void;
}

// 预定义的选项列表
const genderOptions = ['Female', 'Male'];
const ageOptions = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

export function AudienceAdvancedSettings({
  selectedGenders,
  selectedAges,
  interests,
  onGenderChange,
  onAgeChange,
  onInterestChange,
}: AudienceAdvancedSettingsProps) {
  // 控制下拉菜单的显示状态
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isAgeOpen, setIsAgeOpen] = useState(false);

  // 处理性别选择
  const handleGenderSelect = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      onGenderChange(selectedGenders.filter(g => g !== gender));
    } else {
      onGenderChange([...selectedGenders, gender]);
    }
    setIsGenderOpen(false);
  };

  // 处理年龄选择
  const handleAgeSelect = (age: string) => {
    if (selectedAges.includes(age)) {
      onAgeChange(selectedAges.filter(a => a !== age));
    } else {
      onAgeChange([...selectedAges, age]);
    }
    setIsAgeOpen(false);
  };

  // 处理性别选项移除
  const handleGenderRemove = (gender: string) => {
    onGenderChange(selectedGenders.filter(g => g !== gender));
  };

  // 处理年龄选项移除
  const handleAgeRemove = (age: string) => {
    onAgeChange(selectedAges.filter(a => a !== age));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h3 className="text-sm font-medium text-gray-700">Advanced Settings</h3>
        <svg
          className="w-5 h-5 ml-1 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <div className="mx-4 p-4 bg-[#fafafa] rounded-lg space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Gender Selection */}
          <div className="relative">
            <label className="text-sm text-gray-700">Gender</label>
            <div
              className="mt-1 relative"
              onBlur={() => setTimeout(() => setIsGenderOpen(false), 200)}
            >
              <div
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg bg-white cursor-pointer min-h-[36px] flex flex-wrap items-center"
                onClick={() => setIsGenderOpen(!isGenderOpen)}
              >
                {selectedGenders.length === 0 && (
                  <span className="text-gray-400 text-sm">Select gender</span>
                )}
                <div className="flex flex-wrap gap-1 max-w-[calc(100%-4px)]">
                  {selectedGenders.map((gender) => (
                    <span
                      key={gender}
                      className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded text-sm flex items-center gap-0.5 h-[22px]"
                    >
                      <span>{gender}</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenderRemove(gender);
                        }}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 select-none outline-none focus:outline-none"
                      >
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              {isGenderOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {genderOptions.map((gender) => (
                    <button
                      key={gender}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none hover:border hover:border-white ${
                        selectedGenders.includes(gender)
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700'
                      }`}
                      onClick={() => handleGenderSelect(gender)}
                    >
                      {gender}
                      {selectedGenders.includes(gender) && (
                        <span className="float-right text-orange-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Age Selection */}
          <div className="relative">
            <label className="text-sm text-gray-700">Age</label>
            <div
              className="mt-1 relative"
              onBlur={() => setTimeout(() => setIsAgeOpen(false), 200)}
            >
              <div
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg bg-white cursor-pointer min-h-[36px] flex flex-wrap items-center"
                onClick={() => setIsAgeOpen(!isAgeOpen)}
              >
                {selectedAges.length === 0 && (
                  <span className="text-gray-400 text-sm">Please select age</span>
                )}
                <div className="flex flex-wrap gap-1 max-w-[calc(100%-4px)]">
                  {selectedAges.map((age) => (
                    <span
                      key={age}
                      className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded text-sm flex items-center gap-0.5 h-[22px]"
                    >
                      <span>{age}</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgeRemove(age);
                        }}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 select-none outline-none focus:outline-none"
                      >
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              {isAgeOpen && (
                <div className="absolute bottom-full mb-1 z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  {ageOptions.map((age) => (
                    <button
                      key={age}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none hover:border hover:border-white ${
                        selectedAges.includes(age)
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700'
                      }`}
                      onClick={() => handleAgeSelect(age)}
                    >
                      {age}
                      {selectedAges.includes(age) && (
                        <span className="float-right text-orange-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interest Input */}
        <div className="space-y-1">
          <label className="text-sm text-gray-700">Interest</label>
          <div className="relative">
            <input
              type="text"
              value={interests}
              onChange={(e) => onInterestChange(e.target.value)}
              maxLength={200}
              className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Please enter the interests of the audience, separated by ','"
            />
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              {interests.length} / 200
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 