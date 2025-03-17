
import React from 'react';
import { GameController, Gift, Calendar, Lock } from 'lucide-react';

const StatCards: React.FC = () => {
  const stats = [
    {
      id: 1,
      title: 'Daily Game Play',
      icon: <GameController className="h-6 w-6 text-app-blue" />,
      timer: '13:11:35',
    },
    {
      id: 2,
      title: 'Daily Reward',
      icon: <Gift className="h-6 w-6 text-app-blue" />,
      timer: '13:11:15',
    },
    {
      id: 3,
      title: 'Daily Combo',
      icon: <Calendar className="h-6 w-6 text-app-blue" />,
      timer: '02:33:48',
    },
    {
      id: 4,
      title: 'Daily Secret Code',
      icon: <Lock className="h-6 w-6 text-app-blue" />,
      timer: '23:16:33',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-2 mb-6">
      {stats.map((stat) => (
        <div key={stat.id} className="stat-card">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-app-blue/10 flex items-center justify-center mb-2">
              {stat.icon}
            </div>
            <span className="text-xs text-white/70 mb-1">{stat.title}</span>
            <span className="text-sm font-medium">{stat.timer}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
