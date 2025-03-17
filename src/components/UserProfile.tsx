
import React from 'react';
import { useMining } from '@/context/MiningContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserProfile: React.FC = () => {
  const { coins, miningRate } = useMining();
  const { userData } = useAuth();
  
  // Generate initials for avatar fallback
  const getInitials = () => {
    if (!userData || !userData.displayName) return "U";
    return userData.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get display name
  const getDisplayName = () => {
    if (!userData) return "User";
    return userData.displayName || userData.email.split('@')[0];
  };
  
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-app-blue">
          <Avatar className="w-full h-full">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed={userData?.email}" alt={getDisplayName()} />
            <AvatarFallback className="bg-app-blue/20 text-app-blue">{getInitials()}</AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute -bottom-2 right-0 bg-app-blue/90 text-white text-xs font-semibold rounded-full px-2 py-0.5 border border-app-dark">
          {userData?.rank || "Bronze"}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <h2 className="text-lg font-semibold">{getDisplayName()}</h2>
        <p className="text-sm text-white/60">Level {userData?.level || 1} Miner</p>
      </div>
      
      <div className="mt-4 glass-card rounded-xl w-full max-w-xs p-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-white/70 text-sm">Balance</span>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{coins.toFixed(2)}</span>
              <span className="ml-1 text-white/70 text-sm">coins</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white/70 text-sm">Rate</span>
            <div className="flex items-baseline">
              <span className="text-lg font-semibold text-app-green">+{miningRate}</span>
              <span className="ml-1 text-white/70 text-xs">/session</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-app-dark/50 rounded-lg p-2 flex justify-between">
          <div className="text-center flex-1">
            <div className="text-sm text-white/70">Daily</div>
            <div className="font-semibold">+{(miningRate * 2).toFixed(1)}</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-sm text-white/70">Weekly</div>
            <div className="font-semibold">+{(miningRate * 14).toFixed(1)}</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-sm text-white/70">Monthly</div>
            <div className="font-semibold">+{(miningRate * 60).toFixed(1)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
