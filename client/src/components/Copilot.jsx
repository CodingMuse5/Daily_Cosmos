import React, { useState } from 'react';

const Copilot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://daily-cosmos-1.onrender.com/api/copilot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages([...newMessages, { text: data.reply, sender: 'ai' }]);
    } catch (error) {
      console.error("Transmission error:", error);
      setMessages([...newMessages, { text: "Communication link failed. Please check backend connection.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. Matches your glassmorphism panels exactly
    <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col h-[450px]">
      
      {/* 2. New Name! */}
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
        <span>🤖</span> Nova AI
      </h3>

      {/* 3. The Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p className="mb-2 animate-pulse">Awaiting your command, Captain...</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-3 max-w-[85%] text-sm ${
              msg.sender === 'user' 
                ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-2xl rounded-tr-sm' 
                : 'bg-purple-600/20 border border-purple-500/30 text-purple-100 rounded-2xl rounded-tl-sm'
            }`}>
              <strong className="block text-[10px] uppercase tracking-wider mb-1 opacity-50">
                {msg.sender === 'user' ? 'You' : 'Nova'}
              </strong>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-purple-600/10 border border-purple-500/20 text-purple-300 px-4 py-3 rounded-2xl rounded-tl-sm text-sm italic animate-pulse">
                Nova is thinking...
             </div>
          </div>
        )}
      </div>

      {/* 4. The Input Form */}
      <form onSubmit={sendMessage} className="flex gap-2 mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Nova a question..."
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition placeholder-gray-500"
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Copilot;