import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepSidebar } from '../../components/StepSidebar';
import { CampaignCreateHeader } from '../../components/CampaignCreateHeader';
import { KeyMessage } from '../../components/KeyMessage';
import { useCampaign } from '../../context/CampaignContext';
import { useCampaignCreate } from '../../context/CampaignCreateContext';

// 定义创建活动的步骤
const campaignSteps = [
  { number: 1, label: 'Target Analysis' },
  { number: 2, label: 'Key Message' },
  { number: 3, label: 'Campaign Settings' }
];

const KeyMessagePage: React.FC = () => {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  const { updateCampaign, clearCampaign } = useCampaign();
  const { state, setCurrentStep } = useCampaignCreate();

  // 设置当前步骤 - 只在组件挂载时运行一次
  useEffect(() => {
    if (state.currentStep !== 'key-message') {
      setCurrentStep('key-message');
    }
  }, []); // 空依赖数组，确保只运行一次

  const handleNext = async () => {
    // 只打印 CampaignCreateContext 的值
    console.log('CampaignCreateContext state:', state);

    // 清空 CampaignContext
    clearCampaign();

    // 准备要更新的数据
    const updateData = {
      name: `${state.businessName || 'New'} Campaign`,
      status: 'draft' as const,
      businessLogo: state.businessLogo,
      businessName: state.businessName,
      productType: state.productType,
      deliveryType: state.deliveryType,
      productName: state.productName,
      productPhotos: state.productPhotos,
      videoAssetLink: state.videoAssetLink,
      businessIntroduction: state.businessIntroduction,
      coreSellingPoints: state.coreSellingPoints.filter(point => point.trim() !== ''),
      coreAudiences: state.coreAudiences.filter(audience => audience.title.trim() !== '' || audience.description.trim() !== ''),
      audienceGenders: state.audienceGenders,
      audienceAges: state.audienceAges,
      audienceInterests: state.audienceInterests,
      productUrl: state.targetUrl || '',
      analysis: state.analysisResult,
      selectedStrategies: state.selectedStrategies,
    };

    // 更新 CampaignContext
    updateCampaign(updateData);

    // 导航到下一页
    navigate(`/campaign/create/setting?campaignId=${state.campaignId}`);
  };

  const handleContentChange = useCallback((complete: boolean) => {
    setIsComplete(complete);
  }, []); // 空依赖数组，因为setIsComplete是稳定的

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部固定导航 */}
      <CampaignCreateHeader 
        title="New Campaign" 
        onNext={handleNext}
        canNext={isComplete}
      />
      
      {/* 左侧步骤导航 */}
      <StepSidebar steps={campaignSteps} currentStep={2} />
      
      {/* 页面内容 */}
      <div className="pt-20 px-4 pl-16">
        <KeyMessage onContentChange={handleContentChange} />
      </div>
    </div>
  );
};

export default KeyMessagePage; 