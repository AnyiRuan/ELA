# ELA AI聊天机器人 - 快速设置指南

## 🚀 如何启用真实的AI聊天机器人

当前网站默认使用预设的回复。如果您想启用真实的Claude AI功能，请按照以下步骤操作：

---

## 📋 步骤1：获取API密钥

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 登录或注册账号
3. 导航到 **API Keys** 部分
4. 点击 **Create Key** 创建新的API密钥
5. 复制生成的密钥（格式类似：`sk-ant-api03-...`）

⚠️ **注意**：API密钥只显示一次，请妥善保存！

---

## 📋 步骤2：配置网站

打开 `index.html` 文件，找到以下代码（大约在第1671行）：

```javascript
// AI Configuration
const AI_CONFIG = {
  apiKey: 'YOUR_ANTHROPIC_API_KEY_HERE', // Replace with your actual key
  model: 'claude-3-5-haiku-20241022',
  apiUrl: 'https://api.anthropic.com/v1/messages',
  enabled: false // Set to true after adding your API key
};
```

### 修改配置：

1. **替换API密钥**：
   ```javascript
   apiKey: 'sk-ant-api03-你的实际密钥',
   ```

2. **启用AI功能**：
   ```javascript
   enabled: true
   ```

### 完成后的配置示例：

```javascript
const AI_CONFIG = {
  apiKey: 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  model: 'claude-3-5-haiku-20241022',
  apiUrl: 'https://api.anthropic.com/v1/messages',
  enabled: true
};
```

---

## 📋 步骤3：测试聊天机器人

1. 在浏览器中打开 `index.html`
2. 点击右下角的AI助手图标
3. 发送测试消息，例如："介绍一下ELA的服务"
4. 如果配置正确，您将收到由Claude AI生成的智能回复

---

## ⚠️ 重要安全提醒

### 🔴 **切勿将包含真实API密钥的文件推送到GitHub！**

如果您修改了 `index.html` 并添加了真实的API密钥：

1. **不要**使用 `git add index.html`
2. **不要**提交包含密钥的文件
3. **不要**将文件推送到公共仓库

### 为什么？

- API密钥会被任何查看代码的人看到
- 他人可以使用您的密钥产生费用
- GitHub会自动检测并阻止推送（但最好不要尝试）

### 如何安全使用？

#### 选项1：仅本地测试（推荐用于个人测试）
- 在本地文件中添加API密钥
- 仅在本地浏览器中使用
- 不要提交到Git

#### 选项2：使用 .gitignore（如果需要版本控制）
```bash
# 创建带密钥的本地配置文件
cp index.html index.local.html

# 添加到 .gitignore
echo "index.local.html" >> .gitignore

# 在 index.local.html 中添加密钥并使用
```

#### 选项3：使用后端代理（生产环境推荐）
- 查看 `AI_CHATBOT_SECURITY_GUIDE.md`
- 实施后端服务器
- 在服务器端安全存储API密钥

---

## 💡 功能说明

启用AI后，聊天机器人将能够：

### ✅ 智能理解
- 理解用户的自然语言问题
- 识别用户意图
- 提供上下文相关的回答

### ✅ 专业回复
- 基于ELA业务知识
- 介绍服务项目详情
- 回答常见问题
- 引导用户预约咨询

### ✅ 双语支持
- 自动检测界面语言
- 中文问题用中文回答
- 英文问题用英文回答

### ✅ 错误处理
- API调用失败时自动回退到预设回复
- 显示友好的错误信息
- 确保用户体验不中断

---

## 💰 成本估算

Claude 3.5 Haiku 是最经济的模型：

- **输入**：约 $0.25 / 百万tokens
- **输出**：约 $1.25 / 百万tokens

### 实际成本示例
假设每次对话：
- 用户输入：50 tokens
- AI回复：200 tokens
- 每次对话成本：约 $0.0003（0.03分）

**100次对话** ≈ **$0.03**（3分钱）
**1000次对话** ≈ **$0.30**（30分钱）
**10000次对话** ≈ **$3.00**（3元）

---

## 🔍 故障排除

### 问题1：聊天机器人仍使用预设回复

**检查清单：**
- [ ] `enabled` 是否设置为 `true`
- [ ] API密钥是否正确替换（不是 `YOUR_ANTHROPIC_API_KEY_HERE`）
- [ ] 浏览器是否刷新了页面
- [ ] 打开浏览器控制台查看错误信息

### 问题2：显示 "API Error"

**可能原因：**
- API密钥无效或已过期
- 账户余额不足
- 网络连接问题
- API服务暂时不可用

**解决方法：**
1. 在 [Anthropic Console](https://console.anthropic.com/) 检查密钥状态
2. 检查账户余额
3. 查看浏览器控制台的详细错误信息
4. 尝试重新生成API密钥

### 问题3：CORS错误

**原因：**
直接在本地文件系统打开HTML（`file://` 协议）可能导致CORS问题。

**解决方法：**
使用本地服务器运行：

```bash
# Python 3
python -m http.server 8000

# Node.js (需要先安装 http-server)
npx http-server -p 8000

# VS Code
# 使用 Live Server 扩展
```

然后访问：`http://localhost:8000`

---

## 📊 监控API使用

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 查看 **Usage** 部分
3. 监控：
   - 每日/每月API调用次数
   - Token使用量
   - 费用统计

### 设置用量警报
1. 在Console中设置月度预算
2. 配置警报阈值
3. 接收邮件通知

---

## 🚀 升级到生产环境

当您准备正式上线时：

1. **切勿**继续使用前端API密钥方案
2. 阅读 `AI_CHATBOT_SECURITY_GUIDE.md`
3. 实施后端代理服务器
4. 添加速率限制和身份验证
5. 配置监控和日志
6. 使用环境变量管理密钥

---

## 📞 需要帮助？

### 文档资源
- [Anthropic API文档](https://docs.anthropic.com/)
- [Claude模型对比](https://docs.anthropic.com/claude/docs/models-overview)
- [安全最佳实践](AI_CHATBOT_SECURITY_GUIDE.md)

### 常见问题
- 如何获得免费API额度？→ 新注册用户通常有免费额度
- 如何升级API套餐？→ 在Anthropic Console中管理订阅
- 支持哪些支付方式？→ 信用卡、借记卡

---

## ✅ 设置完成检查清单

- [ ] 已获取Anthropic API密钥
- [ ] 已在 `index.html` 中配置API密钥
- [ ] 已将 `enabled` 设置为 `true`
- [ ] 已在浏览器中测试聊天功能
- [ ] AI回复正常工作
- [ ] 了解安全风险和成本
- [ ] 知道如何避免提交密钥到Git
- [ ] （可选）阅读了生产部署指南

---

**恭喜！您的ELA AI聊天机器人现在已经启用了真实的Claude AI功能！** 🎉
