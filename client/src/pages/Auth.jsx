import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [error, setError] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate authentication
    if (isLogin) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          HookChat
        </motion.h1>
      </div>

      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="glass-morphism rounded-2xl p-8 shadow-xl backdrop-blur-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text mb-2">
              {isLogin ? 'Welcome Back!' : 'Join HookChat'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {isLogin 
                ? 'Connect with people around the world' 
                : 'Start your journey to meet new friends'}
            </p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={containerVariants}
          >
            {!isLogin && (
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </motion.div>

            {error && (
              <motion.p
                className="text-red-500 text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              className="btn btn-primary w-full"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </motion.button>

            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </button>
            </motion.div>

            <motion.div 
              className="relative my-8"
              variants={itemVariants}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                  Or continue with
                </span>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-3 gap-4"
              variants={containerVariants}
            >
              {['Google', 'GitHub', 'Twitter'].map((provider) => (
                <motion.button
                  key={provider}
                  type="button"
                  className="btn btn-secondary flex items-center justify-center space-x-2"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{provider}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.form>
        </motion.div>

        <motion.div
          className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"
          variants={itemVariants}
        >
          By signing up, you agree to our{' '}
          <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Privacy Policy
          </a>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-20"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full opacity-20"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </div>
  );
} 