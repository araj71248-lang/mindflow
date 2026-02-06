
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import { ChatMessage } from '../types';
import { startChat } from '../services/geminiService';

interface ChatInterfaceProps {
  initialContext: string;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialContext, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sysPrompt = `You are MindFlow. Use this context about the user's current state: ${initialContext}. Be supportive, patient, and use short, comforting responses. Encourage them to breathe.`;
    chatRef.current = startChat(sysPrompt);
    
    // Initial greeting
    const greet = async () => {
      setIsLoading(true);
      try {
        const res = await chatRef.current.sendMessage({ message: "Hello! I'm here now. How would you like to talk? I'm listening." });
        setMessages([{ role: 'model', text: res.text }]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    greet();
  }, [initialContext]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I lost our connection for a second. Could you say that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl shadow-2xl border border-white/50 flex flex-col h-[70vh] overflow-hidden">
      <div className="bg-teal-500 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ICONS.Mic size={20} />
          </div>
          <div>
            <h3 className="font-bold">Chat with MindFlow</h3>
            <p className="text-xs opacity-80">Listening to your heart</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
          <ICONS.Close size={24} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-teal-500 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your thoughts..."
          className="flex-1 bg-slate-50 border-none outline-none focus:ring-2 focus:ring-teal-200 rounded-xl px-4 py-3 transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="bg-teal-500 text-white p-3 rounded-xl hover:bg-teal-600 disabled:opacity-50 shadow-lg shadow-teal-100 transition-all"
        >
          <ICONS.ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
