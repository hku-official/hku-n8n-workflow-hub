import React from 'react';
import { Link } from 'react-router-dom';
import { Workflow } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-24">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/hku-logo.svg" alt="HKU" className="h-[72px]" />
          <div className="h-8 w-px bg-gray-200 mx-1" />
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-hku-green" />
            <span className="text-lg font-bold tracking-tight text-gray-800">
              n8n <span className="text-hku-green">Workflow Hub</span>
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <a
            href="https://its.hku.hk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-hku-green transition-colors"
          >
            HKU ITS
          </a>
        </nav>
      </div>
    </header>
  );
}
