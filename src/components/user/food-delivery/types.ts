import type { Dish } from "@/components/admin/mock-data";

export type CartItem = {
  dish: Dish;
  quantity: number;
};

export type CustomerOrder = {
  id: string;
  date: string;
  items: CartItem[];
  total: string;
  address: string;
  state: "Pending" | "Delivered";
};

export type CartTab = "cart" | "order";
