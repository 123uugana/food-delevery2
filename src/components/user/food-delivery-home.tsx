"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Plus, ShoppingCart, UserRound, X } from "lucide-react";
import {
  categories as seedCategories,
  dishes as seedDishes,
  type Category,
  type Dish,
} from "@/components/admin/mock-data";
import { apiUrl } from "@/lib/api";

const heroPlateImage =
  "https://images.unsplash.com/photo-1604908554027-1a5f3f31f520?auto=format&fit=crop&w=900&q=90";
const heroDessertImage =
  "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=520&q=90";

const sectionOrder = ["appetizers", "salads", "lunch", "pizzas", "main", "seafood"];

export function FoodDeliveryHome() {
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [dishes, setDishes] = useState<Dish[]>(seedDishes);
  const [cartCount, setCartCount] = useState(0);
  const [addressOpen, setAddressOpen] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMenu() {
      try {
        const [categoriesResponse, dishesResponse] = await Promise.all([
          fetch(apiUrl("/categories")),
          fetch(apiUrl("/dishes")),
        ]);

        if (!categoriesResponse.ok || !dishesResponse.ok) {
          throw new Error("Failed to load menu.");
        }

        const categoriesData = (await categoriesResponse.json()) as {
          categories: Category[];
        };
        const dishesData = (await dishesResponse.json()) as { dishes: Dish[] };

        if (!ignore) {
          setCategories(categoriesData.categories);
          setDishes(dishesData.dishes);
        }
      } catch {
        if (!ignore) {
          setCategories(seedCategories);
          setDishes(seedDishes);
        }
      }
    }

    loadMenu();

    return () => {
      ignore = true;
    };
  }, []);

  const sections = useMemo(() => {
    const menuCategories = categories
      .filter((category) => category.id !== "all")
      .sort((a, b) => {
        const aIndex = sectionOrder.indexOf(a.id);
        const bIndex = sectionOrder.indexOf(b.id);

        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
      });

    return menuCategories
      .map((category) => ({
        category,
        dishes: dishes.filter((dish) => dish.categoryId === category.id),
      }))
      .filter((section) => section.dishes.length > 0);
  }, [categories, dishes]);

  return (
    <main className="min-h-screen bg-[#404040] text-white">
      <Header
        cartCount={cartCount}
        deliveryLabel={address || "Delivery address"}
        onAddressClick={() => setAddressOpen(true)}
      />

      <div className="mx-auto max-w-[690px]">
        <Hero />

        <div className="space-y-8 px-8 py-7 max-sm:px-4">
          {sections.map((section) => (
            <MenuSection
              key={section.category.id}
              title={section.category.name}
              dishes={section.dishes}
              onAdd={() => setCartCount((count) => count + 1)}
            />
          ))}
        </div>
      </div>

      <DeliveryTicker />
      <SiteFooter />

      {addressOpen && (
        <AddressDialog
          value={address}
          onChange={setAddress}
          onClose={() => setAddressOpen(false)}
        />
      )}
    </main>
  );
}

function Header({
  cartCount,
  deliveryLabel,
  onAddressClick,
}: {
  cartCount: number;
  deliveryLabel: string;
  onAddressClick: () => void;
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
          <button className="relative grid size-6 place-items-center rounded-full bg-white text-[#18181b]">
            <ShoppingCart className="size-3.5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button className="grid size-6 place-items-center rounded-full bg-[#ef4444] text-white">
            <UserRound className="size-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate aspect-[1440/520] min-h-[210px] overflow-hidden bg-[#f5eee9]">
      <div className="absolute inset-0 -rotate-[5deg] scale-125 text-[clamp(32px,6vw,54px)] font-black uppercase leading-[0.9] tracking-tight">
        {Array.from({ length: 8 }, (_, index) => (
          <p
            key={index}
            className={index % 2 === 0 ? "text-[#1f1f1f]/12" : "text-[#ff4f42]/18"}
          >
            Say cheese · Fresh fast delivered!
          </p>
        ))}
      </div>

      <div className="absolute left-0 right-[7%] top-[22%] h-[38%] rounded-r-full bg-[#19191c]" />
      <div className="absolute bottom-[26%] left-0 h-[8%] w-full bg-[#ff4f42]" />
      <div className="absolute right-[5%] top-[20%] h-[47%] w-[28%] rounded-full bg-[#19191c]" />

      <div className="relative z-10 h-full">
        <div className="absolute left-[4%] top-[32%] z-30">
          <p className="text-[clamp(35px,8.2vw,62px)] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white">
            Today's
          </p>
          <span className="mt-[8%] inline-flex rounded-full bg-[#ff4f42] px-[1.1em] py-[0.45em] text-[clamp(13px,2.4vw,23px)] font-black uppercase leading-none shadow-[0.35em_0.35em_0_white]">
            Steak society
          </span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- Decorative hero food image uses a remote photograph. */}
        <img
          src={heroPlateImage}
          alt="Steak society offer"
          className="absolute left-[31%] top-[29%] z-20 h-[58%] w-[42%] rounded-[50%] object-cover shadow-2xl"
        />
        <div className="absolute left-[67%] top-[28%] z-30 text-[clamp(30px,7vw,58px)] font-black leading-none text-[#ff4f42]">
          +
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- Decorative hero food image uses a remote photograph. */}
        <img
          src={heroDessertImage}
          alt="Dessert offer"
          className="absolute right-[1%] top-[12%] z-20 h-[25%] w-[26%] rounded-[50%] object-cover shadow-xl"
        />
        <p className="absolute right-[4%] top-[45%] z-30 text-[clamp(36px,8.8vw,68px)] font-black uppercase leading-none tracking-[-0.05em] text-white">
          Offer!
        </p>
      </div>
    </section>
  );
}

function MenuSection({
  title,
  dishes,
  onAdd,
}: {
  title: string;
  dishes: Dish[];
  onAdd: () => void;
}) {
  return (
    <section>
      <h2 className="mb-4 text-[13px] font-semibold text-white">{title}</h2>
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-2 max-sm:gap-3">
        {dishes.map((dish) => (
          <FoodCard key={dish.id} dish={dish} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}

function FoodCard({ dish, onAdd }: { dish: Dish; onAdd: () => void }) {
  return (
    <article className="overflow-hidden rounded-lg bg-white text-[#18181b] shadow-[0_1px_0_rgba(0,0,0,0.12)]">
      <div className="relative h-[112px] overflow-hidden max-sm:h-[104px]">
        {/* eslint-disable-next-line @next/next/no-img-element -- User-facing menu cards use remote URLs from admin data and Blob. */}
        <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
        <button
          onClick={onAdd}
          className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-full bg-white text-[#ef4444] shadow-md"
          aria-label={`Add ${dish.name}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
      <div className="space-y-1.5 p-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[11px] font-black text-[#ef4444]">
            {dish.name}
          </h3>
          <span className="shrink-0 text-[9px] font-black">{dish.price}</span>
        </div>
        <p className="line-clamp-2 text-[8px] font-medium leading-3 text-[#2f2f2f]">
          {dish.ingredients}
        </p>
      </div>
    </article>
  );
}

function DeliveryTicker() {
  return (
    <div className="overflow-hidden bg-[#ef4444] py-3">
      <div className="mx-auto flex max-w-[690px] gap-6 whitespace-nowrap px-8 text-[11px] font-semibold text-white max-sm:px-4">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index}>Fresh fast delivered</span>
        ))}
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-[#18181b] text-white">
      <div className="mx-auto grid max-w-[690px] grid-cols-[1.2fr_1fr_1fr_1fr] gap-8 px-8 py-10 max-sm:grid-cols-2 max-sm:px-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- Static SVG logo from public assets. */}
            <img src="/nomnom-logo.svg" alt="NomNom" className="h-[26px] w-[32px]" />
            <div>
              <p className="text-[11px] font-bold">NomNom</p>
              <p className="text-[8px] text-white/50">Swift delivery</p>
            </div>
          </div>
        </div>
        <FooterColumn title="NomNom" items={["Home", "Contact us", "Delivery zone"]} />
        <FooterColumn title="Menu" items={["Appetizers", "Salads", "Pizzas", "Lunch"]} />
        <SocialColumn />
      </div>
      <div className="mx-auto max-w-[690px] border-t border-white/10 px-8 py-5 text-[8px] text-white/35 max-sm:px-4">
        Copy right 2026 Nomnom LLC. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-[9px] font-semibold uppercase text-white/45">{title}</h3>
      <ul className="space-y-1.5 text-[9px] font-medium text-white/80">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function SocialColumn() {
  return (
    <div>
      <h3 className="mb-3 text-[9px] font-semibold uppercase text-white/45">Follow us</h3>
      <div className="flex items-center gap-3">
        <a href="#" aria-label="Facebook" className="grid size-6 place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- Static SVG social icon from public assets. */}
          <img src="/facebook-icon.svg" alt="" className="size-5" />
        </a>
        <a href="#" aria-label="Instagram" className="grid size-6 place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- Static SVG social icon from public assets. */}
          <img src="/instagram-icon.svg" alt="" className="size-6" />
        </a>
      </div>
    </div>
  );
}

function AddressDialog({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
      <div className="w-full max-w-[360px] rounded-lg bg-white p-5 text-[#18181b] shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-[14px] font-bold">Please write your delivery address!</h2>
          <button onClick={onClose} className="grid size-7 place-items-center rounded-full">
            <X className="size-4" />
          </button>
        </div>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Please enter your address here"
          className="h-10 w-full rounded-md border border-[#e5e5e5] px-3 text-[12px] outline-none focus:border-[#ef4444]"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="h-8 rounded-md px-4 text-[11px] font-semibold">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="h-8 rounded-md bg-[#18181b] px-4 text-[11px] font-semibold text-white"
          >
            Deliver here
          </button>
        </div>
      </div>
    </div>
  );
}
