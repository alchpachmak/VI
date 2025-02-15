import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VICoin } from "@/components/ui/vi-coin";
import { getTelegramUser } from "@/lib/telegram";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export default function Game() {
  const queryClient = useQueryClient();
  const telegramUser = getTelegramUser();

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/telegram/${telegramUser?.id}`],
    enabled: !!telegramUser,
  });

  const { mutate: click } = useMutation({
    mutationFn: () => apiRequest("POST", `/api/users/${user?.id}/click`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/telegram/${telegramUser?.id}`] });
    },
  });

  useEffect(() => {
    if (!user && telegramUser) {
      apiRequest("POST", "/api/users", {
        telegramId: telegramUser.id,
        username: telegramUser.username,
        referralCode: Math.random().toString(36).substring(7),
      });
    }
  }, [user, telegramUser]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {user && <VICoin onClick={() => click()} />}
    </div>
  );
}