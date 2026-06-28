import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;