import React from 'react';
import { motion } from 'framer-motion';

const SystemStatus: React.FC = () => {
  const systems = [
    {
      name: 'Voice Recognition',
      status: 'Operational',
      uptime: '99.9%',
      color: 'green'
    },
    {
      name: 'Safety Engine',
      status: 'Operational',
      uptime: '100%',
      color: 'green'
    },
    {
      name: 'Event Hub',
      status: 'Operational',
      uptime: '99.8%',
      color: 'green'
    },
    {
      name: 'Analytics',
      status: 'Maintenance',
      uptime: '95.2%',
      color: 'yellow'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800 rounded-xl p-6 border border-slate-700"
    >
      <h3 className="text-xl font-semibold text-white mb-6">System Status</h3>
      <div className="space-y-4">
        {systems.map((system, index) => (
          <motion.div
            key={system.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                system.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-white font-medium">{system.name}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">{system.uptime}</div>
              <div className={`text-sm ${
                system.color === 'green' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {system.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SystemStatus;