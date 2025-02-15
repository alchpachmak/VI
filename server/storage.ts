import { users, items, userItems, type User, type InsertUser, type Item, type UserItem } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: number, amount: number): Promise<User>;
  getItems(): Promise<Item[]>;
  getUserItems(userId: number): Promise<Item[]>;
  purchaseItem(userId: number, itemId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private items: Map<number, Item>;
  private userItems: Map<number, UserItem>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.userItems = new Map();
    this.currentId = 1;

    // Add some default items
    this.items.set(1, {
      id: 1,
      name: "Неоновый дрип-тип",
      description: "Светящийся дрип-тип с LED подсветкой",
      price: 1000,
      imageUrl: "https://example.com/drip-tip.svg"
    });
    this.items.set(2, {
      id: 2,
      name: "Премиум бак",
      description: "Высококачественный бак из нержавеющей стали",
      price: 2000,
      imageUrl: "https://example.com/tank.svg"
    });
    // Добавляем товары в магазин
    this.items.set(1, {
      id: 1,
      name: "Неоновый дрип-тип",
      description: "Светящийся дрип-тип с LED подсветкой",
      price: 1000,
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCAyMEM4OC45NTQzIDIwIDgwIDI4Ljk1NDMgODAgNDBWMTYwQzgwIDE3MS4wNDYgODguOTU0MyAxODAgMTAwIDE4MEMxMTEuMDQ2IDE4MCAxMjAgMTcxLjA0NiAxMjAgMTYwVjQwQzEyMCAyOC45NTQzIDExMS4wNDYgMjAgMTAwIDIwWiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyKSIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjEwMCIgeTE9IjIwIiB4Mj0iMTAwIiB5Mj0iMTgwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzhCNUNGNiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzYyMzhDOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg=="
    });

    this.items.set(2, {
      id: 2,
      name: "Премиум мод",
      description: "Высококачественный мод с регулировкой мощности",
      price: 5000,
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iNDAiIHk9IjIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgcng9IjIwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXIpIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjRThFOEU4Ii8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyIiB4MT0iMTAwIiB5MT0iMjAiIHgyPSIxMDAiIHkyPSIxODAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMzIzMjMyIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMUExQTFBIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+"
    });

    this.items.set(3, {
      id: 3,
      name: "Бак с RGB подсветкой",
      description: "Стеклянный бак с RGB подсветкой и регулировкой воздушного потока",
      price: 3000,
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2MCIgZmlsbD0idXJsKCNwYWludDBfcmFkaWFsKSIvPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMDAgMTAwKSByb3RhdGUoLTkwKSBzY2FsZSg2MCA2MCkiPjxzdG9wIHN0b3AtY29sb3I9IiM4QjVDRjYiIHN0b3Atb3BhY2l0eT0iMC41Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjIzOEM4IiBzdG9wLW9wYWNpdHk9IjAuMiIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg=="
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, balance: 0 };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(id: number, amount: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, balance: user.balance + amount };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async getUserItems(userId: number): Promise<Item[]> {
    const userItemsList = Array.from(this.userItems.values())
      .filter(ui => ui.userId === userId);

    return userItemsList.map(ui => this.items.get(ui.itemId)!);
  }

  async purchaseItem(userId: number, itemId: number): Promise<void> {
    const user = await this.getUser(userId);
    const item = this.items.get(itemId);

    if (!user || !item) throw new Error("User or item not found");
    if (user.balance < item.price) throw new Error("Insufficient balance");

    const userItemId = this.currentId++;
    this.userItems.set(userItemId, { id: userItemId, userId, itemId });
    await this.updateUserBalance(userId, -item.price);
  }
}

export const storage = new MemStorage();