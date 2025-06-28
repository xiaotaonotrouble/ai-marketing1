/**
 * API类型定义和服务函数
 * 这个文件处理与后端API的所有交互
 */

/**
 * 网站分析结果的接口定义
 * 与后端FastAPI的响应模型对应
 */
export interface WebsiteAnalysis {
  /** 业务/品牌简介 */
  business_intro: string;
  /** 核心卖点列表 */
  core_selling_points: string[];
  /** 目标受众群体 */
  core_audiences: {
    /** 受众群体标题 */
    title: string;
    /** 受众群体描述 */
    description: string;
  }[];
  /** 可选的错误信息 */
  error?: string;
}

/**
 * 营销策略类型定义
 */
export interface MarketingStrategy {
  /** 策略类型 */
  type: string;
  /** 策略描述 */
  description: string;
  /** 策略目标 */
  goal: string;
  /** 是否选中 */
  selected?: boolean;
}

/**
 * 获取API基础URL
 * 根据当前环境自动选择协议和主机
 */
function getBaseUrl(): string {
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  const port = '8000'; // FastAPI服务器端口
  return `${protocol}//${host}:${port}`;
}

/**
 * 分析网站内容
 * 发送URL到后端进行分析并返回结果
 * 
 * @param url - 要分析的网站URL
 * @param signal - AbortController的signal，用于取消请求
 * @returns Promise<WebsiteAnalysis> - 返回分析结果或错误信息
 */
export async function analyzeWebsite(
  url: string,
  signal?: AbortSignal
): Promise<WebsiteAnalysis> {
  try {
    // 构建完整的API URL
    const apiUrl = `${getBaseUrl()}/api/analyze`;
    
    // 发送POST请求到后端API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
      signal, // 添加signal用于取消请求
    });

    // 获取响应数据
    const data = await response.json();

    // 检查响应状态
    if (!response.ok) {
      // 如果响应不成功，抛出错误
      throw new Error(data.detail || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // 如果是取消请求，直接抛出 AbortError
    if (error instanceof Error && error.name === 'AbortError') {
      throw error; // 重新抛出 AbortError
    }
    
    // 其他错误返回空结果
    return {
      business_intro: '',
      core_selling_points: [],
      core_audiences: [],
      error: error instanceof Error ? error.message : '分析网站时出错'
    };
  }
} 