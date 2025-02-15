import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/users", async (req, res) => {
    const { telegramId, username, referralCode, referredBy } = req.body;
    const user = await storage.createUser({
      telegramId,
      username,
      referralCode,
      referredBy
    });
    res.json(user);
  });

  app.get("/api/users/telegram/:telegramId", async (req, res) => {
    const user = await storage.getUserByTelegramId(req.params.telegramId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  app.post("/api/users/:id/click", async (req, res) => {
    const user = await storage.updateUserBalance(parseInt(req.params.id), 1);
    res.json(user);
  });

  app.get("/api/items", async (req, res) => {
    const items = await storage.getItems();
    res.json(items);
  });

  app.get("/api/users/:id/items", async (req, res) => {
    const items = await storage.getUserItems(parseInt(req.params.id));
    res.json(items);
  });

  app.post("/api/users/:id/purchase/:itemId", async (req, res) => {
    try {
      await storage.purchaseItem(
        parseInt(req.params.id),
        parseInt(req.params.itemId)
      );
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
