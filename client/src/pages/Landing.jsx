import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

const features = [
  {
    icon: '🌍',
    title: 'Global Connections',
    description: 'Chat with people from around the world in real-time',
  },
  {
    icon: '🎯',
    title: 'Smart Matching',
    description: 'Find chat partners based on shared interests and preferences',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'Stay anonymous and secure while chatting',
  },
  {
    icon: '🌐',
    title: 'Live Translation',
    description: 'Chat in your language with automatic message translation',
  },
  {
    icon: '👻',
    title: 'Ghost Mode',
    description: 'Browse and chat invisibly with premium features',
  },
  {
    icon: '📱',
    title: 'Mobile Ready',
    description: 'Perfect experience on any device, anywhere',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen animated-bg">
      {/* Header */}
      <nav className="glass-morphism py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              HookChat
            </motion.h1>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <ThemeToggle />
              <motion.button
                className="btn btn-primary"
                onClick={() => navigate('/auth')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text"
              variants={itemVariants}
            >
              Connect with the World
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Experience real-time chat with automatic translation, smart matching,
              and premium features that make connecting with people around the globe
              easier than ever.
            </motion.p>
            <motion.div
              className="flex items-center justify-center space-x-4"
              variants={itemVariants}
            >
              <motion.button
                className="btn btn-primary px-8 py-3 text-lg"
                onClick={() => navigate('/auth')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Chatting
              </motion.button>
              <motion.button
                className="btn btn-secondary px-8 py-3 text-lg"
                onClick={() => navigate('/about')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-morphism rounded-2xl p-6 hover:shadow-xl transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, #10b981 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, #10b981 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, #10b981 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            className="glass-morphism rounded-2xl p-8 md:p-12 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-transparent bg-clip-text"
              variants={itemVariants}
            >
              Upgrade to Premium
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Get access to exclusive features like Ghost Mode, country filters,
              and unlimited translations. Connect with more people, your way.
            </motion.p>
            <motion.button
              className="btn btn-primary px-8 py-3 text-lg"
              onClick={() => navigate('/pricing')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Plans
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-morphism py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Premium
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Safety Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-500 transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} HookChat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 