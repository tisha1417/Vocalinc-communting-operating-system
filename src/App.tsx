import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthForm } from "@/components/AuthForm";
import Dashboard from "@/views/Dashboard";

export default function Auth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900/50 to-black"></div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900/50 to-black">
      {user ? <Dashboard /> : <AuthForm />}
    </div>
  );
}
