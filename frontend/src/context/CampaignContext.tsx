import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Campaign } from '../types/campaign';
import { createCampaign } from '../services/campaign';

/**
 * Campaign Context的类型定义
 */
interface CampaignContextType {
  /** 当前的营销活动 */
  campaign: Campaign | null;
  /** 设置整个营销活动的函数 */
  setCampaign: (campaign: Campaign | null) => void;
  /** 更新营销活动部分字段的函数 */
  updateCampaign: (updates: Partial<Campaign>) => Promise<Campaign>;
  /** 清除当前营销活动的函数 */
  clearCampaign: () => void;
  /** 保存营销活动到数据库 */
  saveCampaign: (campaignToSave?: Campaign) => Promise<Campaign>;
  /** 保存活动时的加载状态 */
  isSaving: boolean;
  /** 保存时的错误信息 */
  saveError: Error | null;
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);

  // 更新营销活动部分字段
  const updateCampaign = (updates: Partial<Campaign>) => {
    return new Promise<Campaign>((resolve) => {
      console.log('updateCampaign received:', {
        ...updates,
        businessLogo: updates.businessLogo
      });
      
      let updatedCampaign: Campaign | null = null;
      
      setCampaign(prev => {
        // 如果之前没有campaign，创建一个新的，确保包含所有必需字段
        if (!prev) {
          const newCampaign: Campaign = {
            name: updates.name || '',
            status: updates.status || 'draft',
            businessLogo: updates.businessLogo || '',
            businessName: updates.businessName || '',
            productType: updates.productType || '',
            deliveryType: updates.deliveryType || '',
            productName: updates.productName || '',
            productPhotos: updates.productPhotos || [],
            videoAssetLink: updates.videoAssetLink || '',
            businessIntroduction: updates.businessIntroduction || '',
            coreSellingPoints: updates.coreSellingPoints || [],
            coreAudiences: updates.coreAudiences || [],
            audienceGenders: updates.audienceGenders || [],
            audienceAges: updates.audienceAges || [],
            audienceInterests: updates.audienceInterests || '',
            windowStartDate: updates.windowStartDate || null,
            windowDueDate: updates.windowDueDate || null,
            landingPageUrl: updates.landingPageUrl || '',
            selectedPlacements: updates.selectedPlacements || [],
            selectedLanguages: updates.selectedLanguages || [],
            selectedLocations: updates.selectedLocations || [],
          };

          console.log('Created new campaign with:', {
            ...newCampaign,
            businessLogo: newCampaign.businessLogo
          });
          updatedCampaign = newCampaign;
          return newCampaign;
        }

        // 如果有之前的campaign，合并更新
        const updated = {
          ...prev,
          ...updates,
        };
        console.log('Updated existing campaign with:', {
          ...updated,
          businessLogo: updated.businessLogo
        });
        updatedCampaign = updated;
        return updated;
      });

      // 使用 setTimeout 确保状态已更新
      setTimeout(() => {
        console.log('Campaign state after update:', {
          ...updatedCampaign,
          businessLogo: updatedCampaign?.businessLogo
        });
        resolve(updatedCampaign!);
      }, 0);
    });
  };

  // 清除营销活动
  const clearCampaign = () => {
    setCampaign(null);
    setSaveError(null);
  };

  // 保存营销活动到数据库
  const saveCampaign = async (campaignToSave?: Campaign) => {
    const targetCampaign = campaignToSave || campaign;
    
    if (!targetCampaign) {
      throw new Error('No campaign to save');
    }

    console.log('saveCampaign starting with:', {
      ...targetCampaign,
      businessLogo: targetCampaign.businessLogo
    });

    setIsSaving(true);
    setSaveError(null);

    try {
      // 从campaign中排除id和时间戳字段，但保留其他所有字段
      const { id, created_at, updated_at, ...campaignData } = targetCampaign;
      
      // 确保businessLogo被包含在要保存的数据中
      const dataToSave = {
        ...campaignData,
        businessLogo: targetCampaign.businessLogo // 显式包含businessLogo
      };
      
      console.log('saveCampaign prepared data:', {
        ...dataToSave,
        businessLogo: dataToSave.businessLogo
      });

      // 调用服务保存活动
      const savedCampaign = await createCampaign(dataToSave);
      
      // 更新本地状态
      setCampaign(savedCampaign);
      return savedCampaign;
    } catch (error) {
      console.error('Error saving campaign:', error);
      setSaveError(error as Error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // 提供Context值
  const value = {
    campaign,
    setCampaign,
    updateCampaign,
    clearCampaign,
    saveCampaign,
    isSaving,
    saveError,
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