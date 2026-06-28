import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Settings, Shield, Calendar, BarChart3, Mic, LogOut, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile } = useAuth();

  const allMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Settings, label: 'Operations', path: '/operations', adminOnly: true },
    { icon: Shield, label: 'Aura Safety Engine', path: '/aura-safety-engine' },
    { icon: Calendar, label: 'Event Hub', path: '/event-hub' },
    { icon: Settings, label: 'Active Requests', path: '/complaints' },
  ];

  const menuItems = allMenuItems.filter(item => 
    !item.adminOnly || profile?.role === 'admin'
  );

  const handleSignOut = async () => {
    await signOut();
    window.location.reload(); 
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          w-80 bg-slate-800 border-r border-slate-700 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white text-lg font-semibold">VocaLinc</h2>
                <p className="text-slate-400 text-sm">Voice-First Platform</p>
              </div>
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="md:hidden text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-700">
          <div className="mb-4">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Logged In As</p>
            <p className="text-white font-medium">{profile?.first_name} {profile?.last_name || 'User'}</p>
            <p className="text-indigo-400 text-sm capitalize">{profile?.role || 'Loading Role...'}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;