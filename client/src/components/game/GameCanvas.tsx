import { useEffect, useRef } from "react";
import { GameState } from "@/hooks/useGame";
import { GameEngine } from "@/lib/gameEngine";

interface GameCanvasProps {
  gameState: GameState;
  onJump: () => void;
  onGameOver: () => void;
}

export default function GameCanvas({ gameState, onJump, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas, ctx, onGameOver);

    // Handle resize
    const handleResize = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Handle touch/click for jumping
    const handleTouch = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      if (gameState.isPlaying && !gameState.isPaused) {
        onJump();
      }
    };

    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('click', handleTouch);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('click', handleTouch);
    };
  }, [gameState.isPlaying, gameState.isPaused, onJump, onGameOver]);

  useEffect(() => {
    const engine = gameEngineRef.current;
    if (!engine) return;

    if (gameState.isPlaying && !gameState.isPaused) {
      engine.start(gameState);
    } else {
      engine.stop();
    }
  }, [gameState.isPlaying, gameState.isPaused]);

  useEffect(() => {
    const engine = gameEngineRef.current;
    if (engine && gameState.bird.shouldJump) {
      engine.jump();
    }
  }, [gameState.bird.shouldJump]);

  return (
    <div className="flex-1 relative game-sky-gradient rounded-2xl overflow-hidden shadow-lg mb-4">
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute inset-0"
        width={400}
        height={600}
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Clouds */}
        <div className="absolute top-8 left-4 opacity-60">
          <div className="w-16 h-8 bg-white rounded-full"></div>
          <div className="w-12 h-6 bg-white rounded-full -mt-3 ml-6"></div>
        </div>
        <div className="absolute top-20 right-8 opacity-40">
          <div className="w-20 h-10 bg-white rounded-full"></div>
          <div className="w-14 h-7 bg-white rounded-full -mt-4 ml-8"></div>
        </div>
      </div>
    </div>
  );
}
