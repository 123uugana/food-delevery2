import { Plus } from "lucide-react";
import type { Dish } from "@/components/admin/mock-data";

export function Hero() {
  return (
    <section className="relative aspect-[1440/668] min-h-[210px] overflow-hidden bg-[#f5eee9]">
      {/* eslint-disable-next-line @next/next/no-img-element -- Hero artwork is a static asset from public. */}
      <img
        src="/Image÷.png"
        alt="Today's steak society offer"
        className="h-full w-full object-cover object-center"
      />
    </section>
  );
}

export function MenuSection({
  title,
  dishes,
  onSelectDish,
}: {
  title: string;
  dishes: Dish[];
  onSelectDish: (dish: Dish) => void;
}) {
  return (
    <section>
      <h2 className="mb-4 text-[13px] font-semibold text-white">{title}</h2>
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-2 max-sm:gap-3">
        {dishes.map((dish) => (
          <FoodCard key={dish.id} dish={dish} onSelect={() => onSelectDish(dish)} />
        ))}
      </div>
    </section>
  );
}

function FoodCard({ dish, onSelect }: { dish: Dish; onSelect: () => void }) {
  return (
    <article className="overflow-hidden rounded-lg bg-white text-[#18181b] shadow-[0_1px_0_rgba(0,0,0,0.12)]">
      <button
        type="button"
        onClick={onSelect}
        className="relative block h-[112px] w-full overflow-hidden text-left max-sm:h-[104px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- User-facing menu cards use remote URLs from admin data and Blob. */}
        <img src={dish.image} alt={dish.name} className="h-full w-full object-cover object-center" />
        <span className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-full bg-white text-[#ef4444] shadow-md">
          <Plus className="size-4" />
        </span>
      </button>
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
