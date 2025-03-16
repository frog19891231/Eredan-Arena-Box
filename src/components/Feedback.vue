<template>
    <div class="container">
        <div id="app">
            <h1>Anonymous Message Board</h1>
            <div id="message-form">
                <textarea v-model="newMessage" placeholder="Enter your message"></textarea>
                <button @click="send_Message">Send</button>
            </div>
            <div id="messages">
                <div v-for="message in messages" :key="message.id" class="message">
                    <strong>{{ message.user.name }}</strong>
                    <!-- 顯示留言，保留換行符號 -->
                    <p class="message-text">{{ message.text }}</p>
                    <button @click="showReplyInput(message.id)">Reply</button>
                    
                    <div v-if="message.showReply">
                        <textarea v-model="replyText[message.id]" placeholder="Enter your reply"></textarea>
                        <button @click="send_Reply(message.id)">Send reply</button>
                    </div>

                    <div class="replies" v-if="message.replies.length">
                        <h4>Replies:</h4>
                        <div v-for="reply in message.replies" :key="reply.id">
                            <strong>{{ reply.user.name }}</strong>
                            <!-- 顯示回覆，保留換行符號 -->
                            <p class="reply-text">{{ reply.text }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loginAnonymously, sendMessage, loadMessages, sendReply } from '../scripts/Firebase';

// 響應式數據
const newMessage = ref('');
const messages = ref([]);
const replyText = ref({});

// 匿名登入並加載留言
onMounted(async () => {
    await loginAnonymously();
    loadMessages((newMessages) => {
        messages.value = newMessages;
    });
});

// 發送留言
const send_Message = async () => {
    if (newMessage.value.trim()) {
        await sendMessage(newMessage.value);
        newMessage.value = '';
    } else {
        console.error('Message content is invalid');
    }
};

// 顯示回復輸入框
const showReplyInput = (messageId) => {
    const messageIndex = messages.value.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
        messages.value[messageIndex] = {
            ...messages.value[messageIndex],
            showReply: !messages.value[messageIndex].showReply
        };
        if (!replyText.value[messageId]) {
            replyText.value[messageId] = '';
        }
    }
};

// 發送回復
const send_Reply = async (messageId) => {
    if (replyText.value[messageId]?.trim()) {
        await sendReply(messageId, replyText.value[messageId]);
        replyText.value[messageId] = '';
    } else {
        console.error('Reply content is invalid');
    }
};
</script>

<style scoped>
/* 整體佈局 */
.container {
    display: flex;
    justify-content: center;
    align-items: flex-start; /* 讓內容從頂部開始 */
    min-height: 80vh;
    padding: 20px;
    background-color: #1e1e1e; /* 深色背景 */
    color: #e0e0e0; /* 淺色文字 */
}

#app {
    max-width: 800px;
    width: 100%;
    background: #2d2d2d; /* 深灰色背景 */
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 深色陰影 */
}

/* 標題 */
h1 {
    text-align: center;
    color: #42b983; /* 主題色 */
    margin-bottom: 20px;
    font-size: 28px;
    font-weight: bold;
}

/* 留言輸入框 */
#message-form {
    margin-bottom: 30px;
}

#message-form textarea {
    width: 100%;
    height: 100px;
    padding: 12px;
    font-size: 16px;
    border: 2px solid #444; /* 深色邊框 */
    border-radius: 8px;
    resize: vertical; /* 允許垂直調整大小 */
    background-color: #3d3d3d; /* 深灰色背景 */
    color: #e0e0e0; /* 淺色文字 */
    transition: border-color 0.3s ease;
}

#message-form textarea:focus {
    border-color: #42b983; /* 聚焦時邊框變色 */
    outline: none;
}

/* 發送按鈕 */
#message-form button {
    display: block;
    width: 100%;
    padding: 12px;
    font-size: 16px;
    background-color: #42b983; /* 主題色 */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#message-form button:hover {
    background-color: #369f6e; /* 懸停時變色 */
}

/* 留言列表 */
#messages {
    margin-top: 20px;
}

.message {
    background: #3d3d3d; /* 深灰色背景 */
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); /* 深色陰影 */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.message:hover {
    transform: translateY(-2px); /* 懸停時輕微上移 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); /* 懸停時陰影加深 */
}

.message strong {
    color: #42b983; /* 主題色 */
    font-size: 18px;
}

.message p {
    margin: 10px 0;
    color: #e0e0e0; /* 淺色文字 */
    font-size: 16px;
    line-height: 1.5;
    text-align: left;
}

/* 註解：讓文字顯示換行 */
.message-text, .reply-text {
    white-space: pre-line; /* 讓文字中的換行符號生效 */
}

/* 回覆按鈕 */
.message button {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #42b983; /* 主題色 */
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.message button:hover {
    background-color: #369f6e; /* 懸停時變色 */
}

/* 回覆輸入框 */
.message textarea {
    width: 100%;
    height: 80px;
    padding: 10px;
    margin-top: 10px;
    font-size: 14px;
    border: 2px solid #444; /* 深色邊框 */
    border-radius: 6px;
    resize: vertical; /* 允許垂直調整大小 */
    background-color: #3d3d3d; /* 深灰色背景 */
    color: #e0e0e0; /* 淺色文字 */
    transition: border-color 0.3s ease;
}

.message textarea:focus {
    border-color: #42b983; /* 聚焦時邊框變色 */
    outline: none;
}

/* 回覆發送按鈕 */
.message button[type="submit"] {
    margin-top: 10px;
    padding: 8px 16px;
    font-size: 14px;
    background-color: #42b983; /* 主題色 */
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.message button[type="submit"]:hover {
    background-color: #369f6e; /* 懸停時變色 */
}

/* 回覆列表 */
.replies {
    margin-top: 15px;
    padding-left: 100px;
    border-left: 3px solid #444; /* 深色邊框 */
}

.replies h4 {
    margin-bottom: 10px;
    color: #42b983; /* 主題色 */
    font-size: 16px;
}

.replies div {
    margin-bottom: 10px;
    padding: 10px;
    background: #4d4d4d; /* 更深灰色背景 */
    border-radius: 6px;
    
}

.replies strong {
    color: #42b983; /* 主題色 */
    font-size: 14px;
}

.replies p {
    margin: 5px 0;
    color: #e0e0e0; /* 淺色文字 */
    font-size: 14px;
    line-height: 1.4;
}
</style>
