import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function SiteLayout({ onOpenAI }) {
  return (
    <div className="min-h-screen flex flex-col bg-amber-50/20">
      <Navbar onOpenAI={onOpenAI} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
