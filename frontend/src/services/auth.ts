import { supabase } from '../lib/supabase';
import { AuthError, User } from '@supabase/supabase-js';

interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface SignInData {
  email: string;
  password: string;
}

// 邮箱注册
export async function signUpWithEmail({
  email,
  password,
  firstName,
  lastName,
}: SignUpData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user,
      error: null,
    };
  } catch (error) {
    console.error('Error in signUpWithEmail:', error);
    return {
      user: null,
      error: error as AuthError,
    };
  }
}

// 邮箱登录
export async function signInWithEmail({
  email,
  password,
}: SignInData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user,
      error: null,
    };
  } catch (error) {
    console.error('Error in signInWithEmail:', error);
    return {
      user: null,
      error: error as AuthError,
    };
  }
}

// Google 登录
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    // 根据环境确定重定向 URL
    const redirectTo = import.meta.env.DEV 
      ? 'http://localhost:5173/my-campaigns'
      : 'https://ai-marketing1.vercel.app/my-campaigns';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      throw error;
    }

    // OAuth 会重定向，所以这里返回 null
    return {
      user: null,
      error: null,
    };
  } catch (error) {
    console.error('Error in signInWithGoogle:', error);
    return {
      user: null,
      error: error as AuthError,
    };
  }
}

// 重置密码
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return { error: error as AuthError };
  }
}

// 更新用户信息
export async function updateUserProfile(
  userId: string,
  updates: { first_name?: string; last_name?: string }
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { error: error as Error };
  }
} 