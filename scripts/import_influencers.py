import pandas as pd
import os
from supabase import create_client, Client

# Supabase 配置
# url: str = os.environ.get("VITE_SUPABASE_URL")
# key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")

url: str = "https://ewwpbyetwfveqmtginmg.supabase.co"
# 注意：这里需要使用 service_role key 而不是 anon key
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3d3BieWV0d2Z2ZXFtdGdpbm1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTE1ODgxNiwiZXhwIjoyMDY2NzM0ODE2fQ.LQnsnbFBARPyOzk1PimVN3qfGqOh6WomsoPO7Klr9ws"

if not url or not key:
    raise ValueError("请设置 SUPABASE_URL 和 SUPABASE_KEY 环境变量")

supabase: Client = create_client(url, key)

def import_influencers():
    # 读取 Excel 文件
    df = pd.read_excel('./frontend/public/1000个达人数据(1).xlsx')
    
    # 处理数据
    influencers = []
    for _, row in df.iterrows():
        influencer = {
            'id': int(row['用户ID']),
            'name': str(row['用户名']),
            'platform': "TikTok",
            'email': str(row['邮箱']),
            'fans_age_range': str(row['粉丝年龄区间']).split(';') if not pd.isna(row['粉丝年龄区间']) else [],
            'followers_count': int(row['粉丝数']) if not pd.isna(row['粉丝数']) else None,
            'content_category': str(row['带货品类']).split(';') if not pd.isna(row['带货品类']) else [],
            'GMV': int(row['具体GMV']),
        }
        influencers.append(influencer)
    
    # 批量插入数据
    try:
        result = supabase.table('influencers').insert(influencers).execute()
        print(f"Successfully imported {len(influencers)} influencers")
        return result
    except Exception as e:
        print(f"Error importing influencers: {e}")
        return None

if __name__ == "__main__":
    import_influencers() 