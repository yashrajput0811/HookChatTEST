import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { socket } from '../socket';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoImage, IoHappy, IoLanguage } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';

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
  const messagesEndRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/');
      return;
    }

    // Emit user info to server
    socket.emit('user_info', userInfo);
    console.log('Emitting user info:', userInfo);

    socket.on('chat_started', ({ roomId }) => {
      console.log('Chat started:', roomId);
      setRoomId(roomId);
      setIsConnected(true);
    });

    socket.on('receive_message', async ({ sender, message, timestamp, type, imageUrl }) => {
      const newMsg = {
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
    socket.emit('typing', { roomId, isTyping: e.target.value.length > 0 });
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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Looking for a chat partner...</h2>
          <p className="text-white/80">We're finding someone with similar interests</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-white font-semibold">Chat Partner Online</h2>
        </div>
        <button
          onClick={() => setAutoTranslate(!autoTranslate)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
            autoTranslate ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
          }`}
        >
          <IoLanguage className="text-xl" />
          <span className="text-sm">Auto-Translate</span>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'system' ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white/70 text-center text-sm w-full">
                  {msg.content}
                </div>
              ) : (
                <div className={`max-w-[70%] ${msg.sender === 'me' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm rounded-lg px-4 py-2`}>
                  {msg.type === 'image' ? (
                    <img src={msg.imageUrl} alt="Shared" className="rounded-lg max-w-full" />
                  ) : (
                    <>
                      <p className="text-white">{msg.content}</p>
                      {msg.translation && (
                        <p className="text-white/70 text-sm mt-1 border-t border-white/10 pt-1">
                          {msg.translation}
                        </p>
                      )}
                    </>
                  )}
                  <p className="text-white/50 text-xs mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isPartnerTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-white/70"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">Partner is typing...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/10 backdrop-blur-lg p-4">
        {imagePreview && (
          <div className="mb-4 relative">
            <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg" />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <IoImage className="text-xl" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <IoHappy className="text-xl" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() && !imagePreview}
            className="p-2 text-white disabled:text-white/50 transition-colors"
          >
            <IoSend className="text-xl" />
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat; 