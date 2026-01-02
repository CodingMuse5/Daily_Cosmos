import { useState, useEffect } from 'react';
import api from './api';
import { jwtDecode } from "jwt-decode";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Login from './components/Login';
import Profile from './components/Profile';
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [asteroids, setAsteroids] = useState([]);


  const backgroundImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";

  // 1. LOGIN CHECK & DATA FETCHING
  // 1. LOGIN CHECK & DATA FETCHING
  // 1. LOGIN CHECK & DATA FETCHING
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const config = { headers: { 'x-auth-token': token } };

          // A. Get User Profile (Rank)
          // We use 'api' instead of 'axios', and remove the localhost part
          const userRes = await api.get('/auth/me', config);
          setUser(userRes.data);

          // B. Get Daily Post
          const postRes = await api.get('/daily');
          setPost(postRes.data);

          // C. Get Space Buddies
          const buddiesRes = await api.get('/users/buddies', config);
          setBuddies(buddiesRes.data);

          // D. Get Asteroids
          const asteroidRes = await api.get('/asteroids');
          setAsteroids(asteroidRes.data);

          setLoading(false);
        } catch (err) {
          console.error("Error loading data:", err);
          logout(); 
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleAddFriend = async (friendId) => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      
      // UPDATED: Uses 'api' and short path
      await api.put(`/users/add/${friendId}`, {}, config);
      
      // Update local user state
      setUser({ ...user, friends: [...(user.friends || []), friendId] });
      
    } catch (err) {
      console.error("Friend Error:", err);
    }
  };

  // 2. HANDLE LIKE BUTTON
 // 2. HANDLE LIKE BUTTON
  const handleLike = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      
      // UPDATED: Uses 'api' and short path
      const res = await api.put(`/posts/like/${post.date}`, {}, config);
      
      // Update the post with new likes immediately
      setPost({ ...post, likes: res.data });
      
      // Refresh buddies list (because liking might create new matches!)
      const buddiesRes = await api.get('/users/buddies', config);
      setBuddies(buddiesRes.data);

    } catch (err) {
      console.error(err);
    }
  };

  

  // 3. LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setPost(null);
  };

  // --- RENDERING ---

  // SCENARIO 1: Not Logged In -> Show Login Screen
  if (!token) return <Login />;

  // SCENARIO 2: Logged In but Loading -> Show Spinner
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-50 blur-sm" style={{ backgroundImage: `url('${backgroundImageUrl}')` }}></div>
        <div className="text-2xl animate-pulse relative z-10 font-bold">Establishing Uplink...</div>
      </div>
    );
  }

  // SCENARIO 3: Dashboard -> Show Data
  // SCENARIO 3: VIEW CHECK
  if (view === 'profile') {
    return <Profile user={user} goBack={() => setView('home')} />;
  }

  // Rank Helper
  const getRank = (likes) => {
    if (likes >= 10) return "🌟 Commander";
    if (likes >= 5) return "🚀 Pilot";
    return "👨‍🚀 Cadet";
  };

  // SCENARIO 4: Dashboard (Home)
  return (
    <div 
      className="min-h-screen text-white p-4 flex flex-col items-center bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url('${backgroundImageUrl}')` }}
    >
      <nav className="w-full max-w-6xl flex justify-between items-center py-6 mb-8 relative z-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          DailyCosmos
        </h1>
        <div className="flex items-center gap-4">
  
  {/* 1. The Rank Display (NEW!) */}
  <div className="text-right hidden sm:block mr-2">
    <p className="text-sm font-bold text-white">
      {user?.username}
    </p>
    <p className="text-xs text-blue-300 font-mono uppercase tracking-widest">
      {user ? getRank(user.likeCount) : 'Loading...'}
    </p>
  </div>

  {/* 2. My Profile Button */}
  <button 
    onClick={() => setView('profile')}
    className="text-gray-300 hover:text-white font-medium transition"
  >
    My Profile
  </button>
  
  {/* 3. Logout Button */}
  <button onClick={logout} className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-full hover:bg-red-500/40 transition backdrop-blur-sm">
    Abort Mission
  </button>
</div>
      </nav>

      {/* ... (Keep the rest of your Dashboard Grid Code exactly the same as before) ... */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* ... Left Column (Post) and Right Column (Buddies) ... */}
          {/* PASTE YOUR EXISTING GRID CODE HERE */}
          
          {/* Need me to paste the full grid code again? Let me know if you lost it! */}
          <div className="md:col-span-2">
            {post && (
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <div className="relative h-96 w-full bg-black/50">
                  {post.mediaType === 'video' ? (
                    <iframe src={post.imageUrl} className="w-full h-full object-cover" title="Space Video" allowFullScreen></iframe>
                  ) : (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-contain" />
                  )}
                </div>

                <div className="p-8 bg-gradient-to-b from-transparent to-gray-950/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold mb-3 text-white drop-shadow-md">{post.title}</h2>
                      <span className="px-3 py-1 bg-blue-500/30 text-blue-200 text-sm rounded-full border border-blue-400/30">{post.date}</span>
                    </div>
                    <button onClick={handleLike} className="flex flex-col items-center group">
                      {post.likes.includes(user?.id) ? (
                        <FaHeart className="text-4xl text-red-500 drop-shadow-glow transition-all transform scale-110" />
                      ) : (
                        <FaRegHeart className="text-4xl text-gray-400 group-hover:text-red-400 transition-all" />
                      )}
                      <span className="text-sm mt-1 text-gray-400 group-hover:text-white">{post.likes.length}</span>
                    </button>
                  </div>
                  <p className="text-gray-200 leading-relaxed text-lg tracking-wide mt-4">{post.explanation}</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Buddies & Asteroids */}
        <div className="md:col-span-1 flex flex-col gap-6">
          
          {/* 1. Space Buddies Panel */}
          <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 min-h-[300px]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-300">
              <span>👾</span> Space Buddies
            </h3>
            
            {buddies.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <p className="mb-2">No signals detected...</p>
                <p className="text-xs">Like posts to find friends!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {buddies.map(buddy => (
                  <div key={buddy._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs">
                        {buddy.username.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{buddy.username}</p>
                        <p className="text-xs text-blue-300">Score: {buddy.matchScore}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddFriend(buddy._id)}
                      disabled={user?.friends?.includes(buddy._id)}
                      className={`text-xs px-2 py-1 rounded-full transition ${
                        user?.friends?.includes(buddy._id)
                          ? "bg-green-600/20 text-green-400 border border-green-500/50 cursor-default"
                          : "bg-blue-600 hover:bg-blue-500 text-white"
                      }`}
                    >
                      {user?.friends?.includes(buddy._id) ? "✓ Added" : "Add"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Asteroid Watch Panel (NEW!) */}
          <div className="bg-red-900/20 backdrop-blur-xl p-6 rounded-3xl border border-red-500/30">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
              <span>☄️</span> Near Earth Objects
            </h3>
            <p className="text-xs text-red-200 mb-4 uppercase tracking-widest">Passing Earth Today</p>
            
            <div className="space-y-3">
              {asteroids.length === 0 ? (
                 <p className="text-sm text-gray-400 animate-pulse">Scanning deep space...</p>
              ) : (
                asteroids.map(rock => (
                  <div key={rock.id} className="p-3 bg-black/40 rounded-lg border border-red-500/10 hover:border-red-500/50 transition">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-gray-200">{rock.name.replace('(', '').replace(')', '')}</span>
                      {rock.hazardous && (
                        <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">HAZARD</span>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Size: {rock.diameter}m</span>
                      <span>{rock.speed} km/h</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;