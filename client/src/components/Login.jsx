import { useState } from 'react';
import api from '../api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  // Background Image (Deep Space Nebula)
  const bgImage = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022&auto=format&fit=crop";

  const { username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      // OLD: const url = isLogin ? 'http://localhost:5000...' : ...
      // NEW: We just use the endpoint path
      const route = isLogin ? '/auth/login' : '/auth/register';
      
      const res = await api.post(route, formData); // <--- Uses 'api' instead of 'axios'
      
      localStorage.setItem('token', res.data.token);
      setMessage(isLogin ? "Authentication Verified 🚀" : "Welcome Aboard! 🎉");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Connection Failed");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center text-white relative bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* The Glass Card */}
      <div className="relative z-10 bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
        
        <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
          {isLogin ? 'Mission Control' : 'Cadet Registration'}
        </h2>
        <p className="text-center text-gray-300 mb-8 text-sm tracking-widest uppercase">
          {isLogin ? 'Identify Yourself' : 'Join the Fleet'}
        </p>

        {message && (
          <div className={`p-3 mb-4 rounded text-center text-sm font-bold ${message.includes('Failed') ? 'bg-red-500/50 text-red-100' : 'bg-green-500/50 text-green-100'}`}>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          {!isLogin && (
            <input 
              type="text" name="username" placeholder="Astronaut Name" 
              value={username} onChange={onChange} 
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-400 transition"
              required 
            />
          )}
          
          <input 
            type="email" name="email" placeholder="Comms Channel (Email)" 
            value={email} onChange={onChange} 
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-400 transition"
            required 
          />
          
          <input 
            type="password" name="password" placeholder="Security Code" 
            value={password} onChange={onChange} 
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-400 transition"
            required 
          />
          
          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-bold shadow-lg transform hover:scale-[1.02] transition-all"
          >
            {isLogin ? 'Initiate Launch Sequence 🚀' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? "No clearance code? " : "Already have access? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-blue-300 hover:text-white font-bold ml-1 transition-colors underline"
            >
              {isLogin ? 'Request Access' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;