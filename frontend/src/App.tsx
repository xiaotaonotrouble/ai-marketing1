import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { DevelopStrategyPage } from './pages/campaign/DevelopStrategyPage';
import KeyMessagePage from './pages/campaign/KeyMessagePage';
import SettingPage from './pages/campaign/SettingPage';
import { AnalysisProvider } from './context/AnalysisContext';
import { CampaignProvider } from './context/CampaignContext';
import { CampaignCreateProvider } from './context/CampaignCreateContext';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { CallbackPage } from './pages/auth/CallbackPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import { TABLES } from './constants/tables';

// 受保护的路由包装器
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
}

// 公共路由包装器（已登录用户不能访问）
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/my-campaigns" />;
  }

  return <>{children}</>;
}

// 创建活动包装组件
function CampaignCreateWrapper() {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaignId');
  const isEdit = searchParams.get('isEdit') === '1';

  if (!campaignId) {
    return <div>Campaign ID is required</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="develop-strategy" element={<DevelopStrategyPage />} />
        <Route path="key-message" element={<KeyMessagePage />} />
        <Route path="setting" element={<SettingPage />} />
      </Routes>
    </div>
  );
}

function DashboardWrapper() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCampaign = async () => {
      if (!campaignId) return;

      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from(TABLES.CAMPAIGNS)
          .select('*')
          .eq('id', campaignId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Campaign not found');

        setCampaign(data);
      } catch (error) {
        console.error('Error loading campaign:', error);
        setError('Campaign not found');
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link
            to="/my-campaigns"
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

// 产品页面包装组件
function ProductWrapper() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/my-campaigns" element={<HomePage />} />
        <Route path="/campaign/:campaignId" element={<DashboardWrapper />} />
        <Route path="/campaign/create/*" element={<CampaignCreateWrapper />} />
      </Routes>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* 公共路由 */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 认证路由 */}
      <Route path="/auth">
        <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
        <Route path="forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="callback" element={<PublicRoute><CallbackPage /></PublicRoute>} />
      </Route>

      {/* 受保护的路由 */}
      <Route path="/*" element={
        <ProtectedRoute>
          <ProductWrapper />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <CampaignProvider>
          <AnalysisProvider>
            <CampaignCreateProvider>
              <AppRoutes />
            </CampaignCreateProvider>
          </AnalysisProvider>
        </CampaignProvider>
      </Router>
    </AuthProvider>
  );
}

export default App; 