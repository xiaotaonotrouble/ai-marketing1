import { WebsiteAnalysis, MarketingStrategy } from '../services/api';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;
  budget?: number;
  targetAudience?: string;
  productUrl?: string;
  // 分析结果
  analysis?: WebsiteAnalysis;
  // 选中的营销策略
  selectedStrategies?: MarketingStrategy[];
  // 基本信息
  businessLogo?: string;
  businessName: string;
  productType: string;
  // 产品交付
  deliveryType: 'ship' | 'video' | '';
  productName: string;
  productPhotos: { url: string; name: string }[];
  videoAssetLink: string;
  // 业务介绍
  businessIntroduction: string;
  // 核心卖点
  coreSellingPoints: string[];
  // 核心受众
  coreAudiences: {
    title: string;
    description: string;
  }[];
  audienceGenders: string[];
  audienceAges: string[];
  audienceInterests: string;
  // 发布时间窗口
  windowStartDate: Date | null;
  windowDueDate: Date | null;
  landingPageUrl: string;

  // 投放设置
  selectedPlacements: string[];
  selectedLanguages: string[];
  selectedLocations: string[];
} 