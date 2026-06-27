import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthForm } from "@/components/AuthForm";
import Dashboard from "@/views/Dashboard";

export default function Auth() {
  const { user, loading } = useAuth();

  // We remove the loading block to ensure the app never hangs on "Loading..."

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900/50 to-black">
      {user ? <Dashboard /> : <AuthForm />}
    </div>
  );
}
