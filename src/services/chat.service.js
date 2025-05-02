// src/services/chat.service.js
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8081/chat'
})


class ChatService {
  async getChatHistory(user1, user2) {
    const res = await API.get('/history', {
      params: { user1, user2 }
    })
    return res.data
  }

  async sendMessage(message) {
    const res = await API.post('/send', message)
    return res.data
  }

  async getChatPartners(userId) {
    const res = await API.get(`/partners/${userId}`)
    return res.data 
  }
 
}

export default new ChatService()

