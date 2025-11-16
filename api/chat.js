// Vercel Serverless Function for ELA AI Chatbot
// This file is automatically deployed as /api/chat endpoint

import Anthropic from '@anthropic-ai/sdk';

// Rate limiting store (in-memory, resets on cold start)
const requestCounts = new Map();

// Simple rate limiting
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 50;

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const record = requestCounts.get(ip);

  if (now > record.resetTime) {
    // Reset window
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // 在生产环境中改为您的域名
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Get client IP for rate limiting
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later.'
      });
    }

    const { message, language } = req.body;

    // Input validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid message'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message too long (max 1000 characters)'
      });
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({
        success: false,
        error: 'AI service is temporarily unavailable. Please try again later.'
      });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // System prompts
    const systemPrompt = language === 'zh'
      ? `你是ELA English的智能客服助手。ELA是一家专业的教育咨询机构，核心团队由成功企业家和商业领袖组成。

我们的服务包括：
- 商业领袖导师团队：具备创业、企业运营、市场拓展和战略管理实战经验
- 真实商业沉浸式体验：由成功企业家领导的真实项目
- 学术规划与申请：从初中学术规划到大学转学的全周期支持
- AI驱动智能规划：商业战略团队和技术专家打造的AI规划引擎
- 语言能力提升：英语能力培养
- 标准化考试准备：TOEFL、IELTS、SAT等考试辅导

请用友好、专业的语气回答用户问题。回答要简洁明了，重点突出ELA的独特优势（企业家背景团队、真实商业项目体验）。`
      : `You are an AI customer service assistant for ELA English. ELA is a professional education consulting organization with a core team of successful entrepreneurs and business leaders.

Our services include:
- Business Leader Mentoring Team: Mentors with practical experience in entrepreneurship, business operations, market expansion and strategic management
- Real Business Immersion Experience: Real projects led by successful entrepreneurs
- Academic Planning & Application: Full-cycle support from middle school academic planning to college transfer
- AI-Driven Intelligent Planning: AI planning engine created by business strategy team and technical experts
- Language Excellence: English proficiency development
- Test Preparation: TOEFL, IELTS, SAT and other test tutoring

Please answer user questions in a friendly and professional tone. Keep responses concise and highlight ELA's unique advantages (entrepreneur background team, real business project experience).`;

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: message
      }]
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: response.content[0].text
    });

  } catch (error) {
    console.error('API Error:', error);

    // Error handling
    if (error.status === 429) {
      res.status(429).json({
        success: false,
        error: 'API rate limit exceeded, please try again later.'
      });
    } else if (error.status === 401) {
      res.status(500).json({
        success: false,
        error: 'Service configuration error.'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to process request. Please try again.'
      });
    }
  }
}
