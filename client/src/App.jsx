import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
