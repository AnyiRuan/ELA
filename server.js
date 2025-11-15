const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// 中间件
app.use(express.json());

// CORS配置 - 限制允许的域名
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['POST'],
  credentials: true
}));

// 速率限制 - 防止滥用
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 50, // 限制每个IP 50个请求
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

app.use('/api/chat', limiter);

// 初始化Anthropic客户端
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 聊天接口
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language } = req.body;

    // 输入验证
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

    // 系统提示词
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

    // 调用Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: message
      }]
    });

    // 返回结果
    res.json({
      success: true,
      message: response.content[0].text
    });

  } catch (error) {
    console.error('API Error:', error);

    // 错误处理
    if (error.status === 429) {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded, please try again later.'
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
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 API Key configured: ${process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No'}`);
});
