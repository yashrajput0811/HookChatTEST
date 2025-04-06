import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';

const COUNTRIES = [
  { value: 'any', label: 'Any Country' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'IN', label: 'India' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'BR', label: 'Brazil' },
  { value: 'JP', label: 'Japan' },
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'any', label: 'Any' },
];

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    gender: '',
    country: '',
    interests: []
  });
  const [interestInput, setInterestInput] = useState('');
  const [error, setError] = useState('');
  const [animateForm, setAnimateForm] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimateForm(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInterestAdd = (e) => {
    e.preventDefault();
    if (interestInput && userInfo.interests.length < 5) {
      setUserInfo(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.toLowerCase()]
      }));
      setInterestInput('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInfo.gender || !userInfo.country) {
      setError('Please select both gender and country');
      return;
    }

    if (userInfo.interests.length === 0) {
      setError('Please add at least one interest');
      return;
    }

    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    navigate('/chat');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren", 
        staggerChildren: 0.1,
        duration: 0.6
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/5 h-16 flex items-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/80"
          >
            <IoArrowBack />
          </motion.button>
          <h1 className="text-lg font-medium text-white">Set Preferences</h1>
          <div className="w-10 h-10"></div> {/* Empty div for flex spacing */}
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <motion.div 
            initial="hidden"
            animate={animateForm ? "visible" : "hidden"}
            variants={containerVariants}
            className="w-full max-w-md"
          >
            <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-medium text-white mb-6">
                  Your Profile
                </h2>
                <p className="text-white/60 text-sm mb-8">
                  Tell us about yourself so we can find you the perfect match.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Select your gender
                  </label>
                  <div className="relative">
                    <select
                      value={userInfo.gender}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full bg-[rgba(255,255,255,0.05)] text-white rounded-lg px-4 py-3 appearance-none cursor-pointer border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                      required
                    >
                      <option value="" className="bg-[#121212]">Choose...</option>
                      {GENDERS.map(({ value, label }) => (
                        <option key={value} value={value} className="bg-[#121212]">{label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 9.5a.5.5 0 0 1-.354-.146l-4-4a.5.5 0 1 1 .708-.708L8 8.293l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.354.146z"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Select your country
                  </label>
                  <div className="relative">
                    <select
                      value={userInfo.country}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full bg-[rgba(255,255,255,0.05)] text-white rounded-lg px-4 py-3 appearance-none cursor-pointer border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                      required
                    >
                      <option value="" className="bg-[#121212]">Choose...</option>
                      {COUNTRIES.map(({ value, label }) => (
                        <option key={value} value={value} className="bg-[#121212]">{label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 9.5a.5.5 0 0 1-.354-.146l-4-4a.5.5 0 1 1 .708-.708L8 8.293l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.354.146z"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Add your interests (max 5)
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      className="flex-1 bg-[rgba(255,255,255,0.05)] text-white rounded-l-lg px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                      placeholder="Type and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleInterestAdd(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleInterestAdd}
                      disabled={userInfo.interests.length >= 5}
                      className="bg-[rgba(111,66,193,0.7)] text-white px-4 py-3 rounded-r-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {userInfo.interests.map((interest, index) => (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={index}
                        className="inline-flex items-center bg-[rgba(111,66,193,0.2)] border border-purple-500/30 text-purple-100 px-3 py-1 rounded-full text-sm backdrop-blur-sm"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => setUserInfo(prev => ({
                            ...prev,
                            interests: prev.interests.filter((_, i) => i !== index)
                          }))}
                          className="ml-2 text-purple-300 hover:text-red-300 transition-colors focus:outline-none"
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:shadow-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                    disabled={!userInfo.gender || !userInfo.country || userInfo.interests.length === 0}
                  >
                    Start Chatting
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
