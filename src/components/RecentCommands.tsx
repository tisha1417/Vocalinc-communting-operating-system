import React from 'react';
import { motion } from 'framer-motion';

const RecentCommands: React.FC = () => {
  const commands = [
    {
      command: 'Create maintenance ticket for Building A',
      time: '2 minutes ago',
      status: 'completed'
    },
    {
      command: 'Schedule community meeting for Friday',
      time: '15 minutes ago',
      status: 'completed'
    },
    {
      command: 'Check safety alerts for Zone 3',
      time: '1 hour ago',
      status: 'completed'
    },
    {
      command: 'Generate weekly report',
      time: '2 hours ago',
      status: 'processing'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800 rounded-xl p-6 border border-slate-700"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Recent Voice Commands</h3>
      <div className="space-y-4">
        {commands.map((command, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-700 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-white font-medium mb-1">{command.command}</p>
                <p className="text-slate-400 text-sm">{command.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                command.status === 'completed' 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-yellow-900 text-yellow-300'
              }`}>
                {command.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentCommands;