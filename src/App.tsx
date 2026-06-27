import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthForm } from "@/components/AuthForm";
import Dashboard from "@/views/Dashboard";

export default function Auth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900/50 to-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900/50 to-black">
      {user ? <Dashboard /> : <AuthForm />}
    </div>
  );
}
