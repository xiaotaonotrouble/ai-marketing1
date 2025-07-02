import { createClient } from '@supabase/supabase-js'

// 创建 Supabase 客户端实例
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 导出常用的数据库表名
export const TABLES = {
  CAMPAIGNS: 'campaigns',
  INFLUENCERS: 'influencers',
  COLLABORATIONS: 'collaborations',
} as const 