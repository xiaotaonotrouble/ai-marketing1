import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CampaignSuccessModalProps {
  isOpen: boolean;
}

export function CampaignSuccessModal({ isOpen }: CampaignSuccessModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* 弹窗容器: max-w-4xl (896px) 可以调整为 max-w-5xl (1024px) 或 max-w-6xl (1152px) 来增加宽度 */}
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-2 relative">
        <div className="flex gap-8">
          {/* 左侧图片容器: w-1/3 (33.333%) 可以调整为 w-1/4 (25%) 或 w-1/2 (50%) 来改变图片区域占比 */}
          <div className="w-1/4 flex items-center justify-center">
            {/* 图片尺寸: w-full h-auto 可以通过 max-h-[200px] 之类的方式限制高度 */}
            <img 
              src="/rainbow-svgrepo-com.svg" 
              alt="Celebration" 
              className="w-full h-auto"
            />
          </div>

          {/* 右侧文本容器: w-2/3 (66.666%) 会随着左侧的改变自动调整 */}
          <div className="w-2/3 flex flex-col justify-center">
            {/* 文本容器的间距: space-y-6 可以调整为 space-y-4 或 space-y-8 来改变元素间距 */}
            <div className="space-y-6">
              {/* 标题文字大小: text-2xl 可以调整为 text-3xl 等来改变大小 */}
              <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                Congratulations! <br />
              </h2>
              <h2 className="text-xl  text-gray-900 leading-relaxed">
                Your campaign is created and will receive influencer applications within 24-48 hours after review.
              </h2>
              {/* 副标题文字大小: text-lg 可以调整为 text-xl 等来改变大小 */}
              {/* <p className="text-gray-600 text-lg">
                In the meantime, get an overview of essentials of Head to help you maximize your success
              </p> */}
            </div>

            {/* 按钮容器: mt-8 可以调整为 mt-6 或 mt-10 来改变与上方文本的间距 */}
            <div className="mt-10">
              <button
                onClick={() => navigate('/my-campaigns')}
                className="px-8 py-4 bg-orange-500 text-white rounded-lg text-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Back to My Campaigns
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 