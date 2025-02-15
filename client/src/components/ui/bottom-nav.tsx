import { Link, useLocation } from "wouter";
import { Home, ShoppingBag, Users } from "lucide-react";

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-violet-900/20">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto">
        <Link href="/">
          <a className={`flex flex-col items-center ${
            location === "/" ? "text-violet-400" : "text-gray-600"
          }`}>
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Игра</span>
          </a>
        </Link>

        <Link href="/shop">
          <a className={`flex flex-col items-center ${
            location === "/shop" ? "text-violet-400" : "text-gray-600"
          }`}>
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs mt-1">Магазин</span>
          </a>
        </Link>

        <Link href="/referral">
          <a className={`flex flex-col items-center ${
            location === "/referral" ? "text-violet-400" : "text-gray-600"
          }`}>
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Рефералы</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}