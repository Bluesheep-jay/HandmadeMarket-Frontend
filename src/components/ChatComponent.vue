<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="user-info">
        <div class="avatar">{{ receiverId?.charAt(0).toUpperCase() }}</div>
        <div class="user-name">{{ userName }}</div>
      </div>
      <div class="header-actions">
        <button class="icon-button">
          <SearchIcon size="18" />
        </button>
        <button class="icon-button">
          <MoreVerticalIcon size="18" />
        </button>
      </div>
    </div>

    <div class="messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-chat">
        <MessageSquareIcon size="48" class="empty-icon" />
        <p>Bắt đầu cuộc trò chuyện</p>
      </div>

      <div v-for="(msg, index) in messages" :key="index" class="message-row">
        <!-- Tin nhắn của người khác (nằm bên trái) -->
        <div v-if="msg.senderId !== currentUserId" class="message-left">
          <div v-if="showAvatar(msg, index)" class="avatar message-avatar">
            {{ msg.senderId?.charAt(0).toUpperCase() }}
          </div>
          <div v-else class="avatar-placeholder"></div>

          <div class="message-bubble-container">
            <div class="message-bubble received">
              <div class="message-content">{{ msg.content }}</div>
            </div>
            <div class="message-meta">
              {{ formatTime(msg.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Tin nhắn của bản thân (nằm bên phải) -->
        <div v-else class="message-right">
          <div class="message-bubble-container">
            <div class="message-bubble sent">
              <div class="message-content">{{ msg.content }}</div>
            </div>
            <div class="message-meta">
              {{ formatTime(msg.timestamp) }}
              <span class="message-status">
                <CheckIcon size="12" class="status-icon" />
                <CheckIcon size="12" class="status-icon" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input-container">
      <button class="input-action-button">
        <PlusIcon size="20" />
      </button>
      <div class="chat-input">
        <input
          v-model="message"
          placeholder="Nhập tin nhắn..."
          @keyup.enter="sendMessage"
        />
        <button class="emoji-button">
          <SmileIcon size="20" />
        </button>
      </div>
      <button
        class="send-button"
        :class="{ active: message.trim().length > 0 }"
        @click="sendMessage"
      >
        <SendIcon size="20" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from "vue";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import chatService from "../services/chat.service";
import userService from "../services/users.service"
import shopService from "../services/shop.service";
import {
  MessageSquare as MessageSquareIcon,
  Search as SearchIcon,
  MoreVertical as MoreVerticalIcon,
  Plus as PlusIcon,
  Smile as SmileIcon,
  Send as SendIcon,
  Check as CheckIcon,
} from "lucide-vue-next";

const props = defineProps({
  receiverId: String,
  currentUserId: String,
});

const message = ref("");
const messages = ref([]);
const messagesContainer = ref(null);
const currentUserId = props.currentUserId;
const receiverId = props.receiverId;
const shopId = localStorage.getItem("shopId") || null;
const userName = ref("");
let stompClient = null;

// Scroll to bottom of messages
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Check if we should show avatar (only show for first message in a sequence)
const showAvatar = (msg, index) => {
  if (index === 0) return true;
  const prevMsg = messages.value[index - 1];
  return prevMsg.senderId !== msg.senderId;
};

onMounted(async () => {
  try {
    if(shopId){
      const Objres = await userService.getUserById(receiverId);
      userName.value = Objres.userName;
    }else{
      const Objres = await shopService.getById(receiverId)
      userName.value = Objres.shopName;
    }

    const history = await chatService.getChatHistory(currentUserId, receiverId);
    messages.value = history.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp).toISOString(),
    }));
    console.log(messages.value);
    scrollToBottom();
  } catch (error) {
    console.error("Error while fetching chat history:", error);
  }

  const socket = new SockJS("http://localhost:8081/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient.subscribe(`/topic/messages`, (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        messages.value.push(receivedMessage);
        scrollToBottom();
      });
    },
  });

  stompClient.activate();
});

// Watch messages to scroll to bottom when new messages arrive
watch(messages, () => {
  scrollToBottom();
});

const sendMessage = () => {
  if (!message.value.trim()) return;

  const chatMessage = {
    senderId: currentUserId,
    receiverId: receiverId,
    content: message.value,
    timestamp: new Date().toISOString(),
  };

  stompClient.publish({
    destination: "/app/sendMessage",
    body: JSON.stringify(chatMessage),
  });

  message.value = "";
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #ff9800;
  color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ff5722;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}

.user-name {
  font-weight: 600;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  text-align: center;
  padding: 20px;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.message-row {
  width: 100%;
  margin-bottom: 8px;
}

.message-left {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 80%;
}

.message-right {
  display: flex;
  justify-content: flex-end;
  max-width: 80%;
  margin-left: auto;
}

.message-avatar {
  width: 32px;
  height: 32px;
  font-size: 14px;
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 32px;
  height: 0;
  flex-shrink: 0;
}

.message-bubble-container {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  word-break: break-word;
}

.sent {
  background-color: #ff9800;
  color: white;
  border-bottom-right-radius: 4px;
}

.received {
  background-color: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-content {
  font-size: 14px;
  line-height: 1.4;
}

.message-meta {
  font-size: 11px;
  color: #888;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.message-right .message-meta {
  justify-content: flex-end;
}

.message-status {
  display: flex;
  align-items: center;
}

.status-icon {
  color: #64b5f6;
}

.status-icon:first-child {
  margin-right: -6px;
}

.chat-input-container {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-top: 1px solid #eee;
  gap: 8px;
}

.input-action-button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.input-action-button:hover {
  color: #ff9800;
  background-color: rgba(255, 152, 0, 0.1);
}

.chat-input {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 24px;
  padding: 0 16px;
}

.chat-input input {
  flex: 1;
  border: none;
  padding: 12px 0;
  background: transparent;
  outline: none;
  font-size: 14px;
}

.emoji-button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.emoji-button:hover {
  color: #ff9800;
}

.send-button {
  background-color: #e0e0e0;
  border: none;
  color: #888;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.send-button.active {
  background-color: #ff9800;
  color: white;
}

.send-button:hover {
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chat-container {
    height: 100vh;
    border-radius: 0;
  }

  .message-left,
  .message-right {
    max-width: 90%;
  }
}
</style>
