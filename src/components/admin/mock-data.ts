export type DeliveryState = "Pending" | "Delivered" | "Cancelled";

export type Category = {
  id: string;
  name: string;
  count: number;
};

export type Dish = {
  id: string;
  categoryId: string;
  name: string;
  ingredients: string;
  price: string;
  image: string;
};

export type Order = {
  id: string;
  number: number;
  customer: string;
  foods: (Pick<Dish, "id" | "name" | "image"> & { quantity?: number })[];
  date: string;
  total: string;
  address: string;
  state: DeliveryState;
};

export const categories: Category[] = [
  { id: "all", name: "All Dishes", count: 112 },
  { id: "appetizers", name: "Appetizers", count: 6 },
  { id: "salads", name: "Salads", count: 3 },
  { id: "pizzas", name: "Pizzas", count: 5 },
  { id: "lunch", name: "Lunch favorites", count: 5 },
  { id: "main", name: "Main dishes", count: 5 },
  { id: "seafood", name: "Fish & Sea foods", count: 5 },
  { id: "brunch", name: "Brunch", count: 5 },
  { id: "side", name: "Side dish", count: 5 },
  { id: "desserts", name: "Desserts", count: 5 },
  { id: "beverages", name: "Beverages", count: 5 },
];

export const foodImages = {
  crostini:
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=680&q=85",
  cobb:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=680&q=85",
  caprese:
    "https://images.unsplash.com/photo-1608032077018-c9aad9565d29?auto=format&fit=crop&w=680&q=85",
  beet:
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=680&q=85",
};

const copy =
  "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.";

export const dishes: Dish[] = [
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `app-${index + 1}`,
    categoryId: "appetizers",
    name: "Brie Crostini Appetizer",
    ingredients: copy,
    price: "$12.99",
    image: foodImages.crostini,
  })),
  ...[
    ["sal-1", "Grilled Chicken cobb salad", foodImages.cobb],
    ["sal-2", "Burrata Caprese", foodImages.caprese],
    ["sal-3", "Betroot and orange salad", foodImages.beet],
  ].map(([id, name, image]) => ({
    id,
    categoryId: "salads",
    name,
    ingredients: copy,
    price: "$12.99",
    image,
  })),
  ...[
    ["piz-1", "Grilled Chicken cobb salad", foodImages.cobb],
    ["piz-2", "Burrata Caprese", foodImages.caprese],
    ["piz-3", "Betroot and orange salad", foodImages.beet],
    ["piz-4", "Grilled Chicken cobb salad", foodImages.cobb],
    ["piz-5", "Grilled Chicken cobb salad", foodImages.cobb],
  ].map(([id, name, image]) => ({
    id,
    categoryId: "pizzas",
    name,
    ingredients: copy,
    price: "$12.99",
    image,
  })),
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `lunch-${index + 1}`,
    categoryId: "lunch",
    name:
      index % 3 === 0
        ? "Grilled Chicken cobb salad"
        : index % 3 === 1
          ? "Burrata Caprese"
          : "Betroot and orange salad",
    ingredients: copy,
    price: "$12.99",
    image:
      index % 3 === 0
        ? foodImages.cobb
        : index % 3 === 1
          ? foodImages.caprese
          : foodImages.beet,
  })),
];

export const orders: Order[] = Array.from({ length: 12 }, (_, index) => ({
  id: `order-${index + 1}`,
  number: 1,
  customer: index === 0 ? "Amgalan" : "Test@gamill.com",
  foods: [
    { id: "food-1", name: "Sunshine Stackers", image: foodImages.cobb },
    { id: "food-2", name: "Sunshine Stackers", image: foodImages.caprese },
  ],
  date: "2024/12/20",
  total: "$26.97",
  address: "2024/12/СБД, 12-р хороо, СБД нэгдсэн эмнэлэг Sbd negdse...",
  state: index < 3 ? "Pending" : index < 7 ? "Delivered" : "Cancelled",
}));
