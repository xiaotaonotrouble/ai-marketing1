import React from 'react';
import { Influencer } from '../types/influencer';

// 定义网红卡片组件的 props 类型
interface InfluencerCardProps {
  influencer: Influencer;          // 网红信息
  onAccept: (influencer: Influencer) => void;  // 接受网红的回调函数
  onReject: (influencer: Influencer) => void;  // 拒绝网红的回调函数
}

// 网红卡片组件：展示网红信息和操作按钮
export function InfluencerCard({ influencer, onAccept, onReject }: InfluencerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      {/* 左侧：网红信息区域 */}
      <div className="flex items-center space-x-4">
        {/* 头像占位符 */}
        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        {/* 网红名称 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{influencer.name}</h3>
        </div>
      </div>
      
      {/* 右侧：操作按钮区域 */}
      <div className="flex space-x-2">
        {/* 拒绝按钮 */}
        <button
          onClick={() => onReject(influencer)}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          Reject
        </button>
        {/* 接受按钮 */}
        <button
          onClick={() => onAccept(influencer)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
} 