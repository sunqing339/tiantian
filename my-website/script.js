document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // 使用提供的API KEY
    const API_KEY = '6b94367d3ae3d4a837b2e170228f18f4.r1GVHwh0OTOM7Dcf';

    function getBackgroundClass(messageLength) {
        if (messageLength < 20) {
            return 'bg-short';
        } else if (messageLength < 50) {
            return 'bg-medium';
        } else {
            return 'bg-long';
        }
    }

    function addMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isUser ? 'user-message' : 'ai-message');
        messageElement.classList.add(getBackgroundClass(message.length));
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function getAIResponse(userMessage) {
        const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        const headers = {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        };
        const data = {
            "model": "glm-4",
            "messages": [
                {
                    "role": "system",
                    "content": "你是一个智能AI助手,能够回答各种问题。请用简洁、专业、有逻辑的方式回答用户的问题。"
                },
                {
                    "role": "user",
                    "content": userMessage
                }
            ]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.choices && result.choices.length > 0 && result.choices[0].message) {
                return result.choices[0].message.content;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.message.includes('Invalid response format')) {
                return "抱歉,AI返回的响应格式不正确。请稍后再试。";
            } else if (error.message.includes('HTTP error')) {
                return `抱歉,服务器返回了错误 (${error.message})。请检查网络连接,或稍后再试。`;
            } else {
                return "抱歉,发生了未知错误。请稍后再试。";
            }
        }
    }

    async function handleUserInput() {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, true);
            userInput.value = '';

            // 显示"正在思考"的提示
            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('message', 'ai-message', 'typing-indicator');
            typingIndicator.textContent = '正在思考...';
            chatMessages.appendChild(typingIndicator);

            try {
                const aiResponse = await getAIResponse(userMessage);
                chatMessages.removeChild(typingIndicator);
                addMessage(aiResponse, false);
            } catch (error) {
                console.error('Error:', error);
                chatMessages.removeChild(typingIndicator);
                addMessage("抱歉,发生了错误。请稍后再试。", false);
            }
        }
    }

    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
});