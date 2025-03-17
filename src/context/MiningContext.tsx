
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface MiningContextType {
  coins: number;
  miningRate: number; // coins per mining session
  miningActive: boolean;
  miningComplete: boolean;
  nextMiningTime: Date | null;
  progress: number; // 0-100 for the mining circle
  adsWatched: number;
  totalAdsRequired: number;
  watchAd: () => void;
  startMining: () => void;
  collectMining: () => void;
  timeRemaining: number; // in seconds
}

const MiningContext = createContext<MiningContextType | undefined>(undefined);

export function MiningProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('coins');
    return saved ? parseFloat(saved) : 0;
  });
  const [miningRate] = useState<number>(12.5); // coins per mining session
  const [miningActive, setMiningActive] = useState<boolean>(false);
  const [miningComplete, setMiningComplete] = useState<boolean>(false);
  const [nextMiningTime, setNextMiningTime] = useState<Date | null>(() => {
    const saved = localStorage.getItem('nextMiningTime');
    return saved ? new Date(saved) : null;
  });
  const [progress, setProgress] = useState<number>(0);
  const [adsWatched, setAdsWatched] = useState<number>(() => {
    const saved = localStorage.getItem('adsWatched');
    return saved ? parseInt(saved) : 0;
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const totalAdsRequired = 2;

  // Check if mining is complete based on stored timestamp
  useEffect(() => {
    if (nextMiningTime) {
      const now = new Date();
      if (now >= nextMiningTime) {
        setMiningComplete(true);
      } else {
        // Calculate time remaining and start countdown
        const diff = Math.floor((nextMiningTime.getTime() - now.getTime()) / 1000);
        setTimeRemaining(diff > 0 ? diff : 0);
      }
    }
  }, [nextMiningTime]);

  // Update countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (miningActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          // Calculate progress percentage (reversed: 0% at start, 100% when done)
          const totalSeconds = 12 * 60 * 60; // 12 hours in seconds
          const elapsed = totalSeconds - newTime;
          const newProgress = Math.min(100, (elapsed / totalSeconds) * 100);
          setProgress(newProgress);
          
          if (newTime <= 0) {
            setMiningComplete(true);
            setMiningActive(true);
            clearInterval(timer as NodeJS.Timeout);
            
            // Show notification
            toast({
              title: "Mining Complete!",
              description: "Your coins are ready to collect!",
              duration: 5000,
            });
            
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [miningActive, timeRemaining]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('coins', coins.toString());
    if (nextMiningTime) {
      localStorage.setItem('nextMiningTime', nextMiningTime.toISOString());
    }
    localStorage.setItem('adsWatched', adsWatched.toString());
  }, [coins, nextMiningTime, adsWatched]);

  const watchAd = () => {
    // Simulate watching an ad
    setTimeout(() => {
      setAdsWatched(prev => {
        const newCount = prev + 1;
        toast({
          title: "Ad Watched!",
          description: `${newCount}/${totalAdsRequired} ads completed`,
          duration: 3000,
        });
        return newCount;
      });
    }, 3000);
  };

  const startMining = () => {
    // Reset ads watched
    setAdsWatched(0);
    
    // Set next mining time to 12 hours from now
    const nextTime = new Date();
    nextTime.setHours(nextTime.getHours() + 12);
    setNextMiningTime(nextTime);
    
    // Start mining
    setMiningActive(true);
    setMiningComplete(false);
    
    // Calculate initial time remaining
    const diff = Math.floor((nextTime.getTime() - new Date().getTime()) / 1000);
    setTimeRemaining(diff);
    
    // Reset progress
    setProgress(0);
    
    toast({
      title: "Mining Started!",
      description: "Come back in 12 hours to collect your coins",
      duration: 3000,
    });
  };

  const collectMining = () => {
    if (miningComplete) {
      setCoins(prev => prev + miningRate);
      setMiningActive(false);
      setMiningComplete(false);
      setProgress(0);
      
      toast({
        title: "Coins Collected!",
        description: `+${miningRate} coins added to your wallet`,
        duration: 3000,
      });
    }
  };

  const value = {
    coins,
    miningRate,
    miningActive,
    miningComplete,
    nextMiningTime,
    progress,
    adsWatched,
    totalAdsRequired,
    watchAd,
    startMining,
    collectMining,
    timeRemaining
  };

  return <MiningContext.Provider value={value}>{children}</MiningContext.Provider>;
}

export function useMining() {
  const context = useContext(MiningContext);
  if (context === undefined) {
    throw new Error('useMining must be used within a MiningProvider');
  }
  return context;
}
