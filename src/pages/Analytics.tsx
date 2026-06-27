import React from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';
import AnalyticsSection from '../components/AnalyticsSection';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-slate-400">Detailed insights and performance metrics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Performance</h3>
          </div>
          <p className="text-slate-400">System performance metrics</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <PieChart className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Usage</h3>
          </div>
          <p className="text-slate-400">Feature usage statistics</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Reports</h3>
          </div>
          <p className="text-slate-400">Generated reports and insights</p>
        </div>
      </div>

      <AnalyticsSection />
    </div>
  );
};

export default Analytics;