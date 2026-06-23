import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Category, type Dish } from "@/components/admin/mock-data";

type MenuSectionProps = {
  section: {
    category: Category;
    dishes: Dish[];
  };
  onAddDish: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onEditDish: (dish: Dish) => void;
};

export function MenuSection({
  section,
  onAddDish,
  onDeleteCategory,
  onEditDish,
}: MenuSectionProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-bold tracking-[-0.01em]">
          {section.category.name} ({section.dishes.length || section.category.count})
        </h2>
        <Button
          variant="outline"
          size="icon"
          className="size-8 border-[#ff9da1] text-[#ff4248] hover:text-[#ff4248]"
          onClick={() => onDeleteCategory(section.category)}
          aria-label={`Delete ${section.category.name}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <AddDishCard category={section.category} onClick={() => onAddDish(section.category)} />
        {section.dishes.map((dish) => (
          <FoodCard key={dish.id} dish={dish} onEdit={() => onEditDish(dish)} />
        ))}
      </div>
    </section>
  );
}

function AddDishCard({
  category,
  onClick,
}: {
  category: Category;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[214px] flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-[#ff7a7f] bg-white text-center transition-colors hover:bg-[#fff8f8]"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-[#ff4248] text-white">
        <Plus className="size-5" />
      </span>
      <span className="max-w-[130px] text-[13px] font-medium leading-5">
        Add new Dish to {category.name}
      </span>
    </button>
  );
}

function FoodCard({ dish, onEdit }: { dish: Dish; onEdit: () => void }) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#dddddd] bg-white">
      <div className="relative h-[132px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- Mock dashboard images and blob previews intentionally use plain img tags. */}
        <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-4 right-4 size-11 rounded-full bg-white text-[#ff4248] shadow-md hover:bg-white"
          onClick={onEdit}
          aria-label={`Edit ${dish.name}`}
        >
          <Pencil className="size-4" />
        </Button>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-[14px] font-medium text-[#ff343a]">
            {dish.name}
          </h3>
          <span className="shrink-0 pt-0.5 text-[12px] font-semibold">{dish.price}</span>
        </div>
        <p className="line-clamp-2 text-[12px] font-medium leading-4 text-[#202020]">
          {dish.ingredients}
        </p>
      </div>
    </article>
  );
}
