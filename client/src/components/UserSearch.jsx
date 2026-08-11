
import React, { useState, useEffect } from 'react';
import api from '../api'; // <-- ADD THIS LINE

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. If search term is empty, clear results and don't make an API call
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    // 2. Set loading state while waiting for debounce timer
    setIsLoading(true);

    // 3. Debounce timer: Delay API call by 300ms after user stops typing
    const delayDebounceFn = setTimeout(async () => {
      try {
        // Grab the token for security
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };

        // Use api.get instead of fetch! 
        // Notice we changed response.json() to response.data
        const response = await api.get(`/users/search?q=${encodeURIComponent(searchTerm)}`, config);
        
        setResults(response.data); 
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    // 4. Cleanup timer if user types another character before 300ms finishes
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search space buddies by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 text-white bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5 text-xs text-cyan-400 animate-pulse">
            Searching...
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <ul className="mt-2 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden divide-y divide-slate-800">
          {results.map((user) => (
            <li
              key={user._id}
              className="p-3 hover:bg-slate-800 transition-colors flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium">{user.username}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* No Results Fallback */}
      {searchTerm.trim() !== '' && !isLoading && results.length === 0 && (
        <div className="mt-2 p-3 text-center text-sm text-slate-400 bg-slate-900 border border-slate-800 rounded-lg">
          No space buddies found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default UserSearch;