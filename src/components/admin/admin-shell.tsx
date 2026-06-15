"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Grid2X2, Settings, Truck } from "lucide-react";

const navItems = [
  { href: "/admin/food-menu", label: "Food menu", icon: Grid2X2 },
  { href: "/admin/orders", label: "Orders", icon: Truck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#111111]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[206px] bg-white md:block">
        <div className="px-8 pt-12">
          <Link href="/admin/food-menu" className="flex items-center gap-2">
            <span className="relative flex size-8 items-center justify-center rounded-full bg-[#ff3f44]">
              <span className="absolute top-3 h-2 w-7 rounded-t-full bg-white" />
              <span className="absolute top-[18px] h-[2px] w-8 rounded-full bg-white" />
            </span>
            <span>
              <span className="block text-[15px] font-bold leading-4">NomNom</span>
              <span className="block text-[11px] font-medium text-[#9a9a9a]">
                Swift delivery
              </span>
            </span>
          </Link>
        </div>

        <nav className="mt-14 flex flex-col gap-4 px-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-full px-5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-[#141416] text-white shadow-sm"
                    : "text-[#101010] hover:bg-[#f3f3f3]",
                )}
              >
                <Icon className="size-4" strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="min-h-screen md:pl-[206px]">
        <div className="mx-auto min-h-screen w-full max-w-[1288px] px-5 py-10 md:px-6 lg:px-8">
          <div className="mb-8 flex justify-end">
            <Avatar className="size-9 ring-2 ring-white">
              <AvatarImage src="https://i.pravatar.cc/96?img=47" alt="Admin avatar" />
              <AvatarFallback>NN</AvatarFallback>
            </Avatar>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
