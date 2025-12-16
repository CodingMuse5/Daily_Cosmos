import { useState } from 'react';
import api from '../api'; // <--- IMPORTANT: We import our smart API tool here

const Login = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const { username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const route = isLogin ? '/auth/login' : '/auth/register';
      
      const res = await api.post(route, formData); // <--- Using 'api.post'

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setMessage(isLogin ? "Authentication Verified 🚀" : "Welcome Aboard! 🎉");
      
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Connection Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://www.nasa.gov/sites/default/files/thumbnails/image/main_image_deep_field_smacs0723-5mb.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 bg-black/80 p-8 rounded-2xl border border-blue-500/30 shadow-[0_0_50px_rgba(0,100,255,0.3)] w-96 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Mission Control
        </h1>
        <p className="text-gray-400 text-center text-xs tracking-widest mb-8">IDENTIFY YOURSELF</p>

        {message && (
          <div className={`p-3 mb-4 rounded text-center text-sm font-bold ${message.includes('Failed') ? 'bg-red-900/50 text-red-200 border border-red-500' : 'bg-green-900/50 text-green-200 border border-green-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" 
              name="username" 
              value={username} 
              onChange={onChange}
              placeholder="Pilot Callsign (Username)" 
              className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500 transition"
              required 
            />
          )}
          
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={onChange}
            placeholder="Comms Channel (Email)" 
            className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500 transition"
            required 
          />
          
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={onChange}
            placeholder="Security Code" 
            className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500 transition"
            required 
          />

          <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded font-bold text-white hover:shadow-[0_0_20px_rgba(0,100,255,0.5)] transition transform hover:scale-105">
            {isLogin ? "Initiate Launch Sequence 🚀" : "Register Credentials 📝"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
            className="text-blue-400 text-sm hover:text-blue-300 underline underline-offset-4"
          >
            {isLogin ? "No clearance code? Request Access" : "Already have credentials? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;