import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  messages: [],
  currentChat: null,
  chats: [],
  isLoading: false,
  isTyping: false,

  fetchChats: async () => {
    try {
      const response = await axiosInstance.get('/chat/');
      if (response.data.success) {
        set({ chats: response.data.chats });
        if (response.data.chats.length > 0) {
          set({ 
            currentChat: response.data.chats[0], 
            messages: response.data.chats[0].messages || [] 
          });
        }
      }
    } catch (error) {
      console.error('Fetch chats error:', error);
    }
  },

  sendMessage: async (message) => {
    try {
      set({ isLoading: true, isTyping: true });
      
      // Add user message to UI immediately
      const userMessage = { role: 'user', content: message };
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, userMessage] });

      const response = await axiosInstance.post('/chat/', { message });
      
      if (response.data.success) {
        // Replace messages with the updated conversation from server
        set({ 
          messages: response.data.messages,
          currentChat: response.data.chat
        });
        
        // Update chats list
        const currentChats = get().chats;
        const updatedChats = currentChats.map(chat => 
          chat._id === response.data.chat._id ? response.data.chat : chat
        );
        
        // If this is a new chat, add it to the list
        if (!currentChats.find(chat => chat._id === response.data.chat._id)) {
          updatedChats.unshift(response.data.chat);
        }
        
        set({ chats: updatedChats });
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
      
      // Remove the user message from UI on error
      const currentMessages = get().messages;
      set({ messages: currentMessages.slice(0, -1) });
    } finally {
      set({ isLoading: false, isTyping: false });
    }
  },

  selectChat: (chat) => {
    set({ 
      currentChat: chat, 
      messages: chat.messages || [] 
    });
  },

  clearMessages: () => {
    set({ messages: [], currentChat: null });
  },
}));