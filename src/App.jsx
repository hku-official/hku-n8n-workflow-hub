import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FlowDetailPage from './pages/FlowDetailPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flow/:id" element={<FlowDetailPage />} />
        </Routes>
      </main>
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/hku-logo.svg" alt="HKU" className="h-8" />
            <span className="text-xs text-gray-400">Information Technology Services</span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} The University of Hong Kong. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
