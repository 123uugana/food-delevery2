import { MapPin, ShoppingCart, UserRound } from "lucide-react";

export function Header({
  cartCount,
  deliveryLabel,
  onAddressClick,
  onCartClick,
  onUserClick,
}: {
  cartCount: number;
  deliveryLabel: string;
  onAddressClick: () => void;
  onCartClick: () => void;
  onUserClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#18181b]">
      <div className="mx-auto flex h-12 max-w-[690px] items-center justify-between px-8 max-sm:px-4">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- Static SVG logo from public assets. */}
          <img src="/nomnom-logo.svg" alt="NomNom" className="h-[26px] w-[32px]" />
          <div className="leading-none">
            <p className="text-[11px] font-bold">NomNom</p>
            <p className="mt-0.5 text-[8px] font-medium text-white/55">Swift delivery</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddressClick}
            className="flex h-6 max-w-[210px] items-center gap-1.5 rounded-full bg-white px-3 text-[9px] font-semibold text-[#ef4444]"
          >
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{deliveryLabel}</span>
          </button>
          <button
            onClick={onCartClick}
            className="relative grid size-6 place-items-center rounded-full bg-white text-[#18181b]"
            aria-label="Open cart"
          >
            <ShoppingCart className="size-3.5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={onUserClick}
            className="grid size-6 place-items-center rounded-full bg-[#ef4444] text-white"
            aria-label="Open user"
          >
            <UserRound className="size-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
