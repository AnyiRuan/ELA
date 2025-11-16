# ELA English 网站结构说明

## 📁 网站文件结构

```
ELA/
├── index.html                          # 首页（主页面）
├── details/                            # 详情页面目录
│   ├── business-mentoring.html        # 商业领袖导师团队详情页
│   ├── immersion-programs.html        # 真实商业沉浸式体验详情页
│   ├── academic-planning.html         # 学术规划与申请详情页
│   ├── ai-planning.html              # AI驱动智能规划详情页
│   ├── language-excellence.html      # 语言能力提升详情页
│   ├── test-preparation.html         # 标准化考试准备详情页
│   └── detail-style.css              # 详情页共用样式表
├── api/                               # Vercel Serverless Functions
│   └── chat.js                       # AI聊天机器人API
└── vercel.json                       # Vercel部署配置

## 🔗 页面访问路径

### 主页
- URL: `https://your-domain.vercel.app/`
- 文件: `index.html`

### 详情页面
1. **商业领袖导师团队**
   - URL: `https://your-domain.vercel.app/details/business-mentoring.html`
   - 从首页访问: 服务项目 → 商业领袖导师团队 → "了解更多"

2. **真实商业沉浸式体验**
   - URL: `https://your-domain.vercel.app/details/immersion-programs.html`
   - 从首页访问:
     - 服务项目 → 真实商业沉浸式体验 → "了解更多"
     - 沉浸式项目部分 → 任一项目卡片 → "了解更多"

3. **学术规划与申请**
   - URL: `https://your-domain.vercel.app/details/academic-planning.html`
   - 从首页访问: 服务项目 → 学术规划与申请 → "了解更多"

4. **AI驱动智能规划**
   - URL: `https://your-domain.vercel.app/details/ai-planning.html`
   - 从首页访问: 服务项目 → AI驱动智能规划 → "了解更多"

5. **语言能力提升**
   - URL: `https://your-domain.vercel.app/details/language-excellence.html`
   - 从首页访问: 服务项目 → 语言能力提升 → "了解更多"

6. **标准化考试准备**
   - URL: `https://your-domain.vercel.app/details/test-preparation.html`
   - 从首页访问: 服务项目 → 标准化考试准备 → "了解更多"

## ✨ 功能特性

### 首页 (index.html)
- Hero区域：网站主要价值主张
- Why ELA：差异化优势展示
- 服务项目：6大核心服务
- 沉浸式项目：3个实战项目
- 数据统计：经验、学生、成功率等
- AI聊天助手：24/7在线客服
- 中英文切换：完整双语支持

### 详情页面
每个详情页包含：
- 专业的Hero区域
- 详细的服务介绍
- 特色亮点展示
- 具体案例或导师信息
- 清晰的行动号召(CTA)
- 返回导航和页脚

## 🚀 部署说明

### Vercel配置
`vercel.json` 包含以下配置：
- `cleanUrls: true` - 支持无扩展名URL访问
- `trailingSlash: false` - 不添加尾部斜杠
- API路由配置 - 支持聊天机器人功能

### 环境变量
需要在Vercel项目设置中配置：
- `ANTHROPIC_API_KEY` - Claude AI API密钥（用于聊天机器人）

## 📝 维护说明

### 添加新的详情页面
1. 在 `details/` 目录下创建新的HTML文件
2. 复制现有详情页的结构和样式
3. 在 `index.html` 中添加对应的"了解更多"链接
4. 提交并推送到Git，Vercel会自动部署

### 更新内容
1. 编辑对应的HTML文件
2. 测试链接和样式
3. 提交并推送更改
4. Vercel会自动重新部署

## 🔍 故障排查

### 如果"了解更多"链接无法访问
1. 检查 `details/` 文件夹是否被正确提交到Git
2. 检查 `vercel.json` 配置是否正确
3. 在Vercel dashboard查看部署日志
4. 确认文件路径大小写正确（Linux区分大小写）

### 如果样式显示异常
1. 检查浏览器开发者工具控制台
2. 确认CSS是否正确加载
3. 清除浏览器缓存
4. 检查相对路径是否正确

## 📊 网站内容概览

### 服务项目详情页内容

#### 1. 商业领袖导师团队 (business-mentoring.html)
- 导师团队背景（创业、上市公司、战略管理经验）
- 6大核心特色
- 4位优秀导师代表
- 完整中英文双语

#### 2. 真实商业沉浸式体验 (immersion-programs.html)
- 创业项目参与
- 商业战略实践
- 市场拓展体验
- 每个项目包含详细案例

#### 3. 学术规划与申请 (academic-planning.html)
- 初高中规划
- 本科申请
- 转学申请
- 研究生申请

#### 4. AI驱动智能规划 (ai-planning.html)
- 智能诊断系统
- 路径规划
- 进度追踪
- 人机协作模式

#### 5. 语言能力提升 (language-excellence.html)
- 基础能力培养
- 学术英语
- 情景实践
- 批判性思维

#### 6. 标准化考试准备 (test-preparation.html)
- TOEFL/IELTS
- SAT/ACT
- GRE/GMAT
- 系统化备考策略

## 📞 技术支持

如有问题，请查看：
- Vercel部署日志
- Git提交历史
- 浏览器开发者工具
