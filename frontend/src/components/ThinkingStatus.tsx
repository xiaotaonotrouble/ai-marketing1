import React from 'react';

interface ThinkingStatusProps {
  isSuccess: boolean | null;
  onStop?: () => void;
}

export function ThinkingStatus({ isSuccess, onStop }: ThinkingStatusProps) {
  // 如果状态为null，不显示任何内容
  if (isSuccess === null) return null;

  return (
    <div className={`flex items-center p-4 rounded-lg mb-4 ${
      isSuccess ? 'bg-green-50' : 'bg-orange-50'
    }`}>
      {/* Logo */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
        isSuccess ? 'bg-green-100' : 'bg-orange-100'
      }`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${isSuccess ? 'text-green-600' : 'text-orange-600'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isSuccess 
              ? "M5 13l4 4L19 7" // 成功图标
              : "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" // 思考图标
            }
          />
        </svg>
      </div>

      {/* 文字和动画点 */}
      <div className="flex items-center flex-1">
        <span className={`text-sm font-medium ${
          isSuccess ? 'text-green-600' : 'text-orange-600'
        }`}>
          {isSuccess ? 'Head finished thinking' : 'Head is thinking'}
        </span>
        {!isSuccess && (
          <span className="dots ml-1 text-orange-600">...</span>
        )}
      </div>

      {/* 添加停止按钮 */}
      {!isSuccess && onStop && (
        <button
          onClick={onStop}
          className="ml-4 p-1 rounded hover:bg-orange-100 transition-colors"
          title="Stop generating"
        >
          <svg className="w-4 h-4 text-orange-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
          </svg>
        </button>
      )}
    </div>
  );
} 