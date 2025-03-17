
import React from 'react';
import BottomNav from './BottomNav';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'CoinTap';
      case '/wallet':
        return 'Wallet';
      case '/profile':
        return 'Profile';
      case '/community':
        return 'Community';
      default:
        return 'CoinTap';
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-app-dark relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-app-blue/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-app-purple/10 rounded-full blur-[100px] -z-10" />
      
      {/* Page header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-app-dark/80 border-b border-white/5">
        <div className="container py-4 px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
              <span className="text-app-yellow mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" opacity="0.2" />
                  <path d="M12 4L12 8M12 16L12 20M4 12L8 12M16 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-white/90">Silver</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container px-4 py-4 flex flex-col">
        {children}
      </main>
      
      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
