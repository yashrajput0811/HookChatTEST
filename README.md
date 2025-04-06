# HookChat - Anonymous Chat Application

HookChat is a real-time anonymous chat application that matches users based on their interests. Built with React, Node.js, and Socket.IO, it features a premium Apple-inspired UI with real-time translation capabilities.

![HookChat UI Preview](https://user-images.githubusercontent.com/your-id/hookchat-preview.png)

## Features

- 🌐 **Interest-Based Matching**: Connect with users who share your interests
- 🔄 **Real-Time Translation**: Automatic message translation for cross-language communication
- 🎨 **Premium Design**: 
  - Apple-inspired minimalist aesthetics
  - Dark mode UI with sleek glassmorphism effects
  - Smooth animations and transitions
  - Responsive and adaptive layouts
- 💬 **Rich Chat Features**:
  - Real-time messaging
  - Typing indicators
  - Message timestamps
  - Image sharing
  - Emoji picker
  - Online/Offline status
- 🛡️ **Anonymous**: No registration required, just pick your preferences and start chatting
- 📱 **Responsive Design**: Works seamlessly on both desktop and mobile devices

## Design Philosophy

HookChat's UI follows a minimalist, Apple-inspired design philosophy:
- Clean, distraction-free interfaces
- Purposeful animations and micro-interactions
- High-contrast typography with careful spacing
- Subtle depth through shadows and glassmorphism
- Focus on content and user experience

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/HookChat.git
   cd HookChat
   ```

2. **Set up the server**
   ```bash
   cd server
   npm install
   ```

3. **Set up the client**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the application**

   In the server directory:
   ```bash
   npm run dev
   ```

   In a new terminal, in the client directory:
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - The server will be running on `http://localhost:3001`

## Testing the Application

1. **Basic Setup Test**
   - Open two different browser windows to `http://localhost:5173`
   - This allows you to test the chat as two different users

2. **User Matching Test**
   In the first window:
   - Select your gender
   - Choose your country
   - Add at least one interest (e.g., "movies")
   - Click "Start Chatting"

   In the second window:
   - Select different or same preferences
   - Add at least one matching interest
   - Click "Start Chatting"
   - Users should be matched if they share at least one common interest

3. **Feature Testing**
   - **Real-time Chat**: Send messages between the two windows
   - **Translation**: Enable Auto-Translate and send messages in different languages
   - **Image Sharing**: Click the image icon and upload an image
   - **Emojis**: Click the emoji icon to open the emoji picker
   - **Typing Indicator**: Start typing to see the "Partner is typing..." indicator

## Dependencies

### Server Dependencies
- express
- socket.io
- cors
- @vitalets/google-translate-api
- dotenv
- uuid

### Client Dependencies
- react
- react-router-dom
- socket.io-client
- framer-motion
- react-icons
- emoji-picker-react
- axios
- tailwindcss

## Environment Variables

Create a `.env` file in the server directory:
```env
PORT=3001
CLIENT_URL=http://localhost:5173
```

## Common Issues & Solutions

1. **Port Already in Use**
   ```bash
   # Windows
   taskkill /F /IM node.exe
   
   # Linux/Mac
   killall node
   ```

2. **Connection Issues**
   - Ensure both server and client are running
   - Check if the ports 3001 and 5173 are available
   - Verify the CLIENT_URL in server's .env matches the client's URL

## Recent UI/UX Improvements

The latest version includes a complete UI/UX overhaul:
- Implemented Apple-inspired design language
- Added smooth animations using Framer Motion
- Created a beautiful landing page with scrolling sections
- Enhanced chat interface with modern bubble design
- Improved typography with Inter font
- Added responsive mobile optimizations
- Created custom loading animations
- Implemented dark mode as default theme

## Contributing

Feel free to submit issues and enhancement requests! 