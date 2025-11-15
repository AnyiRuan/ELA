# ELA网站生产环境部署指南

## 🎯 概述

对于公众网站，必须使用后端代理服务器来安全地调用AI API。本指南将帮助您部署一个完整的生产环境。

---

## 📁 项目结构

```
ELA/
├── index.html              # 前端网站（需要修改API调用）
├── server.js              # 后端API服务器 ✅ 已创建
├── package.json           # Node.js依赖配置 ✅ 已创建
├── .env.example           # 环境变量示例 ✅ 已创建
├── .env                   # 实际环境变量（不提交到Git）
├── .gitignore             # Git忽略文件 ✅ 已创建
└── README.md              # 项目文档
```

---

## 🚀 部署步骤

### 步骤1：安装Node.js依赖

```bash
cd /home/user/ELA
npm install
```

这将安装：
- `express` - Web服务器框架
- `@anthropic-ai/sdk` - Anthropic官方SDK
- `cors` - 跨域资源共享
- `express-rate-limit` - 速率限制
- `dotenv` - 环境变量管理

### 步骤2：配置环境变量

创建 `.env` 文件（基于 `.env.example`）：

```bash
cp .env.example .env
```

编辑 `.env` 文件，添加您的API密钥：

```env
ANTHROPIC_API_KEY=sk-ant-api03-你的真实密钥
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
```

⚠️ **重要**：`.env` 文件已在 `.gitignore` 中，不会被提交到Git！

### 步骤3：修改前端代码

打开 `index.html`，找到 `callClaudeAPI` 函数（约第1694行），替换为：

```javascript
async function callClaudeAPI(userMessage) {
  // 调用后端API而不是直接调用Anthropic
  const response = await fetch('/api/chat', {  // 或 'http://localhost:3000/api/chat' 用于开发
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

  if (!data.success) {
    throw new Error(data.error || 'Unknown error');
  }

  return data.message;
}
```

同时修改 `AI_CONFIG`：

```javascript
const AI_CONFIG = {
  enabled: true,  // ← 启用AI
  // 不再需要 apiKey、model、apiUrl，这些都在后端
};
```

更新 `sendMessage()` 和 `sendQuickMessage()` 函数中的检查条件：

```javascript
// 从这个：
if (AI_CONFIG.enabled && AI_CONFIG.apiKey !== 'YOUR_ANTHROPIC_API_KEY_HERE') {

// 改为这个：
if (AI_CONFIG.enabled) {
```

### 步骤4：测试本地运行

启动后端服务器：

```bash
npm start
```

您应该看到：
```
🚀 Server running on port 3000
📝 Environment: production
🔑 API Key configured: Yes
```

在另一个终端，启动前端服务器：

```bash
# Python方式
python3 -m http.server 8000

# 或Node.js方式
npx http-server -p 8000
```

访问 `http://localhost:8000`，测试聊天机器人功能。

---

## 🌐 生产环境部署选项

### 选项A：传统服务器（VPS/云主机）

**适用于**：AWS EC2、DigitalOcean、Linode等

1. **部署后端**：
   ```bash
   # 在服务器上
   git clone <your-repo>
   cd ELA
   npm install

   # 配置环境变量
   nano .env

   # 使用PM2运行（推荐）
   npm install -g pm2
   pm2 start server.js --name ela-api
   pm2 save
   pm2 startup
   ```

