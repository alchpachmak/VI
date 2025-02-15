import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getTelegramUser } from "@/lib/telegram";
import type { Item, User } from "@shared/schema";

export default function Shop() {
  const { toast } = useToast();
  const telegramUser = getTelegramUser();

  const { data: items } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/telegram/${telegramUser?.id}`],
    enabled: !!telegramUser,
  });

  const { mutate: purchase } = useMutation({
    mutationFn: (itemId: number) =>
      apiRequest("POST", `/api/users/${user?.id}/purchase/${itemId}`),
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Недостаточно VI coins",
        variant: "destructive",
      });
    },
  });

  if (!items || !user) return null;

  return (
    <div className="min-h-screen bg-black pt-8 pb-24 px-4">
      <h1 className="text-2xl font-bold text-white mb-8 text-center">
        Магазин аксессуаров
      </h1>

      <div className="grid gap-4 max-w-md mx-auto">
        {items.map((item) => (
          <Card key={item.id} className="bg-black/50 border-violet-900/50">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.name}
              </h3>
              <p className="text-gray-400 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-violet-400 font-bold">
                  {item.price} VI
                </span>
                <Button
                  onClick={() => purchase(item.id)}
                  variant="outline"
                  className="border-violet-500 text-violet-400 hover:bg-violet-500/20"
                >
                  Купить
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}