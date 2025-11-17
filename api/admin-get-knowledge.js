// Get chatbot knowledge base for admin
const fs = require('fs');
const path = require('path');

// In-memory storage (temporary solution)
let knowledgeStorage = null;

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Read from storage file if exists
    try {
      const storagePath = path.join('/tmp', 'ela-knowledge.json');
      if (fs.existsSync(storagePath)) {
        const data = fs.readFileSync(storagePath, 'utf-8');
        knowledgeStorage = JSON.parse(data);
      }
    } catch (err) {
      console.log('No stored knowledge found, using defaults');
    }

    // Default knowledge base content
    const defaultKnowledge = {
      botIdentity_zh: '你是ELA English的智能客服助手。ELA是一家专业的教育咨询机构，核心团队由成功企业家和商业领袖组成。',
      services_zh: `我们的服务包括：
- 商业领袖导师团队：具备创业、企业运营、市场拓展和战略管理实战经验
- 真实商业沉浸式体验：由成功企业家领导的真实项目
- 学术规划与申请：从初中学术规划到大学转学的全周期支持
- AI驱动智能规划：商业战略团队和技术专家打造的AI规划引擎
- 语言能力提升：英语能力培养
- 标准化考试准备：TOEFL、IELTS、SAT等考试辅导`,
      teamFeatures_zh: '我们的团队特色：核心团队由成功企业家组成，拥有真实的创业经验、上市公司运营背景和市场拓展实战经验。',
      responseStyle_zh: '请用友好、专业的语气回答用户问题。保持简洁明了，突出我们企业家背景的独特优势和真实项目体验。如果用户询问具体服务细节，提供清晰的说明。',
      botIdentity_en: 'You are ELA English\'s AI customer service assistant. ELA is a professional educational consulting organization with a core team of successful entrepreneurs and business leaders.',
      services_en: `Our services include:
- Business Leader Mentoring Team: Practical experience in entrepreneurship, business operations, market expansion and strategic management
- Real Business Immersion Experience: Real projects led by successful entrepreneurs
- Academic Planning & Application: Full-cycle support from middle school planning to college transfer
- AI-Driven Intelligent Planning: AI planning engine created by business strategy team and technical experts
- Language Excellence: English proficiency development
- Test Preparation: TOEFL, IELTS, SAT and other standardized test preparation`,
      teamFeatures_en: 'Our team features: Core team consists of successful entrepreneurs with real startup experience, listed company operations background, and market expansion practice.',
      responseStyle_en: 'Please respond in a friendly and professional tone. Keep it concise and clear, highlighting our unique advantages of entrepreneurial background and real project experience. If users ask about specific service details, provide clear explanations.'
    };

    const knowledge = knowledgeStorage || defaultKnowledge;

    return res.status(200).json({
      success: true,
      knowledge: knowledge
    });
  } catch (error) {
    console.error('Get knowledge error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
