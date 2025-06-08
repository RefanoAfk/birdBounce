import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";
import { useFarcaster } from "@/lib/farcaster";

interface FarcasterPanelProps {
  score: number;
}

export default function FarcasterPanel({ score }: FarcasterPanelProps) {
  const { shareHighScore, inviteFriends, isConnected } = useFarcaster();

  return (
    <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-purple-600">🐦</span>
          <span className="text-sm font-semibold text-purple-700">Farcaster Features</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'} rounded-full`}></div>
          <span className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="ghost"
          className="flex items-center justify-center space-x-2 p-3 bg-white hover:bg-gray-50 rounded-lg border border-purple-100"
          onClick={() => shareHighScore(score)}
        >
          <Trophy className="h-4 w-4 game-amber" />
          <span className="text-sm font-medium text-gray-700">Share Score</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex items-center justify-center space-x-2 p-3 bg-white hover:bg-gray-50 rounded-lg border border-purple-100"
          onClick={inviteFriends}
        >
          <Users className="h-4 w-4 game-green" />
          <span className="text-sm font-medium text-gray-700">Invite Friends</span>
        </Button>
      </div>
    </div>
  );
}
