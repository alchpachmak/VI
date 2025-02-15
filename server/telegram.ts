import { Bot } from "grammy";
import { config } from "./config";

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.command("start", async (ctx) => {
  await ctx.reply("Добро пожаловать в VI Coins!", {
    reply_markup: {
      keyboard: [
        [{
          text: "Открыть VI Coins",
          web_app: { url: config.appUrl }
        }]
      ],
      resize_keyboard: true
    }
  });
});

export function startBot() {
  bot.start();
  console.log("Telegram bot started");
}