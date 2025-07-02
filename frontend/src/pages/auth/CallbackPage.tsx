import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase 会自动处理 URL 中的认证信息
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // 如果成功获取到会话，重定向到 my-campaigns 页面
        navigate('/my-campaigns');
      } else {
        // 如果没有会话，重定向到登录页面
        navigate('/auth/login');
      }
    });
  }, [navigate]);

  // 显示加载状态
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
} 