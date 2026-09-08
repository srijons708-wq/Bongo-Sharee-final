import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, X, Sparkles, Loader2 } from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export default function AIAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'হ্যালো! আমি আপনার বঙ্গ-শাড়ি এআই এজেন্ট। শাড়ি নির্বাচন বা যেকোনো তথ্যে আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      if (!apiKey) {
        throw new Error("Netlify-তে VITE_GEMINI_API_KEY সেট করুন।");
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: "আপনি বঙ্গ-শাড়ি (Bongo Sharee) প্ল্যাটফর্মের একজন দক্ষ এআই এজেন্ট। যেকোনো প্রশ্নের উত্তর সর্বদা অত্যন্ত নম্র ও সাবলীল বাংলায় দেবেন।"
        }
      });

      const reply = response.text || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      console.error("Gemini Error:", err);
      setMessages(prev => [...prev, { role: 'model', text: `এরর: ${err.message || 'এজেন্ট সংযোগ করতে পারছে না।'}` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col h-[500px] overflow-hidden">
      <div className="bg-gradient-to-r from-rose-900 to-rose-800 p-4 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <h3 className="font-semibold text-lg">বঙ্গ-শাড়ি AI Agent</h3>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`p-2 rounded-full ${msg.role === 'user' ? 'bg-rose-900 text-white' : 'bg-rose-100 text-rose-900'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-rose-900 text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm border rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-gray-500 text-sm p-2">
            <Loader2 className="w-4 h-4 animate-spin text-rose-800" />
            <span>AI এজেন্ট চিন্তা করছে...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t flex items-center space-x-2">
        <input
          type="text"
          placeholder="আপনার প্রশ্ন লিখুন..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-rose-800"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-rose-900 hover:bg-rose-800 text-white p-2 rounded-xl disabled:opacity-50 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
