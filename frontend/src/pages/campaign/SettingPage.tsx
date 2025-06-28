import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepSidebar } from '../../components/StepSidebar';
import { CampaignCreateHeader } from '../../components/CampaignCreateHeader';
import { ContentContainer } from '../../components/ContentContainer';
import { ThinkingStatus } from '../../components/ThinkingStatus';
import { Setting } from '../../components/Setting';
import { CampaignSuccessModal } from '../../components/CampaignSuccessModal';
import { useCampaign } from '../../context/CampaignContext';
import { useCampaignCreate } from '../../context/CampaignCreateContext';

// 定义创建活动的步骤
const campaignSteps = [
  { number: 1, label: 'Target Analysis' },
  { number: 2, label: 'Key Message' },
  { number: 3, label: 'Campaign Settings' }
];

const SettingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { updateCampaign } = useCampaign();
  const { state, setCurrentStep } = useCampaignCreate();

  // 设置当前步骤 - 只在组件挂载时运行一次
  useEffect(() => {
    if (state.currentStep !== 'setting') {
      setCurrentStep('setting');
    }
  }, []); // 空依赖数组，确保只运行一次

  const handleNext = () => {
    // 准备要更新的campaign数据
    const campaignData = {
      // 第一步的状态
      productUrl: state.targetUrl,
      analysis: state.analysisResult,
      selectedStrategies: state.selectedStrategies,

      // 第二步的状态
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

      // 第三步的状态
      budget: state.budget,
      windowStartDate: state.windowStartDate,
      windowDueDate: state.windowDueDate,
      landingPageUrl: state.landingPageUrl,
      selectedPlacements: state.selectedPlacements,
      selectedLanguages: state.selectedLanguages,
      selectedLocations: state.selectedLocations,
      customBrandGuidelines: state.customBrandGuidelines.filter(guideline => guideline.trim() !== '')
    };

    // 打印所有字段到控制台
    console.log('Campaign Data:', {
      ...campaignData,
      windowStartDate: campaignData.windowStartDate ? campaignData.windowStartDate.toISOString() : null,
      windowDueDate: campaignData.windowDueDate ? campaignData.windowDueDate.toISOString() : null
    });

    // 更新campaign
    updateCampaign(campaignData);

    // 显示成功弹窗
    setShowSuccessModal(true);
  };

  // 模拟加载过程
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5秒后显示完成状态

    return () => clearTimeout(timer);
  }, []);

  const handleContentChange = useCallback((complete: boolean) => {
    setIsComplete(complete);
  }, []); // 空依赖数组，因为setIsComplete是稳定的

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部固定导航 */}
      <CampaignCreateHeader 
        title="Campaign Settings" 
        onNext={handleNext}
        canNext={isComplete}
      />
      
      {/* 左侧步骤导航 */}
      <StepSidebar steps={campaignSteps} currentStep={3} />
      
      {/* 页面内容 */}
      <div className="pt-20 px-4 pl-16">
        <ContentContainer>
          <div className="min-h-[500px] space-y-1">
            <ThinkingStatus isSuccess={!isLoading} />
            
            {/* 设置表单内容 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <Setting onContentChange={handleContentChange} />
            </div>
          </div>
        </ContentContainer>
      </div>

      <CampaignSuccessModal isOpen={showSuccessModal} />
    </div>
  );
};

export default SettingPage; 