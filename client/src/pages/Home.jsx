import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-xl p-8 shadow-xl">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              Welcome to HookChat
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Select your gender
                </label>
                <select
                  value={userInfo.gender}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full bg-white/10 text-white rounded-lg px-4 py-2 appearance-none cursor-pointer border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                >
                  <option value="" className="bg-purple-900">Choose...</option>
                  {GENDERS.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-purple-900">{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Select your country
                </label>
                <select
                  value={userInfo.country}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full bg-white/10 text-white rounded-lg px-4 py-2 appearance-none cursor-pointer border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                >
                  <option value="" className="bg-purple-900">Choose...</option>
                  {COUNTRIES.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-purple-900">{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Add your interests (max 5)
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    className="flex-1 bg-white/10 text-white rounded-l-lg px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                    className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {userInfo.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-purple-500/50 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => setUserInfo(prev => ({
                          ...prev,
                          interests: prev.interests.filter((_, i) => i !== index)
                        }))}
                        className="ml-2 hover:text-red-300 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-300 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                disabled={!userInfo.gender || !userInfo.country || userInfo.interests.length === 0}
              >
                Start Chatting
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
