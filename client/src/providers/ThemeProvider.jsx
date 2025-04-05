import { useEffect } from 'react';
import { useStore } from '../store';

const ThemeProvider = ({ children }) => {
  const { theme, setTheme } = useStore();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [setTheme]);

  useEffect(() => {
    // Update theme when it changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider; 