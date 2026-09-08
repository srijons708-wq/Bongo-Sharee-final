import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import AIAssistant from './components/ai/AIAssistant';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="ai-agent" element={<AIAssistant />} />
      </Route>
    </Routes>
  );
}
