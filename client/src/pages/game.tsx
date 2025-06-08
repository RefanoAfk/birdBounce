import { useEffect } from "react";
import GameStats from "@/components/game/GameStats";
import GameCanvas from "@/components/game/GameCanvas";
import GameControls from "@/components/game/GameControls";
import GameModals from "@/components/game/GameModals";
import FarcasterPanel from "@/components/game/FarcasterPanel";
import { useGame } from "@/hooks/useGame";
import { Share, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFarcaster } from "@/lib/farcaster";

export default function Game() {
  const { gameState, gameActions } = useGame();
  const { shareGame, connectWallet } = useFarcaster();

  useEffect(() => {
    document.title = "Jump Bird - Farcaster Mini App";
  }, []);

  return (
    <div className="game-gradient-bg min-h-screen">
      <div className="container mx-auto px-4 py-2 max-w-md min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between py-4 mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🐦</span>
            </div>
            <h1 className="text-xl font-bold game-dark">Jump Bird</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg"
              onClick={shareGame}
            >
              <Share className="h-4 w-4 text-purple-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="p-2 bg-green-100 hover:bg-green-200 rounded-lg"
              onClick={connectWallet}
            >
              <Wallet className="h-4 w-4 game-green" />
            </Button>
          </div>
        </header>

        {/* Game Stats */}
        <GameStats 
          score={gameState.score}
          bestScore={gameState.bestScore}
          level={gameState.level}
        />

        {/* Game Canvas */}
        <GameCanvas
          gameState={gameState}
          onJump={gameActions.jump}
          onGameOver={gameActions.gameOver}
        />

        {/* Game Controls */}
        <GameControls
          isPaused={gameState.isPaused}
          onJump={gameActions.jump}
          onPause={gameActions.pauseGame}
        />

        {/* Farcaster Panel */}
        <FarcasterPanel score={gameState.score} />

        {/* Game Modals */}
        <GameModals
          gameState={gameState}
          onStart={gameActions.startGame}
          onRestart={gameActions.restartGame}
          onShare={() => shareGame(gameState.score)}
        />
      </div>
    </div>
  );
}
