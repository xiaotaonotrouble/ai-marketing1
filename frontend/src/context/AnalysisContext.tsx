import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WebsiteAnalysis } from '../services/api';

/**
 * 分析Context的类型定义
 */
interface AnalysisContextType {
  /** 当前的分析结果 */
  analysis: WebsiteAnalysis | null;
  /** 设置分析结果的函数 */
  setAnalysis: (analysis: WebsiteAnalysis | null) => void;
  /** 清除分析结果的函数 */
  clearAnalysis: () => void;
}

/**
 * 创建Analysis Context
 */
const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

/**
 * Analysis Provider Props类型定义
 */
interface AnalysisProviderProps {
  children: ReactNode;
}

/**
 * Analysis Provider组件
 * 提供分析结果的状态管理
 */
export function AnalysisProvider({ children }: AnalysisProviderProps) {
  // 使用useState管理分析结果
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);

  // 清除分析结果的函数
  const clearAnalysis = () => setAnalysis(null);

  // 提供Context值
  const value = {
    analysis,
    setAnalysis,
    clearAnalysis,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

/**
 * 使用Analysis Context的Hook
 * 在组件中获取和设置分析结果
 */
export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
} 