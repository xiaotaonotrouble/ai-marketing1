-- 添加 influencers 表的插入权限
CREATE POLICY "Service role can insert influencers"
ON influencers FOR INSERT
TO service_role
WITH CHECK (true);

-- 添加 influencers 表的更新权限
CREATE POLICY "Service role can update influencers"
ON influencers FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true); 