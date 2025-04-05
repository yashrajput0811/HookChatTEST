import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Loader2, Users, Globe, Tag } from 'lucide-react';
import ThemeToggle from "../components/ThemeToggle"
import GenderSelector from '../components/GenderSelector'
import InterestTags from '../components/InterestTags'
import CountrySelector from '../components/CountrySelector'
import AvatarSelector from '../components/AvatarSelector'
import ChatRoom from './ChatRoom'

const Home = () => {
  const { settings, ghostMode } = useStore();
  const [isMatching, setIsMatching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [gender, setGender] = useState(null)
  const [tags, setTags] = useState([])
  const [country, setCountry] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [inChat, setInChat] = useState(false)

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const startMatching = () => {
    setIsMatching(true);
    // Simulate matching process
    setTimeout(() => {
      setMatchFound(true);
    }, 2000);
  };

  const nextMatch = () => {
    setMatchFound(false);
    setIsMatching(false);
  };

  const startChat = () => {
    if (!gender) {
      alert("Please select a gender")
      return
    }

    if (!country) {
      alert("Please select a country")
      return
    }

    if (tags.length === 0) {
      alert("Please select at least one interest tag")
      return
    }

    if (!avatar) {
      alert("Please choose an avatar")
      return
    }

    console.log("Starting chat with:", { gender, country, tags, avatar })
    setInChat(true)
  }

  if (inChat) {
    return <ChatRoom gender={gender} country={country} interests={tags} avatar={avatar} />
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Find Your Next Chat</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect with people who share your interests
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary-500" />
              <span>Gender: {settings.gender}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-primary-500" />
              <span>Country: {settings.country}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-primary-500" />
              <span>Interests: {settings.interests.length}</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isMatching && !matchFound && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <button
                onClick={startMatching}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
              >
                Start Matching
              </button>
            </motion.div>
          )}

          {isMatching && !matchFound && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                Finding your perfect match...
              </p>
            </motion.div>
          )}

          {matchFound && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-sm mb-4">
                <h2 className="text-2xl font-bold mb-2">Match Found!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You've been matched with someone who shares your interests
                </p>
                <button
                  onClick={nextMatch}
                  className="bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-800 dark:text-white px-6 py-2 rounded-full font-medium transition-colors mr-4"
                >
                  Next
                </button>
                <button
                  onClick={startChat}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
