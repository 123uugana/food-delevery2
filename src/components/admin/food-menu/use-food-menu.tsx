"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import {
  categories as seedCategories,
  dishes as seedDishes,
  foodImages,
  type Category,
  type Dish,
} from "@/components/admin/mock-data";
import { apiUrl } from "@/lib/api";
import { type DishDraft } from "./types";

const preferredCategoryOrder = ["pizzas", "lunch", "appetizers", "salads"];

export function useFoodMenu() {
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [dishes, setDishes] = useState<Dish[]>(seedDishes);
  const [activeCategory, setActiveCategory] = useState("all");
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [addForCategory, setAddForCategory] = useState<Category | null>(null);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const categoriesWithCounts = useMemo(
    () =>
      categories.map((category) =>
        category.id === "all"
          ? { ...category, count: dishes.length }
          : {
              ...category,
              count: dishes.filter((dish) => dish.categoryId === category.id).length,
            },
      ),
    [categories, dishes],
  );

  const visibleSections = useMemo(() => {
    const source =
      activeCategory === "all"
        ? categoriesWithCounts.filter((category) => category.id !== "all")
        : categoriesWithCounts.filter((category) => category.id === activeCategory);

    return source
      .map((category) => ({
        category,
        dishes: dishes.filter((dish) => dish.categoryId === category.id),
      }))
      .filter((section) => section.dishes.length > 0 || activeCategory !== "all")
      .sort(
        (a, b) =>
          preferredCategoryOrder.indexOf(a.category.id) -
          preferredCategoryOrder.indexOf(b.category.id),
      );
  }, [activeCategory, categoriesWithCounts, dishes]);

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
        toast("Could not load menu from the API.");
      }
    }

    loadMenu();

    return () => {
      ignore = true;
    };
  }, []);

  function handleAddCategory() {
    const name = categoryName.trim();
    if (!name) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setCategories((current) => [...current, { id, name, count: 0 }]);
    setCategoryName("");
    setAddCategoryOpen(false);
    toast("New Category is being added to the menu", {
      icon: <Check className="size-4" />,
    });
  }

  async function uploadImage(draft: DishDraft) {
    if (!draft.imageFile) return draft.image;

    const body = new FormData();
    body.append("file", draft.imageFile);

    const response = await fetch(apiUrl("/upload"), {
      method: "POST",
      body,
    });

    if (!response.ok) {
      throw new Error("Could not upload image.");
    }

    const data = (await response.json()) as { url: string };
    return data.url;
  }

  async function handleAddDish(draft: DishDraft) {
    const categoryId = draft.categoryId || addForCategory?.id || "appetizers";
    const category = categories.find((item) => item.id === categoryId);
    const id = `dish-${Date.now()}`;

    try {
      const image = (await uploadImage(draft)) || foodImages.caprese;
      const response = await fetch(apiUrl("/dishes"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          categoryId,
          name: draft.name || "Betroot and orange salad",
          ingredients:
            draft.ingredients ||
            "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
          price: draft.price || "$12.99",
          image,
        }),
      });

      if (!response.ok) throw new Error("Could not add dish.");

      const data = (await response.json()) as { dish: Dish };
      setDishes((current) => [data.dish, ...current]);
      setCategories((current) =>
        current.map((item) =>
          item.id === categoryId ? { ...item, count: item.count + 1 } : item,
        ),
      );
      setAddForCategory(null);
      toast(`New dish is being added to the menu${category ? ` (${category.name})` : ""}`, {
        icon: <Check className="size-4" />,
      });
    } catch {
      toast("Could not add dish.");
    }
  }

  async function handleSaveDish(draft: DishDraft) {
    if (!editingDish) return;

    try {
      const image = (await uploadImage(draft)) || editingDish.image;
      const response = await fetch(apiUrl(`/dishes/${editingDish.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: draft.categoryId,
          name: draft.name,
          ingredients: draft.ingredients,
          price: draft.price,
          image,
        }),
      });

      if (!response.ok) throw new Error("Could not save dish.");

      const data = (await response.json()) as { dish: Dish };
      setDishes((current) =>
        current.map((dish) => (dish.id === editingDish.id ? data.dish : dish)),
      );
      setEditingDish(null);
      toast("Dish info updated.");
    } catch {
      toast("Could not save dish.");
    }
  }

  function handleDeleteDish() {
    if (!editingDish) return;

    const dish = editingDish;
    setDishes((current) => current.filter((item) => item.id !== dish.id));
    setEditingDish(null);
    deleteDishFromApi(dish.id);
  }

  async function deleteDishFromApi(id: string) {
    const response = await fetch(apiUrl(`/dishes/${id}`), { method: "DELETE" });
    toast(response.ok ? "Dish successfully deleted." : "Could not delete dish.");
  }

  async function handleDeleteCategory(category: Category) {
    if (category.id === "all") return;

    setCategories((current) => current.filter((item) => item.id !== category.id));
    setDishes((current) => current.filter((dish) => dish.categoryId !== category.id));
    if (activeCategory === category.id) setActiveCategory("all");

    const response = await fetch(apiUrl(`/categories/${category.id}`), {
      method: "DELETE",
    });

    toast(response.ok ? "Category and its dishes deleted." : "Could not delete category.");
  }

  return {
    activeCategory,
    addCategoryOpen,
    addForCategory,
    categoriesWithCounts,
    categoryName,
    editingDish,
    visibleSections,
    handleAddCategory,
    handleAddDish,
    handleDeleteCategory,
    handleDeleteDish,
    handleSaveDish,
    setActiveCategory,
    setAddCategoryOpen,
    setAddForCategory,
    setCategoryName,
    setEditingDish,
  };
}
