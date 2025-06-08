import { Button } from "@/components/ui/button";
import { Pause, Play, ArrowUp, Settings } from "lucide-react";

interface GameControlsProps {
  isPaused: boolean;
  onJump: () => void;
  onPause: () => void;
}

export default function GameControls({ isPaused, onJump, onPause }: GameControlsProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
      <Button
        variant="ghost"
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        onClick={onPause}
      >
        {isPaused ? <Play className="h-4 w-4 text-gray-600" /> : <Pause className="h-4 w-4 text-gray-600" />}
        <span className="text-gray-700 font-medium">{isPaused ? 'Resume' : 'Pause'}</span>
      </Button>
      
      <Button
        className="flex-1 mx-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg"
        onClick={onJump}
      >
        <div className="text-center">
          <ArrowUp className="h-6 w-6 mx-auto mb-1" />
          <div className="text-sm font-semibold">TAP TO JUMP</div>
        </div>
      </Button>
      
      <Button
        variant="ghost"
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        <Settings className="h-4 w-4 text-gray-600" />
        <span className="text-gray-700 font-medium">Settings</span>
      </Button>
    </div>
  );
}
