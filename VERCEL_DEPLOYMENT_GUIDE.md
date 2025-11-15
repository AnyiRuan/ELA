# ELA网站 - Vercel部署完整指南

## 🎉 恭喜！您的项目已经配置好Vercel部署

您的网站已经部署在：https://vercel.com/mike-ruans-projects/ela

现在只需要完成以下步骤即可启用AI聊天机器人功能。

---

## ✅ 已完成的配置

以下文件已经为Vercel部署准备好：

- ✅ `api/chat.js` - Vercel Serverless函数（后端API）
- ✅ `vercel.json` - Vercel配置文件
- ✅ `package.json` - 依赖配置（已添加ES模块支持）
- ✅ `index.html` - 前端代码已更新为调用 `/api/chat`
- ✅ `.gitignore` - 保护敏感文件

---

## 🚀 部署步骤（只需3步）

### 步骤1：推送代码到GitHub

代码已经在您的Git仓库中，确保最新代码已推送：

```bash
cd /home/user/ELA
git add .
git commit -m "Update for Vercel deployment with AI chatbot"
git push
```

### 步骤2：在Vercel中配置环境变量

这是**最关键的一步**！

1. 访问您的Vercel项目：
   https://vercel.com/mike-ruans-projects/ela

2. 点击 **Settings** 选项卡

3. 在左侧菜单中选择 **Environment Variables**

4. 添加以下环境变量：

   | Name | Value |
   |------|-------|
   | `ANTHROPIC_API_KEY` | 您的真实API密钥（sk-ant-api03-...） |

   **重要提示**：
   - Variable Name: `ANTHROPIC_API_KEY`
   - Value: 粘贴您从 [Anthropic Console](https://console.anthropic.com/) 获取的API密钥
   - Environment: 选择 **Production**, **Preview**, 和 **Development** (全选)

5. 点击 **Save**

### 步骤3：重新部署

配置环境变量后，需要触发重新部署：

**方法A：通过Git推送**（推荐）
```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push
```

**方法B：通过Vercel控制台**
1. 进入 **Deployments** 选项卡
2. 找到最新的部署
3. 点击右侧的 **...** 菜单
4. 选择 **Redeploy**

---

## ✨ 完成！测试AI聊天机器人

部署完成后（通常需要1-2分钟）：

1. 访问您的网站：https://ela.vercel.app（或您的自定义域名）
2. 点击右下角的AI助手图标
3. 发送测试消息，例如："介绍一下ELA的服务"
4. 您应该会收到由Claude AI生成的智能回复！

---

## 🔍 故障排除

### 问题1：聊天机器人仍然使用预设回复

**可能原因**：
- 环境变量未正确配置
- 部署未完成

**解决方法**：
1. 在Vercel中检查环境变量是否已添加
2. 检查变量名是否准确：`ANTHROPIC_API_KEY`（大小写敏感）
3. 重新部署项目

### 问题2：显示"API Error"或"Service configuration error"

**可能原因**：
- API密钥无效或过期
- 账户余额不足

**解决方法**：
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 检查API密钥状态和账户余额
3. 如需要，重新生成API密钥
4. 在Vercel中更新环境变量

### 问题3：检查部署日志

1. 在Vercel项目中，点击 **Deployments**
2. 点击最新的部署
3. 点击 **Function Logs** 查看API调用日志
4. 查找错误信息

---

## 📊 监控和维护

### 查看API使用情况

**Anthropic控制台**：
- 访问 [Anthropic Console](https://console.anthropic.com/)
- 查看 **Usage** 了解API调用次数和费用
- 设置用量警报

**Vercel Analytics**：
- 在Vercel项目中查看流量统计
- 监控Serverless函数调用次数

### 成本预估

- **Vercel**：个人项目免费
- **Anthropic API**：
  - 每次对话约 $0.0003（0.03分）
  - 1000次对话约 $0.30
  - 10000次对话约 $3.00

---

## 🔐 安全特性

您的部署已包含以下安全措施：

✅ **API密钥保护**
- API密钥存储在Vercel环境变量中
- 前端代码不包含任何密钥
- 密钥永远不会暴露给用户

✅ **速率限制**
- 每个IP每15分钟限制50个请求
- 防止滥用和DDoS攻击

✅ **输入验证**
- 消息长度限制（最大1000字符）
- 类型检查和安全过滤

✅ **CORS保护**
- 可配置允许的来源域名
- 防止未授权的跨域请求

✅ **错误处理**
- 不向前端暴露敏感错误信息
- 优雅降级到预设回复

---

## 🎯 进阶配置

### 添加自定义域名

1. 在Vercel项目中，点击 **Settings** > **Domains**
2. 添加您的域名（例如：www.ela-english.com）
3. 按照提示配置DNS记录
4. Vercel会自动配置HTTPS证书

### 限制CORS来源

编辑 `api/chat.js`，修改CORS设置：

```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

### 调整速率限制

在 `api/chat.js` 中修改：

```javascript
const windowMs = 15 * 60 * 1000; // 时间窗口
const maxRequests = 50; // 最大请求数
```

---

## 📁 项目文件结构

```
ELA/
├── api/
│   └── chat.js              # Vercel Serverless函数 ✅
├── index.html               # 前端网站 ✅
├── package.json             # 依赖配置 ✅
├── vercel.json              # Vercel配置 ✅
├── .gitignore               # Git忽略文件 ✅
├── README.md                # 项目文档
├── AI_SETUP_GUIDE.md        # 本地测试指南
├── AI_CHATBOT_SECURITY_GUIDE.md  # 安全指南
└── VERCEL_DEPLOYMENT_GUIDE.md    # 本文档 ✅
```

---

## 🆘 需要帮助？

### 文档资源
- [Vercel文档](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Anthropic API文档](https://docs.anthropic.com/)

### 常见问题
- **如何查看Serverless函数日志？** → Vercel > Deployments > 点击部署 > Function Logs
- **如何更新API密钥？** → Vercel > Settings > Environment Variables > 编辑并重新部署
- **如何回滚到之前的版本？** → Vercel > Deployments > 选择版本 > Promote to Production

---

## ✅ 部署检查清单

完成以下检查确保一切正常：

- [ ] 代码已推送到GitHub
- [ ] Vercel项目已连接到GitHub仓库
- [ ] 在Vercel中添加了 `ANTHROPIC_API_KEY` 环境变量
- [ ] 已触发重新部署
- [ ] 网站可以正常访问
- [ ] 点击AI助手图标，聊天窗口打开
- [ ] 发送测试消息，收到AI智能回复
- [ ] 在Anthropic Console中可以看到API调用记录
- [ ] （可选）配置了自定义域名
- [ ] （可选）设置了API用量警报

---

**恭喜！您的ELA网站现在已经在Vercel上运行，并配备了安全的AI聊天机器人功能！** 🎉

如有任何问题，请检查上述故障排除部分或查阅相关文档。
