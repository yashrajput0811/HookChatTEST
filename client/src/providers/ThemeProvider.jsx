import { useEffect } from 'react';
import { useStore } from '../store';

export function ThemeProvider({ children }) {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return children;
} 