# Vercel 部署修复指南

## 🚨 当前问题
静态HTML文件（包括test.html和details/*.html）返回404错误

## ✅ 解决方案

### 方法1：检查Vercel项目设置（最重要！）

1. **登录Vercel Dashboard**
   - 访问 https://vercel.com/dashboard
   - 选择您的ELA项目

2. **检查项目设置**
   - 点击 "Settings" 标签
   - 找到 "General" → "Build & Development Settings"

3. **关键设置（必须正确）：**
   ```
   Framework Preset: Other (或留空)
   Build Command: (留空)
   Output Directory: . (或留空)
   Install Command: (留空)
   Root Directory: (留空，不要设置)
   ```

4. **如果有任何设置不对：**
   - 点击 "Override" 旁边的编辑按钮
   - 清空所有字段或设为上述值
   - 点击 "Save"

5. **触发重新部署：**
   - 回到 "Deployments" 标签
   - 点击最新部署右侧的三个点 ⋯
   - 选择 "Redeploy"
   - 勾选 "Use existing Build Cache" 可以不勾选
   - 点击 "Redeploy"

### 方法2：删除并重新导入项目（如果方法1不行）

1. **在Vercel Dashboard中：**
   - 进入项目设置
   - 滚动到底部
   - 点击 "Delete Project"（警告：会删除所有部署历史）

2. **重新导入：**
   - 回到Dashboard
   - 点击 "Add New..." → "Project"
   - 选择GitHub仓库：AnyiRuan/ELA
   - **不要修改任何默认设置**
   - 在 "Environment Variables" 添加：
     ```
     Key: ANTHROPIC_API_KEY
     Value: your-api-key-here
     ```
   - 点击 "Deploy"

### 方法3：确认文件在Git仓库中

在本地运行：
```bash
git ls-files | grep -E "(test\.html|details/.*\.html)"
```

应该看到：
```
test.html
details/academic-planning.html
details/ai-planning.html
details/business-mentoring.html
details/immersion-programs.html
details/language-excellence.html
details/test-preparation.html
```

如果缺少文件，运行：
```bash
git add .
git commit -m "Add missing files"
git push
```

### 方法4：检查.gitignore

确保.gitignore **没有**忽略HTML文件：
```bash
cat .gitignore | grep -i html
```

如果有任何匹配（除了*.local.html），需要修改.gitignore

### 方法5：查看部署日志

1. 在Vercel Dashboard的 "Deployments" 标签
2. 点击最新部署
3. 查看 "Building" 日志
4. 展开 "Build Output" 部分
5. 查看是否有错误或警告

**查找这些关键信息：**
- "Detected Project Settings" - 应该显示为静态站点
- "Copying static files" - 应该列出所有.html文件
- 任何 "ERROR" 或 "WARNING" 消息

## 📋 验证清单

部署完成后，按顺序测试：

- [ ] `https://your-domain.vercel.app/` - 首页能访问
- [ ] `https://your-domain.vercel.app/test.html` - 测试页能访问
- [ ] `https://your-domain.vercel.app/details/business-mentoring.html` - 详情页能访问
- [ ] 在首页点击"了解更多"能跳转

## 🔍 调试技巧

### 查看实际部署的文件

1. 在部署详情页面，找到 "Deployment URL"
2. 在URL后面添加 `/_src`
3. 例如：`https://ela-xxxx.vercel.app/_src`
4. 这会显示实际部署的文件列表

### 查看源代码

在部署详情页面：
1. 点击 "Source" 标签
2. 查看是否包含 test.html 和 details/ 文件夹
3. 如果没有，说明Git提交有问题

## 💡 为什么会404？

可能的原因：
1. **Root Directory设置错误** - 最常见！Vercel在错误的文件夹里查找文件
2. **Framework Preset错误** - 设置成了Next.js等会导致Vercel忽略静态HTML
3. **Build Command错误** - 有build命令但失败了
4. **文件没有提交到Git** - Vercel看不到文件
5. **vercel.json配置冲突** - 错误的路由配置

## 🎯 最简单的测试

创建最简单的HTML文件测试：

```bash
echo "TEST OK" > simple.html
git add simple.html
git commit -m "Add simple test file"
git push
```

等待部署，访问：`https://your-domain.vercel.app/simple.html`

如果这个都404，**一定是Vercel项目设置有问题**。

## 📞 需要帮助？

如果以上都不行，请提供：
1. Vercel部署日志的截图（Build Output部分）
2. 项目设置截图（Framework Preset等）
3. `git ls-files | grep html` 的输出
4. 访问 test.html 时浏览器Network标签显示的完整URL

---

**最后更新：** 2024-11-16
**当前vercel.json：** 仅包含环境变量，无其他配置
