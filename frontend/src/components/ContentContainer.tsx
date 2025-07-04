import React, { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
}

export function ContentContainer({ children }: ContentContainerProps) {
  return (
    <div className="max-w-7xl mx-auto mb-6">
      {/* 外层容器 */}
      <div className="bg-[#f2f2f2] rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-gray-200">
        {/* 头部：Logo和标题 */}
        <div className="px-8 py-3 flex items-center space-x-3">
          {/* AI 头像 */}
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <div className="flex items-center">
            <h3 className="font-semibold text-gray-900 text-sm">Max</h3>
            <span className="mx-2 text-gray-500">|</span>
            <p className="text-gray-500 text-xs">The world's first AI marketer</p>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="px-3 pb-3 pt-1">
          {children}
        </div>
      </div>
    </div>
  );
} 