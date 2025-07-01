import React, { useState } from 'react';
import { Campaign } from '../types/campaign';
import { Influencer } from '../types/influencer';
import { InfluencerCard } from '../components/InfluencerCard';
import { ContentReviewCard } from '../components/ContentReviewCard';
import { ResultCard } from '../components/ResultCard';

// 模拟数据：用于开发测试的虚拟网红数据
const mockInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    platform: 'TikTok',
    followers_count: 1200000,
    engagement_rate: 4.5,
    average_likes: 50000,
    average_comments: 2000,
    content_category: ['Fashion', 'Lifestyle']
  },
  {
    id: '2',
    name: 'Mike Chen',
    platform: 'Instagram',
    followers_count: 800000,
    engagement_rate: 3.8,
    average_likes: 35000,
    average_comments: 1500,
    content_category: ['Food', 'Travel']
  },
  {
    id: '3',
    name: 'Emma Davis',
    platform: 'YouTube',
    followers_count: 2000000,
    engagement_rate: 5.2,
    average_likes: 150000,
    average_comments: 8000,
    content_category: ['Beauty', 'Wellness']
  },
];

// 模拟数据：内容审核数据
const mockContentReviews: Influencer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    platform: 'TikTok',
    videoUrl: 'https://www.tiktok.com/@sarahjohnson/video/1234567890',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Mike Chen',
    platform: 'Instagram',
    videoUrl: 'https://www.instagram.com/p/abcdef123/',
    status: 'pending'
  }
];

// 模拟数据：结果数据
const mockResults: Influencer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    platform: 'TikTok',
    metrics: {
      views: 1500000,
      likes: 250000,
      comments: 15000,
      shares: 50000,
      sales: 1200,
      revenue: 35000
    }
  },
  {
    id: '2',
    name: 'Mike Chen',
    platform: 'Instagram',
    metrics: {
      views: 800000,
      likes: 120000,
      comments: 8000,
      shares: 25000,
      sales: 800,
      revenue: 24000
    }
  }
];

// 定义组件的 props 类型
interface DashboardPageProps {
  campaign: Campaign;
}

// 定义标签页的类型
type TabType = 'collaboration' | 'review' | 'result';

// 仪表盘页面组件
export function DashboardPage({ campaign }: DashboardPageProps) {
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

  // 处理内容审核的函数
  const handleApproveContent = (influencer: Influencer) => {
    console.log('Approve content:', influencer);
    // TODO: 实现内容审核通过逻辑
  };

  const handleRejectContent = (influencer: Influencer) => {
    console.log('Reject content:', influencer);
    // TODO: 实现内容审核拒绝逻辑
  };

  // 根据当前激活的标签页渲染对应的内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'collaboration':
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
        return (
          <div className="space-y-4">
            {mockContentReviews.map((influencer) => (
              <ContentReviewCard
                key={influencer.id}
                influencer={influencer}
                onApprove={handleApproveContent}
                onReject={handleRejectContent}
              />
            ))}
          </div>
        );
      case 'result':
        return (
          <div className="space-y-4">
            {mockResults.map((influencer) => (
              <ResultCard
                key={influencer.id}
                influencer={influencer}
              />
            ))}
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
          <p className="text-gray-600 mt-2">{campaign.businessName}</p>
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
                    ? 'border-orange-500 text-orange-600'
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
                    ? 'border-orange-500 text-orange-600'
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
                    ? 'border-orange-500 text-orange-600'
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