# ELA English - 双语网站

## 项目简介

这是ELA English的官方网站，支持中英文双语切换，配备智能AI聊天机器人，旨在为学生提供全方位的教育规划和能力培养服务。

## 功能特性

### 1. 双语支持 🌐
- **中文/英文**一键切换
- 全站内容完整翻译
- 保持用户语言偏好

### 2. 智能聊天机器人 🤖
- **真实AI驱动**：集成Claude Haiku 3.5 API
- **24/7在线服务**
- **中英文双语**智能问答
- 快捷操作按钮
- 多轮对话支持
- 实时输入反馈
- 上下文理解能力
- 自动回退到预设回复（API失败时）

⚠️ **重要提示**：当前版本在前端直接调用API，仅用于测试！生产环境请参考 `AI_CHATBOT_SECURITY_GUIDE.md` 实施安全的后端代理。

### 3. 响应式设计 📱
- 完美支持桌面端
- 平板设备优化
- 移动端友好界面
- 自适应布局

### 4. 核心板块

#### 导航栏
- 品牌标识
- 主要导航菜单
- 语言切换按钮
- 预约咨询CTA按钮

#### Hero区域
- 突出核心价值主张
- 服务标签展示
- 主要行动号召

#### 差异化优势板块
- 展示ELA与传统机构的区别
- 突出企业家背景团队优势
- 4大核心优势展示

#### 核心特色
- 6大核心优势详细介绍
- 卡片式布局
- 悬停交互效果

#### 服务项目
- 4大服务类别
- 详细服务列表
- 清晰的视觉层次

#### 页脚
- 公司信息
- 联系方式
- 快速链接
- 社交媒体

## 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代样式和动画
- **JavaScript** - 交互功能和国际化
- **SVG** - 矢量图形

## 使用方法

### 本地预览

1. 克隆或下载项目
```bash
git clone <repository-url>
cd ELA
```

2. 直接在浏览器中打开 `index.html` 文件
```bash
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### 部署

可以部署到任何静态网站托管服务：
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

## 聊天机器人功能

### AI模型配置
- **模型**：Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)
- **最大Token**：1024
- **响应时间**：通常1-3秒
- **双语支持**：自动根据界面语言切换System Prompt

### 快捷操作
- 📚 了解留学申请服务
- 🚀 沉浸式项目详情
- 📅 预约免费咨询
- ❓ 常见问题

### 智能响应特性
聊天机器人通过Claude AI提供：
- ✅ **上下文理解**：理解用户意图
- ✅ **专业回答**：基于ELA业务知识
- ✅ **中英文双语**：自动适应界面语言
- ✅ **友好语气**：专业且易于理解
- ✅ **错误处理**：API失败时自动回退到预设回复

### System Prompt设计
聊天机器人被配置为ELA的专业客服：
- 了解ELA的核心优势（企业家团队、真实商业项目）
- 熟悉所有服务项目
- 能够回答常见问题
- 引导用户预约咨询

### ⚠️ 安全警告
**当前实现将API密钥暴露在前端代码中，这是不安全的！**

请查看 `AI_CHATBOT_SECURITY_GUIDE.md` 了解：
- 为什么这是危险的
- 如何实施安全的后端代理
- 生产环境部署最佳实践
- 成本控制和监控

## 双语系统

### 语言数据结构
所有翻译内容存储在 `translations` 对象中：
```javascript
const translations = {
  'zh': { /* 中文翻译 */ },
  'en': { /* 英文翻译 */ }
};
```

### 添加新翻译
1. 在HTML中添加 `data-i18n` 属性
2. 在 `translations` 对象中添加对应的键值对
3. 系统会自动处理切换

## 自定义配置

### 颜色主题
在CSS中修改以下变量：
- 主色调：`#2C5F8D`, `#3A7CA5`
- 强调色：`#D35400`
- 背景渐变：`#f5f7fa` to `#c3cfe2`

### 动画效果
所有动画使用CSS transitions和keyframes，可在style标签中调整：
- `fadeInUp` - 淡入上移动画
- `slideIn` - 滑入动画
- `pulse` - 脉冲动画
- `messageSlide` - 消息滑入动画

## 浏览器支持

- ✅ Chrome (最新版本)
- ✅ Firefox (最新版本)
- ✅ Safari (最新版本)
- ✅ Edge (最新版本)
- ✅ 移动浏览器

## 性能优化

- 纯静态HTML，无需服务器端处理
- 内联CSS和JavaScript，减少HTTP请求
- SVG图标，矢量图形体积小
- 响应式图片（如需添加）
- 懒加载（可选实现）

## 未来增强

### 建议的功能扩展
1. **表单集成**
   - 联系表单
   - 预约咨询表单
   - 文件上传

2. **内容管理**
   - 博客系统
   - 成功案例
   - 新闻动态

3. **AI聊天机器人升级**
   - 集成真实AI API
   - 自然语言处理
   - 上下文记忆
   - 个性化推荐

4. **数据分析**
   - Google Analytics
   - 用户行为追踪
   - A/B测试

5. **SEO优化**
   - Meta标签优化
   - Schema.org结构化数据
   - Sitemap生成
   - 开放图谱标签

## 项目结构

```
ELA/
├── index.html              # 主网站文件（双语+聊天机器人）
├── README.md              # 项目文档
├── files/                 # 设计参考文件
│   ├── ela-ui-design.jsx
│   ├── ela-website-ui-design.html
│   └── ELA_UI_Design_Specification.docx
├── ELA_Complete_Website_Content_v2.docx
└── ELA_Website_Proposal.docx
```

## 许可证

© 2024 ELA English. All rights reserved.

## 联系方式

- 📧 邮箱: info@ela-english.com
- 📱 电话: +1 (XXX) XXX-XXXX
- 💬 微信: ELA_English

---

**Designed and developed with ❤️ for ELA English**
