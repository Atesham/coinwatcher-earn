
import React from 'react';
import { useMining } from '@/context/MiningContext';
import CountdownTimer from './CountdownTimer';
import { Coins, Zap } from 'lucide-react';
import AdModal from './AdModal';
import { useToast } from '@/components/ui/use-toast';

const MiningCircle: React.FC = () => {
  const { 
    miningActive, 
    miningComplete, 
    progress, 
    adsWatched, 
    totalAdsRequired,
    collectMining, 
    startMining 
  } = useMining();
  
  const [showAdModal, setShowAdModal] = React.useState(false);
  const { toast } = useToast();
  
  const circumference = 2 * Math.PI * 110; // Circle radius is 110
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const handleMiningButtonClick = () => {
    if (miningComplete) {
      collectMining();
    } else if (!miningActive) {
      if (adsWatched < totalAdsRequired) {
        setShowAdModal(true);
      } else {
        startMining();
      }
    } else {
      toast({
        title: "Mining in Progress",
        description: "Your mining session is already active. Please wait for it to complete.",
        duration: 3000
      });
    }
  };
  
  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Progress ring */}
      <div className="relative w-[240px] h-[240px]">
        {/* Background circle */}
        <svg
          className="w-full h-full"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="120"
            cy="120"
            r="110"
            stroke="#2A2A36"
            strokeWidth="8"
            fill="none"
          />
        </svg>
        
        {/* Progress circle */}
        <svg
          className="absolute top-0 left-0 w-full h-full -rotate-90 transition-all duration-500 ease-in-out"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="120"
            cy="120"
            r="110"
            stroke="url(#blue-gradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#54A9FF" />
              <stop offset="100%" stopColor="#1E90FF" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Mining button */}
        <button
          onClick={handleMiningButtonClick}
          className="mining-btn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full"
        >
          {/* Button background */}
          <div className="absolute inset-0 rounded-full glass-card flex items-center justify-center overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-app-blue/5 rounded-full" />
            
            {/* Animated rings */}
            {miningActive && !miningComplete && (
              <>
                <div className="mining-btn-ring w-[170px] h-[170px]" style={{ animationDelay: '0s' }}></div>
                <div className="mining-btn-ring w-[190px] h-[190px]" style={{ animationDelay: '0.5s' }}></div>
                <div className="mining-btn-ring w-[210px] h-[210px]" style={{ animationDelay: '1s' }}></div>
              </>
            )}
            
            {/* Button content */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {miningComplete ? (
                // Collect state
                <>
                  <Coins className="w-14 h-14 text-app-yellow animate-float" />
                  <span className="text-lg font-semibold mt-2 text-white">Collect Now</span>
                </>
              ) : miningActive ? (
                // Mining in progress state
                <>
                  <div className="rounded-full p-4 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/0893cc6f-a420-4cf5-b4d6-91708e09e30c.png" 
                      alt="Mining Mascot" 
                      className="w-20 h-20 object-cover animate-float"
                    />
                  </div>
                  <CountdownTimer />
                </>
              ) : (
                // Start mining state
                <>
                  <Zap className="w-14 h-14 text-app-blue animate-float" />
                  <span className="text-lg font-semibold mt-2 text-white">Start Mining</span>
                  <span className="text-xs text-white/60 mt-1">
                    {adsWatched}/{totalAdsRequired} ads watched
                  </span>
                </>
              )}
            </div>
          </div>
        </button>
      </div>
      
      {/* Energy indicator at bottom of circle */}
      <div className="mt-4 bg-app-card rounded-full px-4 py-2 flex items-center space-x-2">
        <Zap className="h-4 w-4 text-app-yellow" />
        <span className="text-sm font-medium text-white">1500/1500</span>
      </div>
      
      {/* Ad modal */}
      <AdModal isOpen={showAdModal} onClose={() => setShowAdModal(false)} />
    </div>
  );
};

export default MiningCircle;
