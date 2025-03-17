
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, User, Users } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/',
    },
    {
      name: 'Wallet',
      icon: Wallet,
      path: '/wallet',
    },
    {
      name: 'Profile',
      icon: User,
      path: '/profile',
    },
    {
      name: 'Community',
      icon: Users,
      path: '/community',
    },
  ];
  
  return (
    <nav className="sticky bottom-0 w-full bg-app-card/80 backdrop-blur-lg border-t border-white/5 z-10">
      <div className="container px-4 py-3">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : 'text-white/60'}`}
              >
                <div className="relative">
                  {isActive && (
                    <div className="absolute inset-0 bg-app-blue/10 rounded-full -m-2 animate-pulse-ring" />
                  )}
                  <Icon className="h-6 w-6 mb-1" />
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
