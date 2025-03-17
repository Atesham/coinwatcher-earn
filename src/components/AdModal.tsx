
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Play, Check } from 'lucide-react';
import { useMining } from '@/context/MiningContext';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose }) => {
  const { adsWatched, totalAdsRequired, watchAd, startMining } = useMining();
  const [watching, setWatching] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [currentAd, setCurrentAd] = useState(1);
  
  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setWatching(false);
      setAdProgress(0);
    }
  }, [isOpen]);
  
  // Simulate ad progress
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (watching) {
      timer = setInterval(() => {
        setAdProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            setWatching(false);
            watchAd();
            // Increment current ad after completion
            setCurrentAd(prev => prev + 1);
            return 0;
          }
          return newProgress;
        });
      }, 30); // 3 seconds total (30ms * 100)
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [watching, watchAd]);
  
  const handleStartWatching = () => {
    setWatching(true);
  };
  
  const handleStartMining = () => {
    startMining();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-app-card border-white/10 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Watch Ads to Mine</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-white/70">
            Watch {totalAdsRequired} short ads to start mining. Your mining progress will be active for 12 hours.
          </p>
          
          <div className="bg-app-dark rounded-xl overflow-hidden">
            {adsWatched < totalAdsRequired ? (
              <div className="p-6 flex flex-col items-center">
                {watching ? (
                  // Ad watching state
                  <>
                    <div className="w-full max-w-xs aspect-video bg-app-card rounded-lg flex items-center justify-center mb-4">
                      <div className="text-white/30 animate-pulse">Ad playing...</div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div 
                        className="bg-app-blue h-2 rounded-full transition-all duration-300 ease-linear"
                        style={{ width: `${adProgress}%` }}
                      />
                    </div>
                    
                    <p className="text-sm text-white/60">
                      Please watch the entire ad ({Math.floor((100 - adProgress) * 0.03)}s remaining)
                    </p>
                  </>
                ) : (
                  // Ad ready to watch state
                  <>
                    <div className="w-full max-w-xs aspect-video bg-app-dark/50 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-app-blue/20 to-app-purple/20" />
                      <button 
                        onClick={handleStartWatching}
                        className="bg-white/90 hover:bg-white text-app-dark rounded-full w-16 h-16 flex items-center justify-center transition-transform duration-200 hover:scale-105"
                      >
                        <Play className="h-8 w-8 fill-current" />
                      </button>
                    </div>
                    
                    <p className="text-center text-sm text-white/70">
                      Ad {currentAd} of {totalAdsRequired}
                    </p>
                  </>
                )}
              </div>
            ) : (
              // All ads watched
              <div className="p-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-app-green/10 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-app-green" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">All Ads Completed!</h3>
                <p className="text-center text-white/70 mb-4">
                  You're ready to start mining. Your session will last for 12 hours.
                </p>
                
                <button
                  onClick={handleStartMining}
                  className="w-full bg-app-blue hover:bg-app-light-blue text-white font-medium py-3 rounded-lg transition-colors duration-200"
                >
                  Start Mining Now
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Ads watched: {adsWatched}/{totalAdsRequired}</span>
            <span className="text-white/60">Mining duration: 12 hours</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdModal;
