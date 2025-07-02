import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthResponse } from '@supabase/supabase-js';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (data: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<AuthResponse>;
  sendVerificationCode: (email: string, isPasswordReset: boolean) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  completeSignUp: () => Promise<User | null>;
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
        // Get signup data from localStorage
        const signupDataStr = localStorage.getItem('signupData');
        if (!signupDataStr) {
          throw new Error('No signup data found');
        }
        const signupData = JSON.parse(signupDataStr);

        // 使用 signInWithOtp 并指定 signup 类型来触发 Confirm signup 模板
        response = await supabase.auth.signInWithOtp({
          email: signupData.email,
          options: {
            shouldCreateUser: true,
            data: {
              first_name: signupData.firstName,
              last_name: signupData.lastName,
              password: signupData.password // 临时存储密码，验证后使用
            }
          }
        });

        // If signup successful, store email for verification page
        if (!response.error) {
          localStorage.setItem('verificationEmail', signupData.email);
          // Navigate to verification page
          window.location.href = '/auth/verify-email';
        }
      }

      console.log('Supabase response:', response);

      if (response.error) throw response.error;
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError(error instanceof Error ? error.message : 'Failed to send verification code');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    try {
      setLoading(true);
      setError(null);

      // 验证 OTP
      const response = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'  // 指定这是注册流程的验证
      });

      console.log('Verification response:', response);

      if (response.error) throw response.error;

      // After successful verification, we'll complete the signup in a separate step
      return response;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error instanceof Error ? error.message : 'Failed to verify code');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get stored signup data
      const signupDataStr = localStorage.getItem('signupData');
      if (!signupDataStr) {
        throw new Error('No signup data found');
      }

      const signupData = JSON.parse(signupDataStr);
      
      // Create the user with the stored data
      const { data: { session }, error: signUpError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName
          }
        }
      });

      if (signUpError) throw signUpError;

      // Clear signup data
      localStorage.removeItem('signupData');
      localStorage.removeItem('verificationEmail');

      // Set the user from the session
      if (session?.user) {
        setUser(session.user);
        return session.user;
      }
      
      return null;
    } catch (error) {
      console.error('Error completing signup:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete signup');
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
    completeSignUp
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