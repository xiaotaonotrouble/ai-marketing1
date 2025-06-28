import React, { useState, useRef, useEffect } from 'react';
import { ContentContainer } from './ContentContainer';
import { analyzeWebsite, MarketingStrategy } from '../services/api';
import { useAnalysis } from '../context/AnalysisContext';
import { useCampaign } from '../context/CampaignContext';
import { useCampaignCreate } from '../context/CampaignCreateContext';
import { useNavigate } from 'react-router-dom';
import '../styles/thinking.css';  // 导入动画样式
import { MarketingStrategies } from './MarketingStrategies';
import { ThinkingStatus } from './ThinkingStatus';

interface UrlBoxProps {
  onGenerate: (url: string) => void;
}

// 停止图标组件
function StopIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
    </svg>
  );
}

export function UrlBox({ onGenerate }: UrlBoxProps) {
  const { campaign, updateCampaign } = useCampaign();
  const { state, setTargetUrl, setAnalysisComplete, setThinkingSuccess, setShowStrategies, setSelectedStrategies } = useCampaignCreate();
  const [url, setUrl] = useState(state.targetUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAnalysis, clearAnalysis } = useAnalysis();
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);

  // 当 context 中的 URL 改变时更新输入框
  useEffect(() => {
    setUrl(state.targetUrl);
  }, [state.targetUrl]);

  // 重置状态
  const resetState = () => {
    setIsLoading(false);
    setError(null);
    setThinkingSuccess(null);
    setShowStrategies(false);
    setSelectedStrategies([]);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // 处理停止生成
  const handleStop = () => {
    resetState();
    clearAnalysis(); // 清除分析结果
    // 清除Campaign中的分析结果和策略
    updateCampaign({
      analysis: undefined,
      selectedStrategies: [],
      productUrl: '' // 同时清除产品URL
    });
  };

  const handleStrategySelect = (strategies: MarketingStrategy[]) => {
    const selectedOnes = strategies.filter(s => s.selected);
    setSelectedStrategies(selectedOnes);
    // 更新Campaign Context中的策略
    updateCampaign({
      selectedStrategies: selectedOnes
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // 如果正在加载，点击按钮就停止
    if (isLoading) {
      handleStop();
      return;
    }

    setIsLoading(true);
    setError(null);
    setThinkingSuccess(false);
    setShowStrategies(false);
    setSelectedStrategies([]);

    // 创建新的AbortController
    abortControllerRef.current = new AbortController();

    try {
      const analysis = await analyzeWebsite(
        url.trim(),
        abortControllerRef.current.signal
      );
      
      // 如果请求已经被中止，不要继续处理结果
      if (!abortControllerRef.current) {
        return;
      }

      if (analysis.error) {
        setError(analysis.error);
        setThinkingSuccess(null);
      } else {
        setThinkingSuccess(true);
        setAnalysis(analysis);
        setTargetUrl(url.trim());
        setAnalysisComplete(true, analysis);
        // 更新Campaign Context
        updateCampaign({
          productUrl: url.trim(),
          analysis: analysis
        });
        onGenerate(url.trim());
        // 显示策略选择
        setTimeout(() => {
          // 再次检查是否已被中止
          if (abortControllerRef.current) {
            setShowStrategies(true);
          }
        }, 500);
      }
    } catch (err) {
      // 如果是用户主动取消，不显示错误
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : '分析网站时出错');
      setThinkingSuccess(null);
    } finally {
      // 只有在不是 AbortError 的情况下才重置 isLoading
      if (!(abortControllerRef.current === null)) {
        setIsLoading(false);
      }
    }
  };

  return (
    <ContentContainer>
      {/* 内层白色容器 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* 内容区：消息和输入框 */}
        <div className="p-5">
          {/* 思考状态显示 */}
          <ThinkingStatus 
            isSuccess={state.thinkingSuccess} 
            onStop={isLoading ? handleStop : undefined}
          />

          {/* AI 消息 */}
          <p className="text-gray-700 text-sm mb-6">
            Hello User, I'm Head, your dedicated AI marketer. Happy to partner with you to create and implement strategies that will drive your product / service growth. Simply enter a website here and see what I can do for you.
          </p>

          {/* 输入框 */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 flex bg-white rounded-lg border border-gray-300">
                <div className="bg-gray-50 px-3 py-2 rounded-l-lg border-r border-gray-300">
                  <span className="text-gray-500 text-sm">https://</span>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your product website, Amazon product link, Shopify product link, TikTok Shop link, etc."
                  className="flex-1 px-4 py-2 focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className={`px-6 py-2 text-sm rounded-lg transition-colors flex items-center justify-center min-w-[100px] ${
                  isLoading 
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {isLoading ? <StopIcon /> : 'Generate'}
              </button>
            </div>
            
            {/* 错误信息 */}
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* 显示策略选择 */}
      {state.showStrategies && (
        <MarketingStrategies onStrategySelect={handleStrategySelect} />
      )}
    </ContentContainer>
  );
} 