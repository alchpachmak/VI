import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useTelegramWebApp } from "@/lib/telegram";
import Game from "@/pages/game";
import Shop from "@/pages/shop";
import Referral from "@/pages/referral";

export default function App() {
  const { isReady } = useTelegramWebApp();

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-black">
        <Switch>
          <Route path="/" component={Game} />
          <Route path="/shop" component={Shop} />
          <Route path="/referral" component={Referral} />
        </Switch>
        <BottomNav />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}