import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, clearUser } = useStore((state) => ({
    user: state.user,
    clearUser: state.clearUser
  }));

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/chat.svg" alt="HookChat Logo" className="h-8 w-8" />
              <span className="text-white font-bold text-xl">HookChat</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user && (
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200 transition-colors"
              >
                Leave Chat
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 