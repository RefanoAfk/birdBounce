import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GameState } from "@/hooks/useGame";
import { Play, RotateCcw, Share2 } from "lucide-react";

interface GameModalsProps {
  gameState: GameState;
  onStart: () => void;
  onRestart: () => void;
  onShare: () => void;
}

export default function GameModals({ gameState, onStart, onRestart, onShare }: GameModalsProps) {
  const showStartModal = !gameState.isPlaying && !gameState.gameOver;
  const showGameOverModal = gameState.gameOver;

  return (
    <>
      {/* Start Game Modal */}
      <Dialog open={showStartModal}>
        <DialogContent className="sm:max-w-md mx-4 bg-gradient-to-b from-blue-400 to-blue-500 border-none text-white">
          <DialogTitle className="sr-only">Start Game</DialogTitle>
          <DialogDescription className="sr-only">Welcome to Jump Bird game. Tap to make the bird jump and avoid obstacles!</DialogDescription>
          <div className="text-center px-6 py-8">
            <div className="text-6xl mb-4">🐦</div>
            <h2 className="text-3xl font-bold mb-2">Jump Bird</h2>
            <p className="text-blue-100 mb-8 text-lg">Tap to make the bird jump and avoid obstacles!</p>
            
            <Button
              onClick={onStart}
              className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-8 rounded-2xl text-xl shadow-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Game
            </Button>
            
            <div className="mt-6 text-blue-100 text-sm space-y-1">
              <p>🎮 Tap anywhere to jump</p>
              <p>📱 Avoid the green pipes</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Game Over Modal */}
      <Dialog open={showGameOverModal}>
        <DialogContent className="sm:max-w-xs mx-4">
          <DialogTitle className="sr-only">Game Over</DialogTitle>
          <DialogDescription className="sr-only">Game finished. Your final score and options to play again or share.</DialogDescription>
          <div className="text-center p-6">
            <div className="text-6xl mb-2">💔</div>
            <h2 className="text-2xl font-bold game-dark mb-2">Game Over!</h2>
            <div className="text-4xl font-bold game-amber mb-1">{gameState.score}</div>
            <div className="text-sm text-gray-500 mb-4">Your Score</div>
            
            <div className="space-y-3">
              <Button
                onClick={onRestart}
                className="w-full bg-game-blue hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
              <Button
                onClick={onShare}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share on Farcaster
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
