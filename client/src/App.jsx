import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import ThemeProvider from './providers/ThemeProvider';

function App() {
  const { theme } = useStore();

  return (
    <ThemeProvider>
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-900 text-white' : 'bg-gray-50 text-dark-900'}`}>
        <Router>
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
