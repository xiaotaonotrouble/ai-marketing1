import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Campaign } from '../types/campaign';

/**
 * Campaign Context的类型定义
 */
interface CampaignContextType {
  /** 当前的营销活动 */
  campaign: Campaign | null;
  /** 设置整个营销活动的函数 */
  setCampaign: (campaign: Campaign | null) => void;
  /** 更新营销活动部分字段的函数 */
  updateCampaign: (updates: Partial<Campaign>) => void;
  /** 清除当前营销活动的函数 */
  clearCampaign: () => void;
}

/**
 * 创建Campaign Context
 */
const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

/**
 * Campaign Provider Props类型定义
 */
interface CampaignProviderProps {
  children: ReactNode;
}

/**
 * Campaign Provider组件
 * 提供营销活动的状态管理
 */
export function CampaignProvider({ children }: CampaignProviderProps) {
  // 使用useState管理营销活动
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  // 更新营销活动部分字段
  const updateCampaign = (updates: Partial<Campaign>) => {
    setCampaign(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  };

  // 清除营销活动
  const clearCampaign = () => setCampaign(null);

  // 提供Context值
  const value = {
    campaign,
    setCampaign,
    updateCampaign,
    clearCampaign,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
}

/**
 * 使用Campaign Context的Hook
 * 在组件中获取和设置营销活动数据
 */
export function useCampaign() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
} 