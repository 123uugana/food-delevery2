"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  categories as seedCategories,
  dishes as seedDishes,
  foodImages,
  type Category,
  type Dish,
} from "@/components/admin/mock-data";
import { Check, ImageIcon, Pencil, Plus, Trash2, X } from "lucide-react";

type DishDraft = {
  name: string;
  price: string;
  ingredients: string;
  categoryId: string;
  image: string;
};

const emptyDraft: DishDraft = {
  name: "",
  price: "",
  ingredients: "",
  categoryId: "appetizers",
  image: "",
};

export function FoodMenuAdmin() {
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [dishes, setDishes] = useState<Dish[]>(seedDishes);
  const [activeCategory, setActiveCategory] = useState("all");
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [addForCategory, setAddForCategory] = useState<Category | null>(null);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const visibleSections = useMemo(() => {
    const source =
      activeCategory === "all"
        ? categories.filter((category) => category.id !== "all")
        : categories.filter((category) => category.id === activeCategory);

    return source
      .map((category) => ({
        category,
        dishes: dishes.filter((dish) => dish.categoryId === category.id),
      }))
      .filter((section) => section.dishes.length > 0 || activeCategory !== "all")
      .sort((a, b) => {
        const preferred = ["pizzas", "lunch", "appetizers", "salads"];
        return preferred.indexOf(a.category.id) - preferred.indexOf(b.category.id);
      });
  }, [activeCategory, categories, dishes]);

  function handleAddCategory() {
    const name = categoryName.trim();
    if (!name) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setCategories((current) => [
      ...current,
      {
        id,
        name,
        count: 0,
      },
    ]);
    setCategoryName("");
    setAddCategoryOpen(false);
    toast("New Category is being added to the menu", {
      icon: <Check className="size-4" />,
    });
  }

  function handleAddDish(draft: DishDraft) {
    const categoryId = draft.categoryId || addForCategory?.id || "appetizers";
    const category = categories.find((item) => item.id === categoryId);
    setDishes((current) => [
      {
        id: `dish-${Date.now()}`,
        categoryId,
        name: draft.name || "Betroot and orange salad",
        ingredients:
          draft.ingredients ||
          "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
        price: draft.price || "$12.99",
        image: draft.image || foodImages.caprese,
      },
      ...current,
    ]);
    setCategories((current) =>
      current.map((item) =>
        item.id === categoryId ? { ...item, count: item.count + 1 } : item,
      ),
    );
    setAddForCategory(null);
    toast(`New dish is being added to the menu${category ? ` (${category.name})` : ""}`, {
      icon: <Check className="size-4" />,
    });
  }

  function handleSaveDish(draft: DishDraft) {
    if (!editingDish) return;

    setDishes((current) =>
      current.map((dish) =>
        dish.id === editingDish.id
          ? {
              ...dish,
              categoryId: draft.categoryId,
              name: draft.name,
              ingredients: draft.ingredients,
              price: draft.price,
              image: draft.image || dish.image,
            }
          : dish,
      ),
    );
    setEditingDish(null);
    toast("Dish info updated.");
  }

  function handleDeleteDish() {
    if (!editingDish) return;

    setDishes((current) => current.filter((dish) => dish.id !== editingDish.id));
    setEditingDish(null);
    toast("Dish successfully deleted.", {
      description: "Would you like to undo this action?",
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white px-6 py-7 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
        <h1 className="mb-5 text-[20px] font-bold tracking-[-0.01em]">
          Dishes category
        </h1>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex h-8 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors",
                activeCategory === category.id
                  ? "border-[#ff4248] bg-white text-[#111]"
                  : "border-[#dedede] bg-white text-[#111] hover:border-[#ff777b]",
              )}
            >
              {category.name}
              <span className="rounded-full bg-[#151518] px-2 py-0.5 text-[11px] font-bold leading-4 text-white">
                {category.count}
              </span>
            </button>
          ))}
          <Button
            size="icon"
            className="size-8 rounded-full bg-[#ff4248] text-white hover:bg-[#ee343a]"
            onClick={() => setAddCategoryOpen(true)}
            aria-label="Add category"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </section>

      {visibleSections.map((section) => (
        <section
          key={section.category.id}
          className="rounded-xl bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
        >
          <h2 className="mb-5 text-[20px] font-bold tracking-[-0.01em]">
            {section.category.name} ({section.dishes.length || section.category.count})
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <AddDishCard
              category={section.category}
              onClick={() => setAddForCategory(section.category)}
            />
            {section.dishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} onEdit={() => setEditingDish(dish)} />
            ))}
          </div>
        </section>
      ))}

      <CategoryDialog
        open={addCategoryOpen}
        value={categoryName}
        onChange={setCategoryName}
        onOpenChange={setAddCategoryOpen}
        onSubmit={handleAddCategory}
      />

      <DishDialog
        key={`add-${addForCategory?.id ?? "closed"}`}
        title={`Add new Dish to ${addForCategory?.name ?? "Appetizers"}`}
        open={Boolean(addForCategory)}
        initial={{
          ...emptyDraft,
          categoryId: addForCategory?.id ?? "appetizers",
        }}
        categories={categories.filter((category) => category.id !== "all")}
        submitLabel="Add Dish"
        onOpenChange={(open) => !open && setAddForCategory(null)}
        onSubmit={handleAddDish}
      />

      <DishDialog
        key={`edit-${editingDish?.id ?? "closed"}`}
        title="Dishes info"
        open={Boolean(editingDish)}
        initial={
          editingDish
            ? {
                name: editingDish.name,
                price: editingDish.price,
                ingredients: editingDish.ingredients,
                categoryId: editingDish.categoryId,
                image: editingDish.image,
              }
            : emptyDraft
        }
        categories={categories.filter((category) => category.id !== "all")}
        submitLabel="Save changes"
        onOpenChange={(open) => !open && setEditingDish(null)}
        onSubmit={handleSaveDish}
        onDelete={handleDeleteDish}
      />
    </div>
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
        <img
          src={dish.image}
          alt={dish.name}
          className="h-full w-full object-cover"
        />
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

