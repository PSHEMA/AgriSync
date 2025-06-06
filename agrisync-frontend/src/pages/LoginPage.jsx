import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { LeafIcon, EyeIcon, EyeOffIcon } from '../components/icons';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const { navigate } = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (success) {
      navigate('dashboard');
    } else {
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-4 font-inter">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <LeafIcon className="w-16 h-16 text-green-500 mb-3" />
          <h2 className="text-3xl font-bold text-center text-gray-800">AgriSync Lite</h2>
          <p className="text-center text-gray-600 mt-1">Welcome back! Please sign in.</p>
        </div>
        
        {error && <p className="bg-red-100 text-red-700 p-3.5 rounded-md mb-5 text-sm shadow-sm border border-red-200">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="username">
              Username
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-150"
              id="username"
              type="text"
              placeholder="e.g., johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
                <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-150"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                />
                 <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-green-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
          </div>
          <div>
            <button
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 w-full transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('register')} 
            className="font-semibold text-green-600 hover:text-green-700 hover:underline focus:outline-none focus:ring-1 focus:ring-green-500 rounded"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;