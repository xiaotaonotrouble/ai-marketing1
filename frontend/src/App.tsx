import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { DevelopStrategyPage } from './pages/campaign/DevelopStrategyPage';
import KeyMessagePage from './pages/campaign/KeyMessagePage';
import SettingPage from './pages/campaign/SettingPage';
import { Campaign } from './types/campaign';
import { AnalysisProvider } from './context/AnalysisContext';
import { CampaignProvider } from './context/CampaignContext';
import { CampaignCreateProvider } from './context/CampaignCreateContext';

// 临时数据，后续会从 API 获取
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Campaign 2024',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
    description: 'Summer promotion for our new product line',
    budget: 5000,
    businessName: 'Summer Fashion',
    productType: 'Clothing',
    deliveryType: 'ship',
    productName: 'Summer Collection 2024',
    productPhotos: [
      { url: 'photo1.jpg', name: 'Summer Collection Front' },
      { url: 'photo2.jpg', name: 'Summer Collection Back' }
    ],
    videoAssetLink: 'https://example.com/video',
    businessIntroduction: 'Leading fashion brand for summer wear',
    coreSellingPoints: ['Comfortable', 'Stylish', 'Affordable'],
    coreAudiences: [
      { title: 'Young Adults', description: 'Fashion-conscious young professionals' }
    ],
    audienceGenders: ['Female', 'Male'],
    audienceAges: ['18-24', '25-34'],
    audienceInterests: 'Fashion, Summer, Beach lifestyle'
  },
  {
    id: '2',
    name: 'New Product Launch',
    status: 'draft',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
    description: 'Launch campaign for new product',
    businessName: 'Tech Innovations',
    productType: 'Electronics',
    deliveryType: 'ship',
    productName: 'Smart Watch Pro',
    productPhotos: [
      { url: 'watch1.jpg', name: 'Smart Watch Pro Main' }
    ],
    videoAssetLink: '',
    businessIntroduction: 'Innovative tech company',
    coreSellingPoints: ['Advanced Features', 'Long Battery Life'],
    coreAudiences: [
      { title: 'Tech Enthusiasts', description: 'Early adopters of technology' }
    ],
    audienceGenders: ['Female', 'Male'],
    audienceAges: ['25-34', '35-44'],
    audienceInterests: 'Technology, Fitness, Gadgets'
  }
];

function DashboardWrapper() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const campaign = mockCampaigns.find(c => c.id === campaignId);

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link
            to="/"
            className="py-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Campaigns
          </Link>
        </div>
      </header>
      <DashboardPage campaign={campaign} />
    </>
  );
}

function App() {
  return (
    <CampaignProvider>
      <AnalysisProvider>
        <CampaignCreateProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<HomePage campaigns={mockCampaigns} />} />
                <Route path="/campaign/:campaignId" element={<DashboardWrapper />} />
                <Route path="/campaign/create/develop-strategy" element={<DevelopStrategyPage />} />
                <Route path="/campaign/create/key-message" element={<KeyMessagePage />} />
                <Route path="/campaign/create/setting" element={<SettingPage />} />
              </Routes>
            </div>
          </Router>
        </CampaignCreateProvider>
      </AnalysisProvider>
    </CampaignProvider>
  );
}

export default App; 