import { sdk } from '@farcaster/frame-sdk';
import { useEffect, useState } from 'react';

export const useFarcaster = () => {
  const [isReady, setIsReady] = useState(false);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        await sdk.actions.ready();
        const contextData = await sdk.context;
        setContext(contextData);
        setIsReady(true);
      } catch (error) {
        console.log('Farcaster SDK not available, running in standalone mode');
        setIsReady(true);
      }
    };

    initSDK();
  }, []);

  const shareGame = async (score?: number) => {
    const text = score
      ? `I just scored ${score} points in Jump Bird! 🐦✨ Can you beat my score?`
      : `Check out this fun Jump Bird game! 🐦🎮`;
    
    try {
      if (isReady && sdk) {
        await sdk.actions.composeCast({
          text,
          embeds: [window.location.href]
        });
      } else {
        // Fallback for non-Farcaster environments
        if (navigator.share) {
          await navigator.share({
            title: 'Jump Bird',
            text,
            url: window.location.href,
          });
        } else {
          navigator.clipboard?.writeText(`${text} ${window.location.href}`);
        }
      }
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  const shareHighScore = async (score: number) => {
    const text = `My best score in Jump Bird is ${score} points! 🏆 Join me and see if you can beat it!`;
    await shareGame(score);
  };

  const inviteFriends = async () => {
    const text = `Check out this fun Jump Bird game! 🐦🎮 Let's see who can get the highest score!`;
    await shareGame();
  };

  const connectWallet = async () => {
    try {
      if (isReady && sdk) {
        const provider = await sdk.wallet.getEthereumProvider();
        if (provider) {
          await provider.request({ method: 'eth_requestAccounts' });
        }
      }
    } catch (error) {
      console.log('Wallet connection failed:', error);
    }
  };

  const triggerHaptic = (style?: 'light' | 'medium' | 'heavy') => {
    try {
      if (isReady && sdk?.haptics) {
        const intensity = style === 'heavy' ? 'heavy' : style === 'medium' ? 'medium' : 'light';
        sdk.haptics.impactOccurred(intensity);
      } else if ('vibrate' in navigator) {
        const duration = style === 'heavy' ? 100 : style === 'medium' ? 50 : 25;
        navigator.vibrate(duration);
      }
    } catch (error) {
      console.log('Haptic feedback failed:', error);
    }
  };

  return {
    shareGame,
    shareHighScore,
    inviteFriends,
    connectWallet,
    triggerHaptic,
    isConnected: isReady && !!context,
    context,
    isReady,
  };
};
