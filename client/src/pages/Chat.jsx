import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Send, Loader2, Flag, X } from 'lucide-react';

const Chat = () => {
  const { currentChat, setCurrentChat } = useStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'me' }]);
      setNewMessage('');
      // Simulate typing and response
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'This is a simulated response', sender: 'other' }]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNextChat = () => {
    setCurrentChat(null);
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                {currentChat?.avatar || '👤'}
              </div>
              <div>
                <h3 className="font-medium">Anonymous User</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowReportModal(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors"
              >
                <Flag className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextChat}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[calc(100vh-16rem)] overflow-y-auto p-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'me'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-1"
              >
                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Typing...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            <div className="flex items-center space-x-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-dark-800 p-6 rounded-lg max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-medium mb-4">Report User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <select className="w-full p-2 rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
                    <option>Inappropriate Behavior</option>
                    <option>Harassment</option>
                    <option>Spam</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800"
                    rows={3}
                    placeholder="Please describe the issue..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle report submission
                      setShowReportModal(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Report
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat; 