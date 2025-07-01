import { supabase, TABLES } from '../lib/supabase'
import { Campaign } from '../types/campaign'

// 获取用户的所有活动
export async function getUserCampaigns() {
  try {
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    const { data, error } = await supabase
      .from(TABLES.CAMPAIGNS)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserCampaigns:', error);
    throw error;
  }
}

// 保存新的营销活动
export async function createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    // 添加用户ID到campaign数据
    const campaignWithUserId = {
      ...campaign,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from(TABLES.CAMPAIGNS)
      .insert(campaignWithUserId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
} 