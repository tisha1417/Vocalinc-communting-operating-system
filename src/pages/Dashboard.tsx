import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Calendar, AlertTriangle, Users, Shield } from 'lucide-react';
import RecentCommands from '../components/RecentCommands';
import SystemStatus from '../components/SystemStatus';
import AnalyticsSection from '../components/AnalyticsSection';
import FeedbackForm from '../components/FeedbackForm';
import { useAuth } from '../hooks/use-auth';
import { Dashboard as ResidentDashboardProfile } from '../components/Dashboard';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();

  if (profile?.role === 'user') {
    return <ResidentDashboardProfile />;
  }

  const stats = [
    {
      icon: Calendar,
      label: 'Upcoming Events',
      value: '8',
      change: '+12%',
      changeType: 'positive' as const,
      color: 'bg-teal-600'
    },
    {
      icon: AlertTriangle,
      label: 'SOS Calls',
      value: '3',
      change: '-2',
      changeType: 'negative' as const,
      color: 'bg-red-600'
    },
    {
      icon: Mic,
      label: 'Voice Commands Today',
      value: '156',
      change: '+23%',
      changeType: 'positive' as const,
      color: 'bg-indigo-600'
    },
    {
      icon: Users,
      label: 'Technicians Available',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      color: 'bg-green-600'
    },
    {
      icon: Shield,
      label: 'Participant Estimates',
      value: '1,247',
      change: '+8%',
      changeType: 'positive' as const,
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400">Community management overview</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Commands and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCommands />
        <SystemStatus />
      </div>

      {/* Analytics Section */}
      <AnalyticsSection />

      {/* Feedback Form */}
      <FeedbackForm />
    </div>
  );
};

export default Dashboard;