
import React from 'react';

interface UserRanking {
  id: number;
  name: string;
  avatar: string;
  rank: number;
  coins: number;
  isCurrentUser?: boolean;
}

const RankingCard: React.FC<{ user: UserRanking }> = ({ user }) => {
  return (
    <div className={`p-3 rounded-lg flex items-center justify-between ${user.isCurrentUser ? 'bg-app-blue/10 border border-app-blue/30' : 'glass-card'}`}>
      <div className="flex items-center">
        <div className="w-8 h-8 flex items-center justify-center font-semibold text-white/70 mr-3">
          #{user.rank}
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-medium">
            {user.name}
            {user.isCurrentUser && (
              <span className="ml-2 text-xs bg-app-blue/20 text-app-blue px-2 py-0.5 rounded-full">
                You
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">{user.coins.toLocaleString()}</div>
        <div className="text-xs text-white/60">coins</div>
      </div>
    </div>
  );
};

export default RankingCard;
