from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import json
from typing import Optional, List, Dict
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter
import os
from dotenv import load_dotenv
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 加载环境变量
load_dotenv()

# 检查API密钥
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
if not DEEPSEEK_API_KEY:
    logger.error("❌ DEEPSEEK_API_KEY not found in environment variables")
    raise Exception("DEEPSEEK_API_KEY not found in environment variables")

app = FastAPI()

# 配置允许的域名
allowed_origins = [
    "http://localhost:5173",  # 本地开发环境
    "https://ai-marketing1.vercel.app",  # Vercel 生产环境
    "https://ai-marketing1-git-main-xiaotaonotrouble.vercel.app",  # Vercel main 分支预览
    "https://ai-marketing1-xiaotaonotrouble.vercel.app",  # Vercel 部署预览
    "https://ai-marketing1.vercel.app",  # Vercel 生产环境（无子域名）
]

# 如果环境变量中有额外的允许域名，添加到列表中
additional_origins = os.getenv('ADDITIONAL_ALLOWED_ORIGINS')
if additional_origins:
    allowed_origins.extend(additional_origins.split(','))

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # 允许的域名列表
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有请求头
)

class UrlRequest(BaseModel):
    url: str

class Audience(BaseModel):
    title: str
    description: str

class WebsiteAnalysis(BaseModel):
    business_intro: str
    core_selling_points: List[str]
    core_audiences: List[Audience]
    error: Optional[str] = None

# 创建带重试机制的会话
def create_retry_session():
    session = requests.Session()
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "POST"]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session

# 获取网页内容
def fetch_website_content(url: str) -> Optional[str]:
    try:
        # 如果URL不包含协议，添加https://
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url

        logger.info(f"正在获取网页内容: {url}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive'
        }
        
        session = create_retry_session()
        response = session.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        logger.info("✅ 成功获取网页内容")
        return response.text
    except Exception as e:
        logger.error(f"❌ 网站访问失败: {str(e)}")
        raise HTTPException(status_code=400, detail=f"无法访问网站: {str(e)}")

# 从HTML内容中提取关键信息
def extract_content(html_content: str) -> Optional[Dict[str, str]]:
    try:
        logger.info("正在提取网页内容...")
        
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # 提取标题
        title = soup.title.string if soup.title else "无标题"
        logger.info(f"提取到标题: {title}")
        
        # 提取元描述
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        description = meta_desc['content'] if meta_desc else ""
        
        # 提取主要内容
        article = soup.find('article')
        if article:
            content = article.get_text(separator=' ', strip=True)
        else:
            # 尝试找常见内容容器
            content_selectors = [
                '.main-content', '#content', '.article-body', 
                '.post-content', '.entry-content', '.content'
            ]
            for selector in content_selectors:
                container = soup.select_one(selector)
                if container:
                    content = container.get_text(separator=' ', strip=True)
                    break
            else:
                # 提取所有段落
                paragraphs = soup.find_all('p')
                content = ' '.join(p.get_text(strip=True) for p in paragraphs)
        
        # 限制内容长度
        content = content[:5000] if content else ""
        logger.info(f"提取到内容长度: {len(content)} 字符")
        
        return {
            "title": title,
            "description": description,
            "content": content
        }
    except Exception as e:
        logger.error(f"❌ 内容提取失败: {str(e)}")
        raise HTTPException(status_code=400, detail=f"内容提取失败: {str(e)}")

# 使用DeepSeek API生成总结
async def generate_summary_with_ai(title: str, content: str) -> Dict:
    try:
        logger.info("正在调用DeepSeek API生成总结...")
        
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""
        你是一个专业的市场营销AI助手。请根据以下网页内容生成详细的分析报告:
        
        网页标题: {title}
        
        网页内容摘要: {content[:3000] if content else "无内容"}
        
        请严格按以下JSON格式返回结果:
        {{
            "business_intro": "品牌/业务简介 (1-2句话)",
            "core_selling_points": [
                "核心卖点1",
                "核心卖点2",
                "核心卖点3",
                "核心卖点4",
                "核心卖点5"
            ],
            "core_audiences": [
                {{
                    "title": "受众群体1标题",
                    "description": "受众群体1描述 (1-2句话)"
                }},
                {{
                    "title": "受众群体2标题",
                    "description": "受众群体2描述 (1-2句话)"
                }},
                {{
                    "title": "受众群体3标题",
                    "description": "受众群体3描述 (1-2句话)"
                }}
            ]
        }}
        """
        
        data = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 1000,
            "response_format": {"type": "json_object"}
        }
        
        session = create_retry_session()
        response = session.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=45
        )
        
        if response.status_code != 200:
            error_msg = f"API错误 ({response.status_code}): {response.text}"
            logger.error(f"❌ {error_msg}")
            raise HTTPException(status_code=response.status_code, detail=error_msg)
        
        ai_response = response.json()
        content_str = ai_response['choices'][0]['message']['content']
        
        try:
            result = json.loads(content_str)
            logger.info("✅ 成功生成AI总结")
            return result
        except json.JSONDecodeError:
            cleaned = content_str.replace('```json', '').replace('```', '').strip()
            result = json.loads(cleaned)
            logger.info("✅ 成功生成AI总结（清理后）")
            return result
            
    except Exception as e:
        error_msg = f"AI处理失败: {str(e)}"
        logger.error(f"❌ {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/api/analyze", response_model=WebsiteAnalysis)
async def analyze_website(request: UrlRequest):
    try:
        logger.info(f"收到分析请求: {request.url}")
        
        # 1. 获取网页内容
        html_content = fetch_website_content(request.url)
        if not html_content:
            raise HTTPException(status_code=400, detail="无法获取网页内容")
        
        # 2. 提取内容
        extracted = extract_content(html_content)
        if not extracted:
            raise HTTPException(status_code=400, detail="无法提取网页内容")
        
        # 3. 生成AI总结
        result = await generate_summary_with_ai(extracted["title"], extracted["content"])
        logger.info("✅ 分析完成")
        return result
        
    except HTTPException as e:
        logger.error(f"❌ HTTP异常: {e.detail}")
        raise e
    except Exception as e:
        error_msg = f"处理过程中出错: {str(e)}"
        logger.error(f"❌ {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg) 