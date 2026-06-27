import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { TechnicianHub } from "@/components/TechnicianHub";
import { MaintenanceSchedule } from "@/components/MaintenanceSchedule";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";

const Operations = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { profile, loading } = useAuth();

  const handleTicketCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If they are a normal user, redirect them to the Complaints (Active Requests) page
  if (profile?.role === 'user') {
    return <Navigate to="/complaints" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />

      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Operations Center (Admin)</h1>
              <p className="text-muted-foreground">
                Manage technicians and active requests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Technician Hub - Full Width */}
        <TechnicianHub refreshTrigger={refreshTrigger} />

        {/* Maintenance Schedule */}
        <MaintenanceSchedule refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default Operations;
