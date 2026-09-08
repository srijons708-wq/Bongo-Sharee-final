import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import AIAssistant from './components/ai/AIAssistant';

export default function App() {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<SiteLayout onOpenAI={() => setIsAIOpen(true)} />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>

      {/* Floating AI Button */}
      <button 
        onClick={() => setIsAIOpen(!isAIOpen)}
        className="fixed bottom-6 right-6 z-40 bg-rose-900 text-white p-4 rounded-full shadow-2xl hover:bg-rose-800 transition transform hover:scale-105 flex items-center justify-center"
      >
        <span className="font-bold text-sm mr-2">AI Agent</span>
        ✨
      </button>

      {/* Gemini AI Chat Window */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
}
