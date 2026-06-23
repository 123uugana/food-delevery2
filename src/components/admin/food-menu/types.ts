export type DishDraft = {
  name: string;
  price: string;
  ingredients: string;
  categoryId: string;
  image: string;
  imageFile: File | null;
};

export const emptyDraft: DishDraft = {
  name: "",
  price: "",
  ingredients: "",
  categoryId: "appetizers",
  image: "",
  imageFile: null,
};
