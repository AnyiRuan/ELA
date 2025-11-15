// ============================================
// 生产环境前端代码更新
// ============================================
// 将以下代码替换到 index.html 中相应位置

// 1. AI配置（约第1654-1659行）
// 删除原来的配置，替换为：
const AI_CONFIG = {
  enabled: true,  // 启用AI
  apiEndpoint: '/api/chat'  // 后端API端点（生产环境）
  // 开发环境使用: apiEndpoint: 'http://localhost:3000/api/chat'
};

// 2. callClaudeAPI 函数（约第1694-1743行）
// 完全替换为：
async function callClaudeAPI(userMessage) {
  const response = await fetch(AI_CONFIG.apiEndpoint, {
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

// 3. sendMessage 函数（约第1661-1692行）
// 修改条件判断，从：
// if (AI_CONFIG.enabled && AI_CONFIG.apiKey !== 'YOUR_ANTHROPIC_API_KEY_HERE') {
// 改为：
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();

  if (message) {
    addUserMessage(message);
    input.value = '';

    showTypingIndicator();

    if (AI_CONFIG.enabled) {  // ← 简化的条件
      try {
        const response = await callClaudeAPI(message);
        hideTypingIndicator();
        addBotMessage(response);
      } catch (error) {
        console.error('API Error:', error);
        hideTypingIndicator();
        addBotMessage(getBotResponse(message));
      }
    } else {
      setTimeout(() => {
        hideTypingIndicator();
        addBotMessage(getBotResponse(message));
      }, 1000);
    }
  }
}

// 4. sendQuickMessage 函数（约第1745-1708行）
// 同样修改条件判断：
async function sendQuickMessage(type) {
  const messages = {
    'zh': {
      'application': '我想了解留学申请服务',
      'immersion': '请介绍一下沉浸式项目',
      'consultation': '我想预约免费咨询',
      'faq': '有哪些常见问题？'
    },
    'en': {
      'application': 'I want to learn about application services',
      'immersion': 'Tell me about the immersion program',
      'consultation': 'I want to book a free consultation',
      'faq': 'What are the FAQs?'
    }
  };

  const message = messages[currentLang][type];
  addUserMessage(message);

  showTypingIndicator();

  if (AI_CONFIG.enabled) {  // ← 简化的条件
    try {
      const response = await callClaudeAPI(message);
      hideTypingIndicator();
      addBotMessage(response);
    } catch (error) {
      console.error('API Error:', error);
      hideTypingIndicator();
      addBotMessage(getBotResponse(type, true));
    }
  } else {
    setTimeout(() => {
      hideTypingIndicator();
      addBotMessage(getBotResponse(type, true));
    }, 1000);
  }
}