2. **配置Nginx反向代理**：
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       # 前端静态文件
       location / {
           root /path/to/ELA;
           index index.html;
           try_files $uri $uri/ =404;
       }

       # API代理
       location /api/ {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **配置HTTPS**（使用Let's Encrypt）：
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### 选项B：Vercel + Serverless（最简单）

**优势**：零配置、自动扩展、免费额度

1. **修改项目结构**：
   ```
   ELA/
   ├── api/
   │   └── chat.js        # Serverless函数
   └── index.html         # 前端
   ```

2. **创建 `api/chat.js`**（Vercel会自动识别）：
   ```javascript
   import Anthropic from '@anthropic-ai/sdk';

   export default async function handler(req, res) {
     // 复制server.js中的/api/chat逻辑
   }
   ```

3. **部署**：
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

4. **在Vercel控制台配置环境变量**：
   - `ANTHROPIC_API_KEY`
   - `NODE_ENV`

### 选项C：Netlify + Netlify Functions

类似Vercel，使用 `netlify/functions/` 目录。

---

## 🔒 安全最佳实践

### 1. 速率限制
已在 `server.js` 中实现：
- 15分钟内每个IP最多50个请求
- 防止滥用和DDoS

### 2. 输入验证
- 消息长度限制（最大1000字符）
- 类型检查
- 防止注入攻击

### 3. CORS配置
在 `.env` 中设置 `ALLOWED_ORIGINS`：
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 4. 环境变量
- ✅ API密钥存储在 `.env`
- ✅ `.env` 在 `.gitignore` 中
- ✅ 提供 `.env.example` 作为模板

### 5. 错误处理
- 不向前端暴露详细错误信息
- 记录服务器端错误日志
- 优雅降级到预设回复

---

## 💰 成本预估

### Anthropic API成本
- 模型：Claude 3.5 Haiku
- 输入：~$0.25/百万tokens
- 输出：~$1.25/百万tokens

**实际成本示例**：
- 每次对话：~$0.0003（0.03分）
- 1000次对话：~$0.30
- 10000次对话：~$3.00

### 服务器成本
- **VPS**：$5-20/月（DigitalOcean、Linode）
- **Vercel**：免费（个人项目）
- **Netlify**：免费（个人项目）

---

## 📊 监控和维护

### 1. 监控API使用
访问 [Anthropic Console](https://console.anthropic.com/)：
- 查看每日/每月调用量
- 监控费用
- 设置用量警报

### 2. 服务器监控
使用PM2监控：
```bash
pm2 monit
pm2 logs ela-api
```

### 3. 日志记录
服务器已配置console日志，可以：
- 重定向到文件
- 使用日志服务（如Logtail、Papertrail）
- 设置错误警报

---

## 🔧 故障排除

### 问题1：无法连接到后端

**检查**：
- 后端服务器是否运行？ `pm2 status` 或 `ps aux | grep node`
- 端口是否正确？默认3000
- 防火墙是否开放端口？

### 问题2：API返回401错误

**原因**：API密钥无效或过期

**解决**：
- 检查 `.env` 中的 `ANTHROPIC_API_KEY`
- 在Anthropic Console验证密钥
- 重新生成密钥

### 问题3：CORS错误

**原因**：前端域名不在允许列表

**解决**：
- 更新 `.env` 中的 `ALLOWED_ORIGINS`
- 重启服务器

### 问题4：速率限制

**症状**：提示"Too many requests"

**解决**：
- 在 `server.js` 中调整速率限制
- 考虑添加用户认证
- 实施缓存机制

---

## ✅ 部署检查清单

- [ ] Node.js已安装（v18+）
- [ ] 依赖已安装（`npm install`）
- [ ] `.env` 文件已创建并配置API密钥
- [ ] 前端代码已修改为调用后端API
- [ ] 本地测试成功
- [ ] 服务器已部署（VPS/Vercel/Netlify）
- [ ] HTTPS已配置
- [ ] CORS已正确设置
- [ ] 速率限制已测试
- [ ] 监控和日志已设置
- [ ] 用量警报已配置

---

## 📞 需要帮助？

**文档资源**：
- [Anthropic API文档](https://docs.anthropic.com/)
- [Express.js文档](https://expressjs.com/)
- [Vercel部署指南](https://vercel.com/docs)

**常见问题**：
- API密钥在哪里？→ [Anthropic Console](https://console.anthropic.com/)
- 如何查看使用量？→ Anthropic Console > Usage
- 支持哪些部署平台？→ VPS、Vercel、Netlify、AWS、Azure等

---

**恭喜！您的ELA网站现在可以安全地向公众提供AI聊天机器人服务了！** 🎉