function CategoryDialog({
  open,
  value,
  onChange,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[430px] gap-7 rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">Add new category</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label className="text-[12px] font-medium">Category name</Label>
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Type category name..."
            className="h-10 rounded-md text-[13px]"
          />
        </div>
        <div className="flex justify-end">
          <Button className="h-10 rounded-md bg-[#121214] px-5 text-[13px]" onClick={onSubmit}>
            Add category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DishDialog({
  title,
  open,
  initial,
  categories,
  submitLabel,
  onOpenChange,
  onSubmit,
  onDelete,
}: {
  title: string;
  open: boolean;
  initial: DishDraft;
  categories: Category[];
  submitLabel: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: DishDraft) => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState<DishDraft>(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof DishDraft>(key: K, value: DishDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    update("image", URL.createObjectURL(file));
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setDraft(initial);
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-[448px] rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Food name</Label>
            <Input
              value={draft.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Type food name"
              className="h-10 rounded-md text-[13px]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Food price</Label>
            <Input
              value={draft.price}
              onChange={(event) => update("price", event.target.value)}
              placeholder="Enter price..."
              className="h-10 rounded-md text-[13px]"
            />
          </div>
        </div>
        {onDelete && (
          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Dish category</Label>
            <Select
              value={draft.categoryId}
              onValueChange={(value) => update("categoryId", value)}
            >
              <SelectTrigger className="h-10 w-full rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[80] rounded-lg">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-[12px] font-medium">Ingredients</Label>
          <Textarea
            value={draft.ingredients}
            onChange={(event) => update("ingredients", event.target.value)}
            placeholder="List ingredients..."
            className="min-h-[82px] resize-none rounded-md text-[13px]"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[12px] font-medium">Food image</Label>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleImage}
          />
          {draft.image ? (
            <div className="relative h-[132px] overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element -- Object URLs from upload previews are simpler with a native img. */}
              <img
                src={draft.image}
                alt="Selected dish"
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute right-2 top-2 size-8 rounded-full bg-white"
                onClick={() => update("image", "")}
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-[132px] w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[#cbd7f2] bg-[#f4f7fd] text-[13px] font-medium"
            >
              <ImageIcon className="size-5 text-[#646464]" />
              Choose a file or drag & drop it here
            </button>
          )}
        </div>
        <div className="flex items-center justify-between pt-2">
          {onDelete ? (
            <Button
              variant="outline"
              size="icon"
              className="size-10 border-[#ff9da1] text-[#ff4248] hover:text-[#ff4248]"
              onClick={onDelete}
            >
              <Trash2 className="size-4" />
            </Button>
          ) : (
            <span />
          )}
          <Button
            className="h-10 rounded-md bg-[#121214] px-5 text-[13px]"
            onClick={() => onSubmit(draft)}
          >
            {submitLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
