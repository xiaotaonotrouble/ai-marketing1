import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (data: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  verifyOtp: (email: string, token: string, isPasswordReset: boolean, newPassword?: string) => Promise<void>;
  sendVerificationCode: (email: string, isPasswordReset: boolean) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化时检查用户状态
  useEffect(() => {
    // 获取当前会话用户
    const initializeAuth = async () => {
      try {
        // 检查当前会话
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // 监听认证状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 邮箱注册
  const handleSignUpWithEmail = async ({ email, password, firstName, lastName }: { 
    email: string; 
    password: string; 
    firstName?: string; 
    lastName?: string 
  }) => {
    try {
      setLoading(true);
      setError(null);
      const { user: newUser, error: signUpError } = await signUpWithEmail({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      
      if (signUpError) {
        throw signUpError;
      }

      setUser(newUser);
    } catch (error) {
      console.error('Error signing up:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to sign up');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 邮箱登录
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: newUser, error: signInError } = await signInWithEmail({ email, password });
      
      if (signInError) {
        throw signInError;
      }

      setUser(newUser);
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to sign in');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google登录
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error: signInError } = await signInWithGoogle();
      
      if (signInError) {
        throw signInError;
      }
      // Google登录会自动重定向，不需要手动设置用户
    } catch (error) {
      console.error('Error signing in with Google:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to sign in with Google');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 登出
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  // 清除错误
  const clearError = () => {
    setError(null);
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCode = async (email: string, isPasswordReset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Attempting to send ${isPasswordReset ? 'password reset' : 'signup'} verification code to:`, email);

      let response;
      if (isPasswordReset) {
        // 重置密码流程
        response = await supabase.auth.resetPasswordForEmail(email);
      } else {
        // 注册流程
        response = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          }
        });
      }

      console.log('Supabase response:', response);

      if (response.error) throw response.error;

      // 如果成功，显示提示
      alert(`If the email exists in our system, you will receive a ${isPasswordReset ? 'password reset' : 'verification'} code shortly.`);
    } catch (error) {
      console.error('Detailed error sending verification code:', error);
      setError(error instanceof Error ? error.message : 'Failed to send verification code');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, token: string, isPasswordReset: boolean = false, newPassword?: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Attempting to verify ${isPasswordReset ? 'password reset' : 'signup'} code`);

      let response;
      if (isPasswordReset && newPassword) {
        // 重置密码流程
        response = await supabase.auth.updateUser({
          password: newPassword
        });
      } else {
        // 注册流程
        response = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup'
        });
      }

      console.log('Verification response:', response);

      if (response.error) throw response.error;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error instanceof Error ? error.message : 'Failed to verify code');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signInWithGoogle: handleGoogleSignIn,
    signUpWithEmail: handleSignUpWithEmail,
    verifyOtp,
    sendVerificationCode,
    resetPassword,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 使用 Auth Context 的 Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 