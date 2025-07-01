-- 创建 influencers 表
CREATE TABLE influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  platform VARCHAR NOT NULL,
  followers_count INTEGER,
  engagement_rate DECIMAL(5,2),
  average_likes INTEGER,
  average_comments INTEGER,
  content_category VARCHAR[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建 collaborations 表
CREATE TABLE collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('TBD', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- 确保一个 influencer 只能与一个 campaign 建立一次合作关系
  UNIQUE(campaign_id, influencer_id)
);

-- 设置 RLS 策略
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

-- influencers 表的 RLS 策略
CREATE POLICY "Influencers are viewable by everyone"
ON influencers FOR SELECT
TO authenticated
USING (true);

-- collaborations 表的 RLS 策略
CREATE POLICY "Users can view collaborations for their campaigns"
ON collaborations FOR SELECT
TO authenticated
USING (
  campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert collaborations for their campaigns"
ON collaborations FOR INSERT
TO authenticated
WITH CHECK (
  campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update collaborations for their campaigns"
ON collaborations FOR UPDATE
TO authenticated
USING (
  campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  )
); 