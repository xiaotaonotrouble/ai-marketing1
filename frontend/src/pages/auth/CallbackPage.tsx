import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 1. 首先检查 URL hash 中的认证信息
        if (window.location.hash) {
          // 等待 Supabase 处理 hash 中的认证信息
          // Supabase 会自动处理 URL 中的 tokens 并设置 session
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 2. 获取会话状态
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          navigate('/auth/login');
          return;
        }

        if (session) {
          // 3. 如果有有效会话，重定向到 my-campaigns
          // 使用 replace 而不是 push，这样用户回退时不会回到 callback 页面
          navigate('/my-campaigns', { replace: true });
        } else {
          // 4. 如果没有有效会话，重定向到登录页面
          navigate('/auth/login', { replace: true });
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/auth/login', { replace: true });
      }
    };

    handleCallback();
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