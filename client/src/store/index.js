import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Theme state
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      // Chat state
      currentChat: null,
      setCurrentChat: (chat) => set({ currentChat: chat }),
      
      // Settings
      settings: {
        gender: 'any',
        country: 'any',
        interests: [],
        language: 'en',
      },
      setSettings: (settings) => set({ settings }),
      
      // Premium features
      isPremium: false,
      setPremium: (isPremium) => set({ isPremium }),
      
      // Ghost mode
      ghostMode: false,
      setGhostMode: (ghostMode) => set({ ghostMode }),
    }),
    {
      name: 'hookchat-storage',
    }
  )
);

export default useStore; 