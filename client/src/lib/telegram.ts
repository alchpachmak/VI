import { useEffect, useState } from 'react';
import { config } from '../../../server/config';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            username?: string;
          };
        };
        ready(): void;
        expand(): void;
      };
    };
  }
}

export function useTelegramWebApp() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!window.Telegram?.WebApp) {
      window.location.href = `https://t.me/${config.botUsername}/app`;
      return;
    }

    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    setIsReady(true);
  }, []);

  return { isReady };
}

export function getTelegramUser() {
  if (!window.Telegram?.WebApp) {
    return null;
  }

  const { user } = window.Telegram.WebApp.initDataUnsafe;
  if (!user) return null;

  return {
    id: user.id.toString(),
    username: user.username || user.first_name
  };
}