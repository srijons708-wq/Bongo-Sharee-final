import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, Sparkles, Loader2, ShoppingBag } from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'স্বাগতম! আমি আপনার বঙ্গ-শাড়ি স্মার্ট এআই এজেন্ট। আজ আপনার কেমন শাড়ি প্রয়োজন? অনুষ্ঠান, বাজেট বা রঙের কথা জানাতে পারেন।' }
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
        throw new Error("API Key পাওয়া যায়নি। Netlify-তে VITE_GEMINI_API_KEY সেট করুন।");
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: "আপনি বঙ্গ-শাড়ি (Bongo Sharee) প্ল্যাটফর্মের প্রফেশনাল এআই শপিং এজেন্ট। গ্রাহকের পছন্দ, বাজেট ও অনুষ্ঠান অনুযায়ী সেরা শাড়ি বেছে দিতে সাহায্য করবেন। সুন্দর ও শালীন বাংলায় সংক্ষিপ্ত পরামর্শ দেবেন।"
        }
      });

      const reply = response.text || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      console.error("Gemini Error:", err);
      setMessages(prev => [...prev, { role: 'model', text: `এরর: ${err.message || 'এজেন্ট রেসপন্স করতে পারছে না।'}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <div className="bg-white rounded-2xl shadow-xl border overflow-hidden flex flex-col h-[650px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-500 p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="font-bold text-xl">বঙ্গ-শাড়ি AI শপিং এজেন্ট</h2>
              <p className="text-xs text-pink-100">আপনার ব্যক্তিগত ফ্যাশন ও শাড়ি নির্বাচন সহকারী</p>
            </div>
          </div>
          <ShoppingBag className="w-6 h-6 text-pink-200" />
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2.5 rounded-full ${msg.role === 'user' ? 'bg-pink-600 text-white' : 'bg-rose-100 text-pink-600'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-pink-600 text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm border rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-gray-500 text-sm p-3 bg-white rounded-xl w-fit shadow-sm border">
              <Loader2 className="w-4 h-4 animate-spin text-pink-600" />
              <span>এজেন্ট ভাবছে...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t flex items-center space-x-3">
          <input
            type="text"
            placeholder="উদাহরণ: বিয়ের জন্য ১০,০০০ টাকার মধ্যে কাঞ্জিভরম শাড়ি দেখাও..."
            className="flex-1 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-pink-500 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl disabled:opacity-50 transition flex items-center space-x-2 font-medium text-sm"
          >
            <span>পাঠান</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
