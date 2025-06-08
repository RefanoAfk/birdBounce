interface GameStatsProps {
  score: number;
  bestScore: number;
  level: number;
}

export default function GameStats({ score, bestScore, level }: GameStatsProps) {
  return (
    <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm mb-4">
      <div className="text-center">
        <div className="text-2xl font-bold game-dark">{score}</div>
        <div className="text-xs text-gray-500 font-medium">SCORE</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold game-amber">{bestScore}</div>
        <div className="text-xs text-gray-500 font-medium">BEST</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold game-green">{level}</div>
        <div className="text-xs text-gray-500 font-medium">LEVEL</div>
      </div>
    </div>
  );
}
