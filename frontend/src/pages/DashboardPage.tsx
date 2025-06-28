import React, { useState } from 'react';
import { Campaign } from '../types/campaign';
import { Influencer } from '../types/influencer';
import { InfluencerCard } from '../components/InfluencerCard';

// 模拟数据：用于开发测试的虚拟网红数据
const mockInfluencers: Influencer[] = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Mike Chen' },
  { id: '3', name: 'Emma Davis' },
];

// 定义组件的 props 类型
interface DashboardPageProps {
  campaign: Campaign;
}

// 定义标签页的类型：合作确认、内容审核、结果展示
type TabType = 'collaboration' | 'review' | 'result';

// 仪表盘页面组件
export function DashboardPage({ campaign }: DashboardPageProps) {
  // 使用 useState 管理当前激活的标签页
  const [activeTab, setActiveTab] = useState<TabType>('collaboration');

  // 处理接受网红申请的函数
  const handleAcceptInfluencer = (influencer: Influencer) => {
    console.log('Accept influencer:', influencer);
    // TODO: 实现接受逻辑
  };

  // 处理拒绝网红申请的函数
  const handleRejectInfluencer = (influencer: Influencer) => {
    console.log('Reject influencer:', influencer);
    // TODO: 实现拒绝逻辑
  };

  // 根据当前激活的标签页渲染对应的内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'collaboration':
        // 渲染合作确认标签页：显示网红列表
        return (
          <div className="space-y-4">
            {mockInfluencers.map((influencer) => (
              <InfluencerCard
                key={influencer.id}
                influencer={influencer}
                onAccept={handleAcceptInfluencer}
                onReject={handleRejectInfluencer}
              />
            ))}
          </div>
        );
      case 'review':
        // 渲染内容审核标签页（待实现）
        return (
          <div className="text-center text-gray-500 py-8">
            Content review section coming soon...
          </div>
        );
      case 'result':
        // 渲染结果展示标签页（待实现）
        return (
          <div className="text-center text-gray-500 py-8">
            Results section coming soon...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 活动标题和描述 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="text-gray-600 mt-2">{campaign.description}</p>
        </div>

        {/* 标签页导航 */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-16">
              <button
                onClick={() => setActiveTab('collaboration')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'collaboration'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Confirm collaboration
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'review'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Content review
              </button>
              <button
                onClick={() => setActiveTab('result')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'result'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Result
              </button>
            </nav>
          </div>
        </div>

        {/* 标签页内容区域 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 