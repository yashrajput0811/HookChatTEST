import { create } from 'zustand';

export const useStore = create((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // Theme state
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  // Chat state
  currentChat: null,
  messages: [],
  isTyping: false,
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setIsTyping: (isTyping) => set({ isTyping }),
  
  // User preferences
  gender: '',
  country: '',
  interests: [],
  setGender: (gender) => set({ gender }),
  setCountry: (country) => set({ country }),
  setInterests: (interests) => set({ interests }),
  
  // Premium features
  isPremium: false,
  ghostMode: false,
  setIsPremium: (isPremium) => set({ isPremium }),
  setGhostMode: (ghostMode) => set({ ghostMode }),
  
  // Reset store
  reset: () => set({
    user: null,
    currentChat: null,
    messages: [],
    isTyping: false,
    gender: '',
    country: '',
    interests: [],
    isPremium: false,
    ghostMode: false
  })
})); 