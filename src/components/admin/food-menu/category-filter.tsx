import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Category } from "@/components/admin/mock-data";
import { cn } from "@/lib/utils";

type CategoryFilterProps = {
  activeCategory: string;
  categories: Category[];
  onAdd: () => void;
  onDelete: (category: Category) => void;
  onSelect: (id: string) => void;
};

export function CategoryFilter({
  activeCategory,
  categories,
  onAdd,
  onDelete,
  onSelect,
}: CategoryFilterProps) {
  return (
    <section className="rounded-xl bg-white px-6 py-7 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <h1 className="mb-5 text-[20px] font-bold tracking-[-0.01em]">
        Dishes category
      </h1>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className={cn(
              "flex h-8 items-center overflow-hidden rounded-full border text-[13px] font-medium transition-colors",
              activeCategory === category.id
                ? "border-[#ff4248] bg-white text-[#111]"
                : "border-[#dedede] bg-white text-[#111] hover:border-[#ff777b]",
            )}
          >
            <button
              onClick={() => onSelect(category.id)}
              className="flex h-full items-center gap-2 px-4"
            >
              {category.name}
              <span className="rounded-full bg-[#151518] px-2 py-0.5 text-[11px] font-bold leading-4 text-white">
                {category.count}
              </span>
            </button>
            {category.id !== "all" && (
              <button
                onClick={() => onDelete(category)}
                className="flex h-full w-8 items-center justify-center border-l border-[#ececec] text-[#ff4248] hover:bg-[#fff1f2]"
                aria-label={`Delete ${category.name}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        ))}
        <Button
          size="icon"
          className="size-8 rounded-full bg-[#ff4248] text-white hover:bg-[#ee343a]"
          onClick={onAdd}
          aria-label="Add category"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </section>
  );
}
