"use client";

import { CategoryDialog } from "@/components/admin/food-menu/category-dialog";
import { CategoryFilter } from "@/components/admin/food-menu/category-filter";
import { DishDialog } from "@/components/admin/food-menu/dish-dialog";
import { MenuSection } from "@/components/admin/food-menu/menu-section";
import { emptyDraft } from "@/components/admin/food-menu/types";
import { useFoodMenu } from "@/components/admin/food-menu/use-food-menu";

export function FoodMenuAdmin() {
  const menu = useFoodMenu();
  const dialogCategories = menu.categoriesWithCounts.filter(
    (category) => category.id !== "all",
  );

  return (
    <div className="space-y-6">
      <CategoryFilter
        activeCategory={menu.activeCategory}
        categories={menu.categoriesWithCounts}
        onAdd={() => menu.setAddCategoryOpen(true)}
        onDelete={menu.handleDeleteCategory}
        onSelect={menu.setActiveCategory}
      />

      {menu.visibleSections.map((section) => (
        <MenuSection
          key={section.category.id}
          section={section}
          onAddDish={menu.setAddForCategory}
          onDeleteCategory={menu.handleDeleteCategory}
          onEditDish={menu.setEditingDish}
        />
      ))}

      <CategoryDialog
        open={menu.addCategoryOpen}
        value={menu.categoryName}
        onChange={menu.setCategoryName}
        onOpenChange={menu.setAddCategoryOpen}
        onSubmit={menu.handleAddCategory}
      />

      <DishDialog
        key={`add-${menu.addForCategory?.id ?? "closed"}`}
        title={`Add new Dish to ${menu.addForCategory?.name ?? "Appetizers"}`}
        open={Boolean(menu.addForCategory)}
        initial={{
          ...emptyDraft,
          categoryId: menu.addForCategory?.id ?? "appetizers",
        }}
        categories={dialogCategories}
        submitLabel="Add Dish"
        onOpenChange={(open) => !open && menu.setAddForCategory(null)}
        onSubmit={menu.handleAddDish}
      />

      <DishDialog
        key={`edit-${menu.editingDish?.id ?? "closed"}`}
        title="Dishes info"
        open={Boolean(menu.editingDish)}
        initial={
          menu.editingDish
            ? {
                name: menu.editingDish.name,
                price: menu.editingDish.price,
                ingredients: menu.editingDish.ingredients,
                categoryId: menu.editingDish.categoryId,
                image: menu.editingDish.image,
                imageFile: null,
              }
            : emptyDraft
        }
        categories={dialogCategories}
        submitLabel="Save changes"
        onOpenChange={(open) => !open && menu.setEditingDish(null)}
        onSubmit={menu.handleSaveDish}
        onDelete={menu.handleDeleteDish}
      />
    </div>
  );
}
