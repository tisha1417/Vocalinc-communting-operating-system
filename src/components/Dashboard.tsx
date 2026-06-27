import React from 'react';
import { useAuth } from '../hooks/use-auth';
import { LogOut, User, Mail, Hash, Calendar } from 'lucide-react';

export function Dashboard() {
  const { user, profile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {profile?.first_name}!
              </h1>
              <p className="text-slate-400">
                You're successfully signed in to your account
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="
                flex items-center gap-2 px-6 py-3 
                bg-gradient-to-r from-red-600/20 to-red-500/20 
                border border-red-500/30 rounded-full text-red-400
                hover:bg-gradient-to-r hover:from-red-600/30 hover:to-red-500/30
                hover:border-red-500/50 transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/25
              "
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>

          {/* Profile Card */}
          <div className="
            bg-gradient-to-br from-black/50 via-slate-900/50 to-black/50 
            backdrop-blur-xl rounded-3xl p-8 
            border border-purple-500/20 shadow-2xl
          ">
            <div className="flex items-center gap-6 mb-8">
              <div className="
                w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 
                rounded-2xl flex items-center justify-center
                shadow-lg shadow-purple-500/25
              ">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <p className="text-slate-400">Member since {new Date(profile?.created_at || '').toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="
                bg-black/30 rounded-2xl p-6 border border-purple-500/10
                hover:border-purple-500/30 transition-all duration-300
              ">
                <div className="flex items-center gap-3 mb-3">
                  <Mail size={20} className="text-purple-400" />
                  <h3 className="text-white font-semibold">Email Address</h3>
                </div>
                <p className="text-slate-300">{user?.email}</p>
              </div>

              <div className="
                bg-black/30 rounded-2xl p-6 border border-purple-500/10
                hover:border-purple-500/30 transition-all duration-300
              ">
                <div className="flex items-center gap-3 mb-3">
                  <Hash size={20} className="text-purple-400" />
                  <h3 className="text-white font-semibold">Community ID</h3>
                </div>
                <p className="text-slate-300">{profile?.community_id}</p>
              </div>

              <div className="
                bg-black/30 rounded-2xl p-6 border border-purple-500/10
                hover:border-purple-500/30 transition-all duration-300
              ">
                <div className="flex items-center gap-3 mb-3">
                  <User size={20} className="text-purple-400" />
                  <h3 className="text-white font-semibold">Full Name</h3>
                </div>
                <p className="text-slate-300">{profile?.first_name} {profile?.last_name}</p>
              </div>

              <div className="
                bg-black/30 rounded-2xl p-6 border border-purple-500/10
                hover:border-purple-500/30 transition-all duration-300
              ">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar size={20} className="text-purple-400" />
                  <h3 className="text-white font-semibold">Member Since</h3>
                </div>
                <p className="text-slate-300">
                  {new Date(profile?.created_at || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Additional sections can be added here */}
          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Your account is fully set up and ready to use!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}