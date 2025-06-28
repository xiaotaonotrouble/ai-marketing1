import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaignCreate } from '../context/CampaignCreateContext';

// 定义组件的props类型
interface CampaignCreateHeaderProps {
  title: string;  // 页面标题，如 "New Campaign"
  onNext?: () => void;  // 下一步按钮的点击处理函数
  canNext?: boolean;  // 是否可以进入下一步
}

export function CampaignCreateHeader({ title, onNext, canNext = true }: CampaignCreateHeaderProps) {
  const navigate = useNavigate();
  const { state } = useCampaignCreate();

  // 处理返回首页
  const handleClose = () => {
    navigate('/');  // 重定向到首页
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-50">
      <div className="flex items-center justify-between px-4 h-14">
        {/* 左侧：关闭按钮 */}
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full border border-transparent hover:border-gray-200 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 中间：Logo和标题 */}
        <div className="flex items-center space-x-2">
          {/* 临时Logo */}
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <h1 className="text-base font-medium">{title}</h1>
        </div>

        {/* 右侧：按钮组 */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-200 hover:border-gray-200 rounded-lg border hover:border focus:outline-none">
            Save draft
          </button>
          <button 
            onClick={onNext}
            disabled={!canNext}
            className={`px-4 py-1.5 text-sm text-white rounded-lg border focus:outline-none ${
              canNext 
                ? 'bg-orange-500 hover:bg-orange-600 border-orange-600 hover:border-orange-50 cursor-pointer' 
                : 'bg-gray-400 border-gray-500 cursor-not-allowed'
            }`}
          >
            {state.currentStep === 'setting' ? 'Release' : 'Next'}
          </button>
        </div>
      </div>
    </header>
  );
} 