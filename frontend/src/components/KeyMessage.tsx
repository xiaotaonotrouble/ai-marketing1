import React, { useState, useEffect, useRef } from 'react';
import { ContentContainer } from './ContentContainer';
import { ThinkingStatus } from './ThinkingStatus';
import { CoreSellingPoint } from './CoreSellingPoint';
import { Audience } from './Audience';
import { useCampaign } from '../context/CampaignContext';
import { useCampaignCreate } from '../context/CampaignCreateContext';
import '../styles/thinking.css';  // 导入动画样式
import { AudienceAdvancedSettings } from './AudienceAdvancedSettings';
import { supabase } from '../lib/supabase';

interface KeyMessageProps {
  onContentChange: (complete: boolean) => void;
}

const productTypeOptions = [
  'Web app',
  'Mobile app',
  'Desktop app',
  'Browser extensions',
  'Physical product'
];

export function KeyMessage({ onContentChange }: KeyMessageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { campaign } = useCampaign();
  const { 
    state, 
    setBusinessLogo, 
    setBusinessName, 
    setProductType,
    setDeliveryType,
    setProductName,
    setProductPhotos,
    setVideoAssetLink,
    setBusinessIntroduction,
    addCoreSellingPoint,
    removeCoreSellingPoint,
    updateCoreSellingPoint,
    addAudience,
    removeAudience,
    updateAudienceTitle,
    updateAudienceDescription,
    updateAudienceGenders,
    updateAudienceAges,
    updateAudienceInterests
  } = useCampaignCreate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 从 analysisResult 初始化数据
  useEffect(() => {
    console.log('Current state:', state);
    console.log('Analysis result:', state.analysisResult);
    
    if (state.analysisResult) {
      console.log('Business introduction:', state.analysisResult.business_intro);
      console.log('Core selling points:', state.analysisResult.core_selling_points);
      
      // 设置业务介绍
      if (!state.businessIntroduction && state.analysisResult.business_intro) {
        setBusinessIntroduction(state.analysisResult.business_intro);
      }
      
      // 设置核心卖点
      if (state.analysisResult.core_selling_points?.length > 0) {
        state.analysisResult.core_selling_points.forEach((point: string, index: number) => {
          updateCoreSellingPoint(index, point);
        });
      }

      // 设置核心受众
      if (state.analysisResult.core_audiences?.length > 0) {
        state.analysisResult.core_audiences.forEach((audience: { title: string; description: string }, index: number) => {
          if (index < state.coreAudiences.length) {
            updateAudienceTitle(index, audience.title);
            updateAudienceDescription(index, audience.description);
          }
        });
      }
    }
  }, [state.analysisResult]);

  // 检查表单是否完整
  useEffect(() => {
    const isBasicComplete = state.businessName.trim() !== '' && state.productType !== '';
    const isDeliveryComplete = state.deliveryType === 'video' ? 
      state.videoAssetLink.trim() !== '' :
      state.deliveryType === 'ship' ? 
        state.productName.trim() !== '' && state.productPhotos.length > 0 :
        false;
    const isIntroComplete = state.businessIntroduction.trim() !== '';
    // 只要有一个非空的卖点就算完成
    const isPointsComplete = state.coreSellingPoints.some(point => point.trim() !== '');
    // 修改为只要有一个完整的audience就算完成
    const isAudiencesComplete = state.coreAudiences.some(audience => 
      audience.title.trim() !== '' && audience.description.trim() !== ''
    );
    
    onContentChange(isBasicComplete && isDeliveryComplete && isIntroComplete && isPointsComplete && isAudiencesComplete);
  }, [
    state.businessName, 
    state.productType, 
    state.deliveryType,
    state.productName,
    state.productPhotos,
    state.videoAssetLink,
    state.businessIntroduction,
    state.coreSellingPoints,
    state.coreAudiences,
    onContentChange
  ]);

  // 模拟加载过程
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5秒后显示完成状态

    return () => clearTimeout(timer);
  }, []);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'image/svg+xml') {
      alert('Please upload an SVG file');
      return;
    }

    try {
      setIsUploading(true);
      console.log('Starting logo upload...');

      // 生成一个唯一的文件名
      const fileName = `${state.campaignId || 'temp'}_logo_${Date.now()}.svg`;
      console.log('Generated filename:', fileName);

      // 上传文件到 Supabase Storage
      const { data, error } = await supabase.storage
        .from('campaign-logos')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      // 获取文件的公共 URL
      const { data: { publicUrl } } = supabase.storage
        .from('campaign-logos')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);

      // 直接更新状态
      setBusinessLogo(publicUrl);
      console.log('Business logo state updated:', publicUrl);

    } catch (error) {
      console.error('Error uploading logo:', error);
      if (error instanceof Error) {
        alert(`Failed to upload logo: ${error.message}`);
      } else {
        alert('Failed to upload logo. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleProductPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload JPG, JPEG, or PNG files only');
        return;
      }

      if (file.size > maxSize) {
        alert('File size should not exceed 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProductPhotos([...state.productPhotos, { url: result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeProductPhoto = (index: number) => {
    setProductPhotos(state.productPhotos.filter((_, i) => i !== index));
  };

  return (
    <ContentContainer>
      <div className="min-h-[500px] space-y-2">
        <ThinkingStatus isSuccess={!isLoading} />
        
        {/* 基本信息表单 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* 标题 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {campaign?.name || 'New Campaign'}
          </h1>

          {/* 基本信息区域 */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Basic information</h2>

            {/* Logo上传区域 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Business logo
              </label>
              <div className="flex items-end gap-4">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  {state.businessLogo ? (
                    <img src={state.businessLogo} alt="Business logo" className="w-full h-full object-contain" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept=".svg"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-500">Only support uploading logos in SVG format.</p>
            </div>

            {/* 业务名称和产品类型 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 业务名称 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  Business name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={state.businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your business name"
                />
              </div>

              {/* 产品类型 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  Product / Service type
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={state.productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  {productTypeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 产品交付部分 */}
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Product delivery
              <span className="text-red-500 ml-1">*</span>
            </h2>

            {/* 交付方式选择 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-8">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={state.deliveryType === 'ship'}
                    onChange={() => setDeliveryType('ship')}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">I will ship the product</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={state.deliveryType === 'video'}
                    onChange={() => setDeliveryType('video')}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">I will share video assets with creators</span>
                </label>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {state.deliveryType === 'ship' ? (
                  <>
                    <p className="text-sm text-gray-600">
                      You will need to send products to each creator and provide necessary shipping information on the platform. Once they receive the products, they will begin creating content.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {/* 产品名称 */}
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          Product name
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={state.productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter product name"
                        />
                      </div>

                      {/* 产品照片 */}
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          Product photo
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center justify-between">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleProductPhotoUpload}
                            className="hidden"
                            id="product-photo-upload"
                            multiple
                          />
                          <label
                            htmlFor="product-photo-upload"
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Upload product photos</span>
                          </label>
                          <span className="text-xs text-gray-500">.JPG, .JPEG, or .PNG, 5MB Max.</span>
                        </div>
                        {/* 显示已上传的照片 */}
                        {state.productPhotos.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {state.productPhotos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <img src={photo.url} alt={photo.name} className="w-16 h-16 object-cover rounded" />
                                <button
                                  onClick={() => removeProductPhoto(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                                <span className="text-xs text-gray-500 mt-1 block truncate max-w-[64px]">{photo.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : state.deliveryType === 'video' ? (
                  <>
                    <p className="text-sm text-gray-600">
                      There is no need to send products to creators. Instead, they can utilize the video assets you provide and seamlessly integrate them into their content.
                    </p>
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={state.videoAssetLink}
                        onChange={(e) => setVideoAssetLink(e.target.value)}
                        className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Please enter video asset link"
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* 业务介绍部分 */}
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Business introduction
              <span className="text-red-500 ml-1">*</span>
            </h2>
            <div className="space-y-1">
              <textarea
                value={state.businessIntroduction}
                onChange={(e) => setBusinessIntroduction(e.target.value)}
                maxLength={500}
                className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Describe your business..."
              />
              <div className="text-right text-xs text-gray-400">
                {state.businessIntroduction.length} / 500
              </div>
            </div>
          </div>

          {/* 核心卖点部分 */}
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Core selling points
              <span className="text-red-500 ml-1">*</span>
            </h2>
            <div className="space-y-2">
              {state.coreSellingPoints.map((point, index) => (
                <CoreSellingPoint
                  key={index}
                  value={point}
                  onChange={(value) => updateCoreSellingPoint(index, value)}
                  onDelete={() => removeCoreSellingPoint(index)}
                  showDelete={state.coreSellingPoints.length > 1}
                />
              ))}
              {state.remainingPoints > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={addCoreSellingPoint}
                    className="p-2 text-orange-500 border border-transparent hover:bg-orange-50 rounded-full hover:border-orange-200 select-none h-[32px] w-[32px] flex items-center justify-center focus:outline-none"
                    title="Add selling point"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-500">({state.remainingPoints})</span>
                </div>
              )}
            </div>
          </div>

          {/* 核心受众部分 */}
          <div className="mt-8 space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-gray-900">
                Core Audiences
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-600">
                Please accurately define your core audience, as the information provided below will be used to help you optimize your audiences and match your brand with the most relevant influencers.
              </p>
            </div>
            <div className="space-y-3">
              {state.coreAudiences.map((audience, index) => (
                <Audience
                  key={index}
                  title={audience.title}
                  description={audience.description}
                  onTitleChange={(value) => updateAudienceTitle(index, value)}
                  onDescriptionChange={(value) => updateAudienceDescription(index, value)}
                  onDelete={() => removeAudience(index)}
                  showDelete={state.coreAudiences.length > 1}
                  index={index + 1}
                />
              ))}
              {state.remainingAudiences > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={addAudience}
                    className="p-2 text-orange-500 border border-transparent hover:bg-orange-50 rounded-full hover:border-orange-200 select-none h-[32px] w-[32px] flex items-center justify-center focus:outline-none"
                    title="Add audience"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-500">({state.remainingAudiences})</span>
                </div>
              )}

              {/* Advanced Settings */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <AudienceAdvancedSettings
                  selectedGenders={state.audienceGenders}
                  selectedAges={state.audienceAges}
                  interests={state.audienceInterests}
                  onGenderChange={updateAudienceGenders}
                  onAgeChange={updateAudienceAges}
                  onInterestChange={updateAudienceInterests}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
} 