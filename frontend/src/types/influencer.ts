export interface Influencer {
  id: string;
  name: string;
  platform?: string;
  videoUrl?: string;  // 用于内容审核
  status?: 'pending' | 'approved' | 'rejected';  // 内容审核状态
  // 结果指标
  metrics?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    sales: number;
    revenue: number;
  };
  followers_count?: number | null;
  engagement_rate?: number | null;
  average_likes?: number | null;
  average_comments?: number | null;
  content_category?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Collaboration {
  id: string;
  campaign_id: string;
  influencer_id: string;
  status: 'TBD' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
} 