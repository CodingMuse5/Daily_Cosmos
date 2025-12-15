import { useEffect, useState } from 'react';
import api from '../api'; // <--- NEW IMPORT

const Profile = ({ user, goBack }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        
        // UPDATED: Uses our smart 'api' tool
        const res = await api.get('/posts/favorites', config);
        
        setFavorites(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Captain {user.username}'s Log
        </h2>
        <button 
          onClick={goBack}
          className="px-4 py-2 border border-gray-600 rounded-full hover:bg-white/10 transition"
        >
          ← Return to Bridge
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center animate-pulse mt-20">Retrieving Archive Data...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">Log is empty.</p>
          <p className="text-sm">Explore the cosmos and 'Like' posts to save them here.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(post => (
            <div key={post._id} className="bg-gray-800 rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition duration-300">
              <div className="h-48 bg-black">
                {post.mediaType === 'video' ? (
                   <iframe src={post.imageUrl} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <p className="text-blue-400 text-xs mb-1">{post.date}</p>
                <h3 className="font-bold text-lg truncate">{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;