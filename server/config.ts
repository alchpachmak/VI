export const config = {
  appUrl: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:5000",
  botUsername: "VI_coins_super_bot"
};