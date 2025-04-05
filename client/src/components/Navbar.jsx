import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Sun, Moon, Settings, Home, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const { theme, setTheme } = useStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent"
              >
                HookChat
              </motion.span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
            <Link
              to="/chat"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 