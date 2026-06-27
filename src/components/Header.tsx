import React from 'react';
import { Mic } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-semibold">VocaLinc</h1>
              <p className="text-slate-400 text-sm">Voice-First Community</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">S</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;