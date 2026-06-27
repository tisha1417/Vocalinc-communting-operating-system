import { useAuth } from "@/hooks/use-auth";
import { ManagerDashboard } from "@/components/ManagerDashboard";
import { ResidentDashboard } from "@/components/ResidentDashboard";

const EventHub = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-white">Loading Event Hub...</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-y-auto">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Event Hub Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="w-6 h-6 bg-white rounded-lg"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Event Hub</h1>
              <p className="text-gray-400">Community events and engagement platform</p>
            </div>
          </div>
        </div>

        {/* Role-based Content */}
        {profile?.role === "admin" ? <ManagerDashboard /> : <ResidentDashboard />}
      </div>
    </div>
  );
};

export default EventHub;
