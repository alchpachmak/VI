import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getTelegramUser } from "@/lib/telegram";
import type { User } from "@shared/schema";

export default function Referral() {
  const { toast } = useToast();
  const telegramUser = getTelegramUser();

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/telegram/${telegramUser?.id}`],
    enabled: !!telegramUser,
  });

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: "Скопировано!",
        description: "Реферальный код скопирован в буфер обмена",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black pt-8 pb-24 px-4">
      <h1 className="text-2xl font-bold text-white mb-8 text-center">
        Реферальная программа
      </h1>

      <Card className="bg-black/50 border-violet-900/50 max-w-md mx-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Ваш реферальный код
          </h3>

          <div className="flex gap-4 mb-6">
            <code className="flex-1 p-3 rounded bg-violet-900/20 text-violet-400 font-mono">
              {user.referralCode}
            </code>
            <Button
              onClick={copyReferralCode}
              variant="outline"
              className="border-violet-500 text-violet-400 hover:bg-violet-500/20"
            >
              Копировать
            </Button>
          </div>

          <p className="text-gray-400 text-sm">
            Поделитесь этим кодом с друзьями. За каждого приглашенного друга вы получите бонус!
          </p>
        </div>
      </Card>
    </div>
  );
}