import React, { useState, useEffect } from 'react';
import { MarketingStrategy } from '../services/api';
import { useCampaignCreate } from '../context/CampaignCreateContext';

interface MarketingStrategiesProps {
  onStrategySelect: (strategies: MarketingStrategy[]) => void;
}

export function MarketingStrategies({ onStrategySelect }: MarketingStrategiesProps) {
  const { state: { selectedStrategies } } = useCampaignCreate();
  
  // 初始策略数据
  const [strategies, setStrategies] = useState<MarketingStrategy[]>([
    {
      type: 'Influencer marketing',
      description: 'Collaborate with influencers to promote products or services through organic content',
      goal: 'website traffic',
      selected: false
    },
    {
      type: 'Affiliate marketing',
      description: 'Performance-based partnership where influencers earn commissions for driving measurable sales',
      goal: 'sales',
      selected: false
    }
  ]);

  // 从context加载已选择的策略
  useEffect(() => {
    setStrategies(prevStrategies => 
      prevStrategies.map(strategy => ({
        ...strategy,
        selected: selectedStrategies.some(s => s.type === strategy.type)
      }))
    );
  }, [selectedStrategies]);

  // 处理策略选择（支持多选）
  const handleStrategySelect = (index: number) => {
    const newStrategies = strategies.map((strategy, i) => ({
      ...strategy,
      selected: i === index ? !strategy.selected : strategy.selected
    }));
    setStrategies(newStrategies);
    
    // 通知父组件
    onStrategySelect(newStrategies);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-4">
      <div className="p-5">
        {/* 欢迎消息 */}
        <p className="text-gray-700 text-sm mb-6">
          Hi User, I've generated your personalized marketing strategies based on your input. 
          Please review them to ensure they align with your goals. If everything looks good, 
          simply proceed to the next step to set up your campaign.
        </p>

        {/* 策略标题 */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Channel strategy
        </h2>

        {/* 策略卡片容器 - 改为三列布局 */}
        <div className="grid grid-cols-3 gap-4">
          {strategies.map((strategy, index) => (
            <div
              key={strategy.type}
              onClick={() => handleStrategySelect(index)}
              className={`cursor-pointer rounded-lg border p-4 transition-all ${
                strategy.selected
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* 策略图标和标题行 */}
              <div className="flex items-start justify-between">
                <div className="flex-shrink-0">
                  {strategy.type === 'Influencer marketing' ? (
                    <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 20V19C5 17.1362 6.27477 15.5701 8 15.126" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 15.126C16.7252 15.5701 18 17.1362 18 19V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 12V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 12L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 12L22 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 18L9 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 18L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                {/* 选择指示器 */}
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                  strategy.selected
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}>
                  {strategy.selected && (
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              
              {/* 标题和描述 */}
              <div className="mt-6">
                <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Times New Roman' }}>
                  {strategy.type}
                </h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2" style={{ fontFamily: 'Times New Roman' }}>
                  {strategy.description}
                </p>
              </div>

              {/* 策略目标 */}
              <div className="flex items-center mt-8">
                <svg className="w-4 h-4 text-gray-500 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm text-gray-500">Goal: {strategy.goal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 