import React from 'react';
import { MapPin } from 'lucide-react';

export const SafeRoutes: React.FC = () => {
  const routes = [
    {
      name: 'Main Campus Route',
      distance: '1.2 km',
      safety: '95% safe',
      color: 'from-teal-500 to-cyan-500',
      points: ['Library', 'Student Center', 'Parking A']
    },
    {
      name: 'Evening Safe Path',
      distance: '0.8 km',
      safety: '98% safe',
      color: 'from-green-500 to-emerald-500',
      points: ['Security Office', 'Well-lit Path', 'Emergency Stations']
    },
    {
      name: 'Residential Area',
      distance: '1.5 km',
      safety: '92% safe',
      color: 'from-blue-500 to-indigo-500',
      points: ['Dorms', 'Cafeteria', 'Health Center']
    }
  ];

  return (
    <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-teal-400" />
        <h3 className="text-xl font-semibold text-white">Safe Routes</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((route, index) => (
          <div key={index} className="bg-slate-700 bg-opacity-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-white text-sm">{route.name}</h4>
              <span className="text-green-400 text-xs font-semibold bg-green-400 bg-opacity-20 px-2 py-1 rounded">
                {route.safety}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{route.distance}</p>
            
            <div className="space-y-2">
              {route.points.map((point, pointIndex) => (
                <div key={pointIndex} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-400 text-xs">{point}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};