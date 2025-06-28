import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Audience {
  title: string;
  description: string;
}

interface CampaignCreateState {
  // 全局状态
  currentStep: 'target' | 'key-message' | 'setting';
  
  // 第一步的状态
  targetUrl: string;
  isAnalysisComplete: boolean;
  analysisResult?: any; // 后续可以定义具体的类型
  thinkingSuccess: boolean | null;
  showStrategies: boolean;
  selectedStrategies: any[]; // 选中的策略列表

  // 第二步的状态 - 基本信息
  businessLogo?: string;
  businessName: string;
  productType: string;

  // 第二步的状态 - 产品交付
  deliveryType: 'ship' | 'video' | '';
  productName: string;
  productPhotos: { url: string; name: string }[];
  videoAssetLink: string;

  // 第二步的状态 - 业务介绍
  businessIntroduction: string;

  // 第二步的状态 - 核心卖点
  coreSellingPoints: string[];
  remainingPoints: number;

  // 第二步的状态 - 核心受众
  coreAudiences: Audience[];
  remainingAudiences: number;
  // 核心受众的高级设置
  audienceGenders: string[];
  audienceAges: string[];
  audienceInterests: string;

  // 第三步的状态 - 预算
  budget: number;

  // 第三步的状态 - 发布时间窗口
  windowStartDate: Date | null;
  windowDueDate: Date | null;
  landingPageUrl: string;

  // 第三步的状态 - 投放设置
  selectedPlacements: string[];
  selectedLanguages: string[];
  selectedLocations: string[];

  // 第三步的状态 - 高级设置
  productExplainerVideo: string;
  customBrandGuidelines: string[];
  remainingGuidelines: number;
}

interface CampaignCreateContextType {
  state: CampaignCreateState;
  setCurrentStep: (step: 'target' | 'key-message' | 'setting') => void;
  setTargetUrl: (url: string) => void;
  setAnalysisComplete: (complete: boolean, result?: any) => void;
  setThinkingSuccess: (success: boolean | null) => void;
  setShowStrategies: (show: boolean) => void;
  setSelectedStrategies: (strategies: any[]) => void;
  setBusinessLogo: (logo: string) => void;
  setBusinessName: (name: string) => void;
  setProductType: (type: string) => void;
  setDeliveryType: (type: 'ship' | 'video' | '') => void;
  setProductName: (name: string) => void;
  setProductPhotos: (photos: { url: string; name: string }[]) => void;
  setVideoAssetLink: (link: string) => void;
  
  // 业务介绍相关
  setBusinessIntroduction: (intro: string) => void;
  
  // 核心卖点相关
  addCoreSellingPoint: () => void;
  removeCoreSellingPoint: (index: number) => void;
  updateCoreSellingPoint: (index: number, value: string) => void;
  
  // 核心受众相关
  addAudience: () => void;
  removeAudience: (index: number) => void;
  updateAudienceTitle: (index: number, value: string) => void;
  updateAudienceDescription: (index: number, value: string) => void;
  updateAudienceGenders: (genders: string[]) => void;
  updateAudienceAges: (ages: string[]) => void;
  updateAudienceInterests: (interests: string) => void;

  // 发布时间窗口相关
  setWindowStartDate: (date: Date | null) => void;
  setWindowDueDate: (date: Date | null) => void;
  setLandingPageUrl: (url: string) => void;

  // 预算
  setBudget: (budget: number) => void;

  // 高级设置相关
  setProductExplainerVideo: (url: string) => void;
  addCustomBrandGuideline: () => void;
  removeCustomBrandGuideline: (index: number) => void;
  updateCustomBrandGuideline: (index: number, value: string) => void;
  resetState: () => void;

  // New functions
  setSelectedPlacements: (placements: string[]) => void;
  setSelectedLanguages: (languages: string[]) => void;
  setSelectedLocations: (locations: string[]) => void;
}

const initialState: CampaignCreateState = {
  currentStep: 'target',
  targetUrl: '',
  isAnalysisComplete: false,
  thinkingSuccess: null,
  showStrategies: false,
  selectedStrategies: [],
  businessName: '',
  productType: '',
  deliveryType: '',
  productName: '',
  productPhotos: [],
  videoAssetLink: '',
  businessIntroduction: '',
  coreSellingPoints: ['', '', '', '', ''],
  remainingPoints: 15,
  coreAudiences: [
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' }
  ],
  remainingAudiences: 12,
  audienceGenders: [],
  audienceAges: [],
  audienceInterests: '',
  windowStartDate: null,
  windowDueDate: null,
  landingPageUrl: '',
  budget: 0,
  selectedPlacements: ['TikTok videos'],
  selectedLanguages: ['English'],
  selectedLocations: ['United States'],
  productExplainerVideo: '',
  customBrandGuidelines: [''],
  remainingGuidelines: 10,
};

const CampaignCreateContext = createContext<CampaignCreateContextType | undefined>(undefined);

export function CampaignCreateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CampaignCreateState>(initialState);

  const setCurrentStep = (step: 'target' | 'key-message' | 'setting') => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const setTargetUrl = (url: string) => {
    setState(prev => ({ ...prev, targetUrl: url }));
  };

  const setAnalysisComplete = (complete: boolean, result?: any) => {
    setState(prev => ({ 
      ...prev, 
      isAnalysisComplete: complete,
      analysisResult: result
    }));
  };

  const setThinkingSuccess = (success: boolean | null) => {
    setState(prev => ({ ...prev, thinkingSuccess: success }));
  };

  const setShowStrategies = (show: boolean) => {
    setState(prev => ({ ...prev, showStrategies: show }));
  };

  const setSelectedStrategies = (strategies: any[]) => {
    setState(prev => ({ ...prev, selectedStrategies: strategies }));
  };

  const setBusinessLogo = (logo: string) => {
    setState(prev => ({ ...prev, businessLogo: logo }));
  };

  const setBusinessName = (name: string) => {
    setState(prev => ({ ...prev, businessName: name }));
  };

  const setProductType = (type: string) => {
    setState(prev => ({ ...prev, productType: type }));
  };

  const setDeliveryType = (type: 'ship' | 'video' | '') => {
    setState(prev => ({ ...prev, deliveryType: type }));
  };

  const setProductName = (name: string) => {
    setState(prev => ({ ...prev, productName: name }));
  };

  const setProductPhotos = (photos: { url: string; name: string }[]) => {
    setState(prev => ({ ...prev, productPhotos: photos }));
  };

  const setVideoAssetLink = (link: string) => {
    setState(prev => ({ ...prev, videoAssetLink: link }));
  };

  const setBusinessIntroduction = (intro: string) => {
    setState(prev => ({ ...prev, businessIntroduction: intro }));
  };

  const addCoreSellingPoint = () => {
    if (state.remainingPoints > 0) {
      setState(prev => ({
        ...prev,
        coreSellingPoints: [...prev.coreSellingPoints, ''],
        remainingPoints: prev.remainingPoints - 1
      }));
    }
  };

  const removeCoreSellingPoint = (index: number) => {
    setState(prev => ({
      ...prev,
      coreSellingPoints: prev.coreSellingPoints.filter((_, i) => i !== index),
      remainingPoints: prev.remainingPoints + 1
    }));
  };

  const updateCoreSellingPoint = (index: number, value: string) => {
    setState(prev => ({
      ...prev,
      coreSellingPoints: prev.coreSellingPoints.map((point, i) => 
        i === index ? value : point
      )
    }));
  };

  const addAudience = () => {
    if (state.remainingAudiences > 0) {
      setState(prev => ({
        ...prev,
        coreAudiences: [...prev.coreAudiences, { title: '', description: '' }],
        remainingAudiences: prev.remainingAudiences - 1
      }));
    }
  };

  const removeAudience = (index: number) => {
    setState(prev => ({
      ...prev,
      coreAudiences: prev.coreAudiences.filter((_, i) => i !== index),
      remainingAudiences: prev.remainingAudiences + 1
    }));
  };

  const updateAudienceTitle = (index: number, value: string) => {
    setState(prev => ({
      ...prev,
      coreAudiences: prev.coreAudiences.map((audience, i) => 
        i === index ? { ...audience, title: value } : audience
      )
    }));
  };

  const updateAudienceDescription = (index: number, value: string) => {
    setState(prev => ({
      ...prev,
      coreAudiences: prev.coreAudiences.map((audience, i) => 
        i === index ? { ...audience, description: value } : audience
      )
    }));
  };

  const updateAudienceGenders = (genders: string[]) => {
    setState(prev => ({
      ...prev,
      audienceGenders: genders
    }));
  };

  const updateAudienceAges = (ages: string[]) => {
    setState(prev => ({
      ...prev,
      audienceAges: ages
    }));
  };

  const updateAudienceInterests = (interests: string) => {
    setState(prev => ({
      ...prev,
      audienceInterests: interests
    }));
  };

  const setWindowStartDate = (date: Date | null) => {
    setState(prev => ({
      ...prev,
      windowStartDate: date
    }));
  };

  const setWindowDueDate = (date: Date | null) => {
    setState(prev => ({
      ...prev,
      windowDueDate: date
    }));
  };

  const setLandingPageUrl = (url: string) => {
    setState(prev => ({
      ...prev,
      landingPageUrl: url
    }));
  };

  const setBudget = (budget: number) => {
    setState(prev => ({
      ...prev,
      budget
    }));
  };

  const setSelectedPlacements = (placements: string[]) => {
    setState(prev => ({
      ...prev,
      selectedPlacements: placements
    }));
  };

  const setSelectedLanguages = (languages: string[]) => {
    setState(prev => ({
      ...prev,
      selectedLanguages: languages
    }));
  };

  const setSelectedLocations = (locations: string[]) => {
    setState(prev => ({
      ...prev,
      selectedLocations: locations
    }));
  };

  const setProductExplainerVideo = (url: string) => {
    setState(prev => ({
      ...prev,
      productExplainerVideo: url
    }));
  };

  const addCustomBrandGuideline = () => {
    if (state.remainingGuidelines > 0) {
      setState(prev => ({
        ...prev,
        customBrandGuidelines: [...prev.customBrandGuidelines, ''],
        remainingGuidelines: prev.remainingGuidelines - 1
      }));
    }
  };

  const removeCustomBrandGuideline = (index: number) => {
    setState(prev => ({
      ...prev,
      customBrandGuidelines: prev.customBrandGuidelines.filter((_, i) => i !== index),
      remainingGuidelines: prev.remainingGuidelines + 1
    }));
  };

  const updateCustomBrandGuideline = (index: number, value: string) => {
    setState(prev => ({
      ...prev,
      customBrandGuidelines: prev.customBrandGuidelines.map((guideline, i) => 
        i === index ? value : guideline
      )
    }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <CampaignCreateContext.Provider
      value={{
        state,
        setCurrentStep,
        setTargetUrl,
        setAnalysisComplete,
        setThinkingSuccess,
        setShowStrategies,
        setSelectedStrategies,
        setBusinessLogo,
        setBusinessName,
        setProductType,
        setDeliveryType,
        setProductName,
        setProductPhotos,
        setVideoAssetLink,
        setBusinessIntroduction,
        addCoreSellingPoint,
        removeCoreSellingPoint,
        updateCoreSellingPoint,
        addAudience,
        removeAudience,
        updateAudienceTitle,
        updateAudienceDescription,
        updateAudienceGenders,
        updateAudienceAges,
        updateAudienceInterests,
        setWindowStartDate,
        setWindowDueDate,
        setLandingPageUrl,
        setBudget,
        setSelectedPlacements,
        setSelectedLanguages,
        setSelectedLocations,
        setProductExplainerVideo,
        addCustomBrandGuideline,
        removeCustomBrandGuideline,
        updateCustomBrandGuideline,
        resetState,
      }}
    >
      {children}
    </CampaignCreateContext.Provider>
  );
}

export function useCampaignCreate() {
  const context = useContext(CampaignCreateContext);
  if (context === undefined) {
    throw new Error('useCampaignCreate must be used within a CampaignCreateProvider');
  }
  return context;
} 