import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { socket } from '../socket';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoImage, IoHappy, IoLanguage, IoEllipsisVertical, IoChevronBack } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import LoadingAnimation from '../components/LoadingAnimation';

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/');
      return;
    }

    // Emit user info to server
    socket.emit('user_info', userInfo);
    console.log('Emitting user info:', userInfo);

    socket.on('chat_started', ({ roomId, interests }) => {
      console.log('Chat started:', roomId);
      setRoomId(roomId);
      setIsConnected(true);
      setMatchInfo({ interests });
    });

    socket.on('receive_message', async ({ sender, message, timestamp, type, imageUrl }) => {
      const newMsg = {
        id: Date.now() + Math.random().toString(36).substring(7),
        sender: sender === socket.id ? 'me' : 'partner',
        content: message,
        timestamp,
        type: type || 'text',
        imageUrl
      };

      if (autoTranslate && sender !== socket.id && type !== 'image') {
        try {
          const response = await axios.post('http://localhost:3001/translate', {
            text: message,
            targetLang: navigator.language.split('-')[0]
          });
          newMsg.translation = response.data.translatedText;
        } catch (error) {
          console.error('Translation error:', error);
        }
      }

      setMessages(prev => [...prev, newMsg]);
    });

    socket.on('partner_typing', ({ isTyping }) => {
      setIsPartnerTyping(isTyping);
    });

    socket.on('partner_disconnected', () => {
      setMessages(prev => [...prev, { 
        id: Date.now() + Math.random().toString(36).substring(7),
        type: 'system', 
        content: 'Your chat partner has disconnected.' 
      }]);
      setIsConnected(false);
    });

    return () => {
      socket.off('chat_started');
      socket.off('receive_message');
      socket.off('partner_typing');
      socket.off('partner_disconnected');
    };
  }, [user, navigate, autoTranslate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() && !imagePreview) return;
    
    if (imagePreview) {
      // In a real app, you would upload the image to a server here
      socket.emit('send_message', {
        roomId,
        message: 'Image',
        type: 'image',
        imageUrl: imagePreview
      });
      setImagePreview(null);
    }

    if (newMessage.trim()) {
      socket.emit('send_message', {
        roomId,
        message: newMessage.trim()
      });
    }
    
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing event
    socket.emit('typing', { roomId, isTyping: e.target.value.length > 0 });
    
    // Set timeout to stop "typing" after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { roomId, isTyping: false });
    }, 1500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    navigate('/');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl rounded-xl p-8 text-center max-w-md w-full mx-4 border border-white/10 shadow-2xl"
        >
          <LoadingAnimation 
            type="pulse" 
            size="large" 
            text="Finding Your Match" 
            subText="We're looking for someone who shares your interests"
          />
          
          <motion.button 
            onClick={handleNewChat}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 bg-white/5 rounded-lg text-white/80 hover:text-white text-sm font-medium border border-white/10 transition-all duration-200 mt-6"
          >
            Cancel
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col">
      {/* Chat Header */}
      <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl px-4 py-3 flex items-center justify-between z-10 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 cursor-pointer"
            onClick={handleNewChat}
          >
            <IoChevronBack className="text-white/80" />
          </motion.div>
          
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full absolute -right-0.5 -bottom-0.5 border border-[#0c0c0c]" />
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                ?
              </div>
            </div>
            <div>
              <h2 className="text-white font-medium text-sm">Anonymous Partner</h2>
              <div className="flex items-center space-x-1.5">
                <span className="text-green-400 text-xs">Online</span>
                {matchInfo && matchInfo.interests.length > 0 && (
                  <span className="text-white/40 text-xs">• {matchInfo.interests.slice(0, 2).join(', ')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              autoTranslate ? 'bg-purple-600/30 text-purple-300' : 'bg-white/5 text-white/60 hover:text-white/80'
            }`}
          >
            <IoLanguage className="text-lg" />
          </motion.button>
          
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white/60 hover:text-white/80"
            >
              <IoEllipsisVertical className="text-lg" />
            </motion.button>
            
            {showOptions && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl py-1 w-48 z-20"
              >
                <button 
                  className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/5 text-sm"
                  onClick={handleNewChat}
                >
                  New conversation
                </button>
                <button className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/5 text-sm">
                  Report user
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto py-5 px-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(111, 66, 193, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)'
        }}
      >
        {matchInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 text-center my-4 mx-auto max-w-sm"
          >
            <h3 className="text-white font-medium text-sm mb-1">You're now chatting with a stranger</h3>
            <p className="text-white/60 text-xs">
              You both like: {matchInfo.interests.join(', ')}
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'system' ? (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 text-white/60 text-center text-sm max-w-sm mx-auto">
                  {msg.content}
                </div>
              ) : (
                <div 
                  className={`max-w-[70%] ${
                    msg.sender === 'me' 
                      ? 'bg-gradient-to-br from-purple-600/80 to-blue-600/80' 
                      : 'bg-white/8'
                  } backdrop-blur-md rounded-2xl px-4 py-3 shadow-sm ${
                    msg.sender === 'me' ? 'rounded-br-sm' : 'rounded-bl-sm'
                  }`}
                >
                  {msg.type === 'image' ? (
                    <img src={msg.imageUrl} alt="Shared" className="rounded-lg max-w-full" />
                  ) : (
                    <>
                      <p className="text-white leading-relaxed">{msg.content}</p>
                      {msg.translation && (
                        <p className="text-white/70 text-sm mt-2 border-t border-white/10 pt-2 italic">
                          {msg.translation}
                        </p>
                      )}
                    </>
                  )}
                  <p className="text-white/50 text-[10px] mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isPartnerTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-2 max-w-[70%]"
          >
            <div className="bg-white/8 backdrop-blur-md py-3 px-4 rounded-2xl rounded-bl-sm">
              <div className="flex space-x-1">
                <motion.div 
                  className="w-1.5 h-1.5 bg-white/50 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                  className="w-1.5 h-1.5 bg-white/50 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div 
                  className="w-1.5 h-1.5 bg-white/50 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl p-4 border-t border-white/5">
        {imagePreview && (
          <div className="mb-4 relative">
            <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setImagePreview(null)}
              className="absolute top-2 right-2 bg-black/60 text-white/80 rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </motion.button>
          </div>
        )}
        
        <div className="relative">
          <div className="flex items-center bg-white/5 rounded-full border border-white/10 pr-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current.click()}
              className="p-3 text-white/60 hover:text-white/80 transition-colors"
            >
              <IoImage className="text-xl" />
            </motion.button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-white border-none focus:outline-none focus:ring-0 py-3 px-2 placeholder-white/40"
            />
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-full transition-colors ${
                showEmojiPicker ? 'bg-white/20 text-white/90' : 'text-white/60 hover:text-white/80'
              }`}
            >
              <IoHappy className="text-xl" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!newMessage.trim() && !imagePreview}
              className={`ml-1 p-2.5 rounded-full ${
                newMessage.trim() || imagePreview 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-white/5 text-white/40'
              }`}
            >
              <IoSend className="text-lg" />
            </motion.button>
          </div>
          
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 right-0 z-10"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                lazyLoadEmojis={true}
                theme="dark"
                width={320}
                height={400}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat; 