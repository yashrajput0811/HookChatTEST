import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Globe, Users, Tag, Ghost, Crown, Shield } from 'lucide-react';

const Settings = () => {
  const { settings, setSettings, isPremium, ghostMode, setGhostMode } = useStore();
  const [selectedAvatar, setSelectedAvatar] = useState('👤');

  const avatars = ['👤', '👨', '👩', '🧑', '👧', '👦', '👶', '👵', '👴'];

  const handleInterestToggle = (interest) => {
    const newInterests = settings.interests.includes(interest)
      ? settings.interests.filter((i) => i !== interest)
      : [...settings.interests, interest];
    setSettings({ ...settings, interests: newInterests });
  };

  const commonInterests = [
    'Music', 'Movies', 'Sports', 'Gaming', 'Technology',
    'Travel', 'Food', 'Art', 'Books', 'Fitness',
    'Fashion', 'Photography', 'Science', 'Politics', 'Business'
  ];

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Settings */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
            
            {/* Avatar Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Choose Your Avatar</h3>
              <div className="flex flex-wrap gap-3">
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-110 ${
                      selectedAvatar === avatar
                        ? 'ring-2 ring-primary-500'
                        : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-dark-600'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Gender Preference</h3>
              <div className="flex space-x-4">
                {['any', 'male', 'female'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setSettings({ ...settings, gender })}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      settings.gender === gender
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600'
                    }`}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Country Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Country</h3>
              <select
                value={settings.country}
                onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800"
              >
                <option value="any">Any Country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
                {/* Add more countries */}
              </select>
            </div>

            {/* Interests */}
            <div>
              <h3 className="text-lg font-medium mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {commonInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      settings.interests.includes(interest)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Premium Features</h2>
            
            <div className="space-y-4">
              {/* Ghost Mode */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Ghost className="w-6 h-6 text-primary-500" />
                  <div>
                    <h3 className="font-medium">Ghost Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Browse invisibly and control who can see you
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setGhostMode(!ghostMode)}
                  disabled={!isPremium}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isPremium
                      ? ghostMode
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-dark-600 hover:bg-gray-300 dark:hover:bg-dark-500'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isPremium ? (ghostMode ? 'Enabled' : 'Enable') : 'Premium Only'}
                </button>
              </div>

              {/* Priority Matching */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Crown className="w-6 h-6 text-primary-500" />
                  <div>
                    <h3 className="font-medium">Priority Matching</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get matched faster with priority in the queue
                    </p>
                  </div>
                </div>
                <button
                  disabled={!isPremium}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isPremium
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isPremium ? 'Enabled' : 'Premium Only'}
                </button>
              </div>

              {/* Custom Avatars */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary-500" />
                  <div>
                    <h3 className="font-medium">Custom Avatars</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Upload your own avatar or use AI-generated ones
                    </p>
                  </div>
                </div>
                <button
                  disabled={!isPremium}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isPremium
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isPremium ? 'Enabled' : 'Premium Only'}
                </button>
              </div>
            </div>

            {!isPremium && (
              <div className="mt-6 text-center">
                <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 