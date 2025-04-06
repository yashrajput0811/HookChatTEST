import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const premiumFeatures = [
  {
    id: 'ghost',
    title: 'Ghost Mode',
    description: 'Browse anonymously without appearing in the online users list',
    icon: '👻',
  },
  {
    id: 'country',
    title: 'Country Filter',
    description: 'Match with users from specific countries only',
    icon: '🌎',
  },
  {
    id: 'interests',
    title: 'Interest Matching',
    description: 'Get matched with users who share your interests',
    icon: '🎯',
  },
  {
    id: 'themes',
    title: 'Custom Themes',
    description: 'Access exclusive chat themes and backgrounds',
    icon: '🎨',
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const isPremium = useStore((state) => state.isPremium);
  const setIsPremium = useStore((state) => state.setIsPremium);
  const [showPremiumSuccess, setShowPremiumSuccess] = useState(false);

  const handleUpgrade = async () => {
    // Simulate premium upgrade
    setIsPremium(true);
    setShowPremiumSuccess(true);
    setTimeout(() => setShowPremiumSuccess(false), 3000);
  };

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

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen animated-bg">
      <nav className="glass-morphism py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
            Settings
          </h1>
          <ThemeToggle />
        </div>
      </nav>

      <main className="container mx-auto max-w-6xl p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* User Preferences */}
          <motion.section
            variants={itemVariants}
            className="glass-morphism rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-6">User Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Anonymous"
                  value={user.username || ''}
                  onChange={() => {}}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  className="input"
                  value={user.country || ''}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.interests?.map((interest) => (
                    <span key={interest} className="badge badge-primary">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Premium Features */}
          <motion.section
            variants={itemVariants}
            className="glass-morphism rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Premium Features</h2>
              {!isPremium && (
                <button
                  onClick={handleUpgrade}
                  className="btn btn-primary"
                >
                  Upgrade Now
                </button>
              )}
            </div>
            <div className="space-y-4">
              {premiumFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/5"
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm opacity-70">{feature.description}</p>
                  </div>
                  {isPremium ? (
                    <span className="ml-auto badge badge-primary">Active</span>
                  ) : (
                    <span className="ml-auto badge badge-secondary">
                      Premium
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Account Settings */}
          <motion.section
            variants={itemVariants}
            className="glass-morphism rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notification Settings
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>New message notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Partner found notifications</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Privacy Settings
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Show online status</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Allow friend requests</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Support & Help */}
          <motion.section
            variants={itemVariants}
            className="glass-morphism rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Support & Help</h2>
            <div className="space-y-4">
              <button className="btn btn-secondary w-full text-left flex items-center space-x-2">
                <span>📖</span>
                <span>User Guide</span>
              </button>
              <button className="btn btn-secondary w-full text-left flex items-center space-x-2">
                <span>❓</span>
                <span>FAQ</span>
              </button>
              <button className="btn btn-secondary w-full text-left flex items-center space-x-2">
                <span>📞</span>
                <span>Contact Support</span>
              </button>
            </div>
          </motion.section>
        </motion.div>
      </main>

      {/* Success Toast */}
      <AnimatePresence>
        {showPremiumSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="toast toast-success"
          >
            🎉 Welcome to HookChat Premium!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 