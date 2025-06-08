import { users, gameScores, type User, type InsertUser, type GameScore, type InsertGameScore } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveScore(score: InsertGameScore): Promise<GameScore>;
  getTopScores(limit: number): Promise<GameScore[]>;
  getUserBestScore(userId: number): Promise<number | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scores: Map<number, GameScore>;
  private currentUserId: number;
  private currentScoreId: number;

  constructor() {
    this.users = new Map();
    this.scores = new Map();
    this.currentUserId = 1;
    this.currentScoreId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveScore(insertScore: InsertGameScore): Promise<GameScore> {
    const id = this.currentScoreId++;
    const score: GameScore = {
      ...insertScore,
      id,
      createdAt: new Date(),
    };
    this.scores.set(id, score);
    return score;
  }

  async getTopScores(limit: number): Promise<GameScore[]> {
    const allScores = Array.from(this.scores.values());
    return allScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getUserBestScore(userId: number): Promise<number | undefined> {
    const userScores = Array.from(this.scores.values()).filter(
      (score) => score.userId === userId
    );
    
    if (userScores.length === 0) {
      return undefined;
    }
    
    return Math.max(...userScores.map(score => score.score));
  }
}

export const storage = new MemStorage();
