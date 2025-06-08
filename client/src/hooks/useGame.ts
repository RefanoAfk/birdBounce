import { useState, useCallback, useEffect } from 'react';
import { useFarcaster } from '@/lib/farcaster';

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  bestScore: number;
  level: number;
  bird: {
    shouldJump: boolean;
  };
}

const BEST_SCORE_KEY = 'jumpBirdBestScore';

export const useGame = () => {
  const { triggerHaptic } = useFarcaster();
  
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    gameOver: false,
    score: 0,
    bestScore: parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0'),
    level: 1,
    bird: {
      shouldJump: false,
    },
  });

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      gameOver: false,
      score: 0,
      level: 1,
      bird: { shouldJump: false },
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const jump = useCallback(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      triggerHaptic('light');
      setGameState(prev => ({
        ...prev,
        bird: { shouldJump: true },
      }));
      
      // Reset jump flag after a short delay
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          bird: { shouldJump: false },
        }));
      }, 100);
    }
  }, [gameState.isPlaying, gameState.isPaused, triggerHaptic]);

  const gameOver = useCallback(() => {
    setGameState(prev => {
      const newBestScore = Math.max(prev.score, prev.bestScore);
      if (newBestScore > prev.bestScore) {
        localStorage.setItem(BEST_SCORE_KEY, newBestScore.toString());
      }
      
      return {
        ...prev,
        isPlaying: false,
        gameOver: true,
        bestScore: newBestScore,
      };
    });
    triggerHaptic('heavy');
  }, [triggerHaptic]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const incrementScore = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + 1,
      level: Math.floor(prev.score / 10) + 1,
    }));
  }, []);

  // Auto-increment score for demo purposes
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const interval = setInterval(() => {
        if (Math.random() < 0.02) { // 2% chance per frame
          incrementScore();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gameState.isPlaying, gameState.isPaused, incrementScore]);

  const gameActions = {
    startGame,
    pauseGame,
    jump,
    gameOver,
    restartGame,
    incrementScore,
  };

  return { gameState, gameActions };
};
