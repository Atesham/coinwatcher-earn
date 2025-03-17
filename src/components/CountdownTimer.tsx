
import React from 'react';
import { useMining } from '@/context/MiningContext';

const CountdownTimer: React.FC = () => {
  const { timeRemaining } = useMining();
  
  // Convert seconds to hours, minutes, seconds
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;
  
  // Format time with leading zeros
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };
  
  return (
    <div className="flex flex-col items-center justify-center mt-2">
      <div className="text-sm font-medium text-white/70">Time Remaining</div>
      <div className="text-lg font-bold text-white">
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </div>
    </div>
  );
};

export default CountdownTimer;
