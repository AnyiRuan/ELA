// Get website content for admin
const fs = require('fs');
const path = require('path');

// In-memory storage (temporary solution)
// In production, this should use a database or Vercel KV
let contentStorage = null;

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
      const storagePath = path.join('/tmp', 'ela-content.json');
      if (fs.existsSync(storagePath)) {
        const data = fs.readFileSync(storagePath, 'utf-8');
        contentStorage = JSON.parse(data);
      }
    } catch (err) {
      console.log('No stored content found, using defaults');
    }

    // Return stored content or default values
    const defaultContent = {
      heroTitle_zh: '帮助学生找到方向、建立真实能力、理解世界',
      heroDesc_zh: '由具备创业、企业运营、市场拓展与战略管理经验的专业团队领导，ELA提供学术发展、申请成功和真实商业成长的完整路径。',
      highlightTitle_zh: '🏆 与传统留学机构不同，ELA的核心团队由成功企业家和商业领袖组成',
      highlightSubtitle_zh: '我们的团队成员拥有创业成功经验、上市公司运营背景、市场拓展实战和战略规划管理能力',
      service1Desc_zh: '具备创业、企业运营、市场拓展和战略管理实战经验的导师，为学生提供超越传统教育的商业视角和实践指导。',
      service2Desc_zh: '由成功企业家领导的真实项目，学习战略框架和决策方法，建立可验证的商业能力。',
      service3Desc_zh: '从初中学术规划到大学转学，再到职业探索的全周期支持，深度了解美国教育体系。',
      heroTitle_en: 'Help Students Find Direction, Build Real Skills, Understand the World',
      heroDesc_en: 'Led by a professional team with entrepreneurship, business operations, market expansion and strategic management experience, ELA provides a complete path to academic development, application success and real business growth.',
      highlightTitle_en: '🏆 Unlike traditional study abroad agencies, ELA\'s core team consists of successful entrepreneurs and business leaders',
      highlightSubtitle_en: 'Our team members have entrepreneurial success experience, listed company operations background, market expansion practice and strategic planning management capabilities',
      service1Desc_en: 'Mentors with practical experience in entrepreneurship, business operations, market expansion and strategic management, providing students with business perspectives beyond traditional education.',
      service2Desc_en: 'Real projects led by successful entrepreneurs, learning strategic frameworks and decision-making methods, building verifiable business capabilities.',
      service3Desc_en: 'Full-cycle support from middle school academic planning to college transfer, to career exploration, with deep understanding of the US education system.'
    };

    const content = contentStorage || defaultContent;

    return res.status(200).json({
      success: true,
      content: content
    });
  } catch (error) {
    console.error('Get content error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
