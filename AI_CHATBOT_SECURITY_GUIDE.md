# ELA AI聊天机器人 - 安全部署指南

## ⚠️ 重要安全警告

当前的 `index.html` 实现**直接在前端代码中包含API密钥**，这种方式**仅适用于测试和演示环境**。

**生产环境必须使用后端代理服务器！**

---

## 🔒 为什么前端不能直接暴露API密钥？

### 安全风险
1. **任何人都可以查看源代码**获取您的API密钥
2. **恶意用户可以滥用您的密钥**进行大量API调用
3. **可能导致意外的高额费用**
4. **无法实施访问控制和速率限制**
5. **密钥泄露后需要立即撤销和替换**

---

## ✅ 生产环境推荐方案

### 方案A：使用Node.js后端代理（推荐）

#### 1. 创建后端服务器

**server.js**
```javascript
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // 从环境变量读取
});

// 聊天接口
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language } = req.body;

    // 限制请求频率（可选）
    // TODO: 添加速率限制逻辑

    const systemPrompt = language === 'zh'
      ? `你是ELA English的智能客服助手...`
      : `You are an AI customer service assistant...`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: message
      }]
    });

    res.json({
      success: true,
      message: response.content[0].text
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process request'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 2. 环境变量配置

**.env**
```
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=3000
```

⚠️ **重要**：将 `your_actual_api_key_here` 替换为您从 [Anthropic Console](https://console.anthropic.com/) 获取的真实API密钥。

#### 3. 安装依赖

```bash
npm init -y
npm install express @anthropic-ai/sdk cors dotenv
```

#### 4. 更新前端代码

**修改 index.html 中的 callClaudeAPI 函数：**

```javascript
async function callClaudeAPI(userMessage) {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: userMessage,
      language: currentLang
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.message;
}
```

---

### 方案B：使用Vercel/Netlify Serverless Functions

#### Vercel部署

**api/chat.js**
```javascript
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, language } = req.body;

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const systemPrompt = language === 'zh'
      ? `你是ELA English的智能客服助手...`
      : `You are an AI customer service assistant...`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: message
      }]
    });

    res.status(200).json({
      success: true,
      message: response.content[0].text
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process request'
    });
  }
}
```

#### 前端调用
```javascript
async function callClaudeAPI(userMessage) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: userMessage,
      language: currentLang
    })
  });

  const data = await response.json();
  return data.message;
}
```

---

## 🔐 额外安全措施

### 1. 速率限制
使用 `express-rate-limit` 限制请求频率：

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制100个请求
});

app.use('/api/chat', limiter);
```

### 2. 身份验证
添加简单的token验证：

```javascript
app.post('/api/chat', (req, res, next) => {
  const token = req.headers['x-api-token'];
  if (token !== process.env.FRONTEND_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

### 3. CORS配置
限制允许的来源：

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://your-domain.com',
  methods: ['POST'],
  credentials: true
}));
```

### 4. 请求验证
验证输入数据：

```javascript
app.post('/api/chat', (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long' });
  }

  // 处理请求...
});
```

---

## 📊 成本控制

### 监控API使用
1. 在Anthropic控制台查看使用情况
2. 设置用量警报
3. 定期审查API调用日志

### 实施配额限制
```javascript
const userQuotas = new Map();

app.post('/api/chat', (req, res) => {
  const userId = req.ip; // 或使用真实的用户ID
  const quota = userQuotas.get(userId) || 0;

  if (quota >= 50) { // 每天50次
    return res.status(429).json({ error: 'Daily quota exceeded' });
  }

  userQuotas.set(userId, quota + 1);
  // 处理请求...
});
```

---

## 🚀 部署检查清单

- [ ] API密钥存储在环境变量中
- [ ] 前端代码不包含任何密钥
- [ ] 实施速率限制
- [ ] 配置CORS白名单
- [ ] 添加请求验证
- [ ] 设置错误处理和日志记录
- [ ] 配置用量监控和警报
- [ ] 测试错误场景（API失败、网络问题等）
- [ ] 使用HTTPS（生产环境必需）
- [ ] 定期审查和轮换API密钥

---

## 📝 当前测试版本使用说明

**当前的 `index.html` 仅用于测试！**

使用步骤：
1. 在浏览器中打开 `index.html`
2. 点击右下角AI助手图标
3. 输入问题或点击快捷按钮
4. 聊天机器人将使用真实的Claude API回答

⚠️ **注意事项：**
- 每次API调用都会产生费用
- API密钥可以被任何访问网页的人看到
- 没有使用限制，可能被滥用
- **不要**在公开网站上使用此版本
- **不要**将此文件部署到生产环境

---

## 🔄 从测试版迁移到生产版

1. **停止使用当前的前端实现**
2. **按照上述方案A或B设置后端**
3. **将API密钥移动到环境变量**
4. **更新前端代码调用后端接口**
5. **添加安全措施**（速率限制、验证等）
6. **测试完整流程**
7. **部署到生产环境**

---

## 📚 相关资源

- [Anthropic API文档](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Express.js文档](https://expressjs.com/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [安全最佳实践](https://owasp.org/www-project-api-security/)

---

## 🆘 故障排除

### API调用失败
- 检查API密钥是否正确
- 验证网络连接
- 查看浏览器控制台错误信息
- 检查Anthropic API状态页面

### CORS错误
- 确保后端正确配置CORS
- 检查请求头设置
- 验证域名白名单

### 速率限制
- 实施本地缓存
- 增加用户配额
- 优化API调用频率

---

**记住：永远不要在前端代码中暴露API密钥！**
