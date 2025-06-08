import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameScoreSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get top scores
  app.get("/api/scores", async (req, res) => {
    try {
      const scores = await storage.getTopScores(10);
      res.json(scores);
    } catch (error) {
      console.error("Error fetching scores:", error);
      res.status(500).json({ error: "Failed to fetch scores" });
    }
  });

  // Save game score
  app.post("/api/scores", async (req, res) => {
    try {
      const validatedData = insertGameScoreSchema.parse(req.body);
      const score = await storage.saveScore(validatedData);
      res.json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid score data", details: error.errors });
      } else {
        console.error("Error saving score:", error);
        res.status(500).json({ error: "Failed to save score" });
      }
    }
  });

  // Get user's best score
  app.get("/api/users/:userId/best-score", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const bestScore = await storage.getUserBestScore(userId);
      res.json({ bestScore: bestScore || 0 });
    } catch (error) {
      console.error("Error fetching best score:", error);
      res.status(500).json({ error: "Failed to fetch best score" });
    }
  });

  // Farcaster webhook endpoint for Mini App events
  app.post("/api/webhook", async (req, res) => {
    try {
      const { event, data } = req.body;
      
      switch (event) {
        case 'frame_added':
          console.log('Mini App added by user:', data);
          break;
        case 'frame_removed':
          console.log('Mini App removed by user:', data);
          break;
        case 'notification_clicked':
          console.log('Notification clicked:', data);
          break;
        default:
          console.log('Unknown webhook event:', event, data);
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
