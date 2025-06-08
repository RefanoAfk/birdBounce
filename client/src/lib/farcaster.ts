// Farcaster SDK integration
interface FarcasterSDK {
  share: (text: string, url?: string) => Promise<void>;
  haptics: {
    impact: (style?: 'light' | 'medium' | 'heavy') => void;
  };
  wallet: {
    connect: () => Promise<void>;
  };
}

// Mock implementation - replace with actual Farcaster SDK when available
const createFarcasterSDK = (): FarcasterSDK => {
  return {
    share: async (text: string, url?: string) => {
      console.log('Sharing to Farcaster:', text, url);
      // In a real implementation, this would use the Farcaster sharing API
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Jump Bird',
            text,
            url: url || window.location.href,
          });
        } catch (err) {
          console.log('Error sharing:', err);
        }
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard?.writeText(`${text} ${url || window.location.href}`);
      }
    },
    haptics: {
      impact: (style = 'light') => {
        if ('vibrate' in navigator) {
          const duration = style === 'heavy' ? 100 : style === 'medium' ? 50 : 25;
          navigator.vibrate(duration);
        }
      }
    },
    wallet: {
      connect: async () => {
        console.log('Connecting wallet...');
        // Mock wallet connection
        return Promise.resolve();
      }
    }
  };
};

const farcasterSDK = createFarcasterSDK();

export const useFarcaster = () => {
  const shareGame = async (score?: number) => {
    const text = score
      ? `I just scored ${score} points in Jump Bird! 🐦✨ Can you beat my score?`
      : `Check out this fun Jump Bird game! 🐦🎮`;
    await farcasterSDK.share(text);
  };

  const shareHighScore = async (score: number) => {
    const text = `My best score in Jump Bird is ${score} points! 🏆 Join me and see if you can beat it!`;
    await farcasterSDK.share(text);
  };

  const inviteFriends = async () => {
    const text = `Check out this fun Jump Bird game! 🐦🎮 Let's see who can get the highest score!`;
    await farcasterSDK.share(text);
  };

  const connectWallet = async () => {
    await farcasterSDK.wallet.connect();
  };

  const triggerHaptic = (style?: 'light' | 'medium' | 'heavy') => {
    farcasterSDK.haptics.impact(style);
  };

  return {
    shareGame,
    shareHighScore,
    inviteFriends,
    connectWallet,
    triggerHaptic,
    isConnected: true, // Mock connection status
  };
};
