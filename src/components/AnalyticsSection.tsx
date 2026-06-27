import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsSection: React.FC = () => {
  const voiceCommandsData = [
    { time: '00:00', commands: 12 },
    { time: '04:00', commands: 8 },
    { time: '08:00', commands: 45 },
    { time: '12:00', commands: 67 },
    { time: '16:00', commands: 89 },
    { time: '20:00', commands: 34 },
    { time: '24:00', commands: 23 }
  ];

  const eventsData = [
    { month: 'Jan', events: 12, participants: 340 },
    { month: 'Feb', events: 19, participants: 520 },
    { month: 'Mar', events: 15, participants: 430 },
    { month: 'Apr', events: 25, participants: 680 },
    { month: 'May', events: 22, participants: 590 },
    { month: 'Jun', events: 18, participants: 490 }
  ];

  const sosCallsData = [
    { name: 'Resolved', value: 85, color: '#10B981' },
    { name: 'In Progress', value: 12, color: '#F59E0B' },
    { name: 'Critical', value: 3, color: '#EF4444' }
  ];

  const techniciansData = [
    { day: 'Mon', available: 15, total: 20 },
    { day: 'Tue', available: 18, total: 20 },
    { day: 'Wed', available: 12, total: 20 },
    { day: 'Thu', available: 16, total: 20 },
    { day: 'Fri', available: 14, total: 20 },
    { day: 'Sat', available: 10, total: 15 },
    { day: 'Sun', available: 8, total: 15 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6">Analytics Overview</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Commands Chart */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-4">Voice Commands Today</h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={voiceCommandsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="commands" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Events and Participants */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-4">Events & Participants</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={eventsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="events" fill="#14B8A6" />
                <Bar dataKey="participants" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* SOS Calls Status */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-4">SOS Calls Status</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sosCallsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {sosCallsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Technicians Availability */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-4">Technicians Availability</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={techniciansData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="available" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="total" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsSection;