import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignCreateHeader } from '../../components/CampaignCreateHeader';
import { StepSidebar } from '../../components/StepSidebar';
import { UrlBox } from '../../components/UrlBox';
import { useCampaignCreate } from '../../context/CampaignCreateContext';

// 定义创建活动的步骤
const campaignSteps = [
  { number: 1, label: '选择目标' },
  { number: 2, label: '关键信息' },
  { number: 3, label: '营销策略' },
  { number: 4, label: '执行计划' }
];

export function DevelopStrategyPage() {
  const navigate = useNavigate();
  const { state } = useCampaignCreate();

  // 处理生成策略
  const handleGenerate = (url: string) => {
    console.log('Generating strategy for:', url);
  };

  // 处理下一步
  const handleNext = () => {
    navigate(`/campaign/create/key-message?campaignId=${state.campaignId}`);
  };

  // 只有当有选中的策略时才能进入下一步
  const canProceed = state.selectedStrategies.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部固定导航 */}
      <CampaignCreateHeader 
        title="New Campaign" 
        onNext={handleNext}
        canNext={canProceed}
      />
      
      {/* 左侧步骤导航 */}
      <StepSidebar steps={campaignSteps} currentStep={1} />
      
      {/* 页面内容 - 减小顶部间距 */}
      <div className="pt-20 px-4 pl-16">
        <UrlBox onGenerate={handleGenerate} />
      </div>
    </div>
  );
} 