"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  categories as seedCategories,
  dishes as seedDishes,
  type Category,
  type Dish,
  type Order,
} from "@/components/admin/mock-data";
import { apiUrl } from "@/lib/api";
import { CartDrawer } from "./food-delivery/cart-drawer";
import {
  AddressDialog,
  CartNotice,
  FoodDetailDialog,
  LoginAlert,
  SuccessOrderDialog,
} from "./food-delivery/dialogs";
import { DeliveryTicker, SiteFooter } from "./food-delivery/footer";
import { Header } from "./food-delivery/header";
import { Hero, MenuSection } from "./food-delivery/menu";
import type { CartItem, CartTab, CustomerOrder } from "./food-delivery/types";
import { formatCurrency, parsePrice } from "./food-delivery/utils";

const sectionOrder = ["appetizers", "salads", "lunch", "pizzas", "main", "seafood"];

export function FoodDeliveryHome() {
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [dishes, setDishes] = useState<Dish[]>(seedDishes);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartTab, setCartTab] = useState<CartTab>("cart");
  const [addressOpen, setAddressOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [cartNoticeOpen, setCartNoticeOpen] = useState(false);
  const [orderSuccessOpen, setOrderSuccessOpen] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [ordersRefreshing, setOrdersRefreshing] = useState(false);

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
    return categories
      .filter((category) => category.id !== "all")
      .sort((a, b) => sectionIndex(a.id) - sectionIndex(b.id))
      .map((category) => ({
        category,
        dishes: dishes.filter((dish) => dish.categoryId === category.id),
      }))
      .filter((section) => section.dishes.length > 0);
  }, [categories, dishes]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.dish.price) * item.quantity,
    0,
  );
  const deliveryFee = cartItems.length > 0 ? 0.99 : 0;
  const grandTotal = subtotal + deliveryFee;

  const refreshOrderStates = useCallback(async (silent = false) => {
    if (orders.length === 0 || ordersRefreshing) return;

    setOrdersRefreshing(true);

    try {
      const response = await fetch(apiUrl("/orders"));
      if (!response.ok) throw new Error("Failed to refresh orders.");

      const data = (await response.json()) as { orders: Order[] };
      const latestStates = new Map(data.orders.map((order) => [order.id, order.state]));

      setOrders((current) =>
        current.map((order) => {
          const state = latestStates.get(order.id);
          return state === "Pending" || state === "Delivered"
            ? { ...order, state }
            : order;
        }),
      );
    } catch {
      if (!silent) toast("Could not refresh order status.");
    } finally {
      setOrdersRefreshing(false);
    }
  }, [orders.length, ordersRefreshing]);

  useEffect(() => {
    if (!cartOpen || cartTab !== "order" || orders.length === 0) return;

    const intervalId = window.setInterval(() => {
      void refreshOrderStates(true);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [cartOpen, cartTab, orders.length, refreshOrderStates]);

  function addToCart(dish: Dish, quantity: number) {
    setCartItems((items) => {
      const existing = items.find((item) => item.dish.id === dish.id);
      if (!existing) return [...items, { dish, quantity }];

      return items.map((item) =>
        item.dish.id === dish.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    });
    setCartNoticeOpen(true);
    window.setTimeout(() => setCartNoticeOpen(false), 1800);
  }

  function updateCartQuantity(dishId: string, quantity: number) {
    setCartItems((items) =>
      quantity < 1
        ? items.filter((item) => item.dish.id !== dishId)
        : items.map((item) => (item.dish.id === dishId ? { ...item, quantity } : item)),
    );
  }

  async function checkout() {
    if (cartItems.length === 0 || checkoutLoading) return;

    if (!address.trim()) {
      setAddressError(true);
      return;
    }

    setCheckoutLoading(true);

    const order: CustomerOrder = {
      id: `order-${Date.now()}`,
      date: new Intl.DateTimeFormat("en-CA").format(new Date()).replaceAll("-", "/"),
      items: cartItems,
      total: formatCurrency(grandTotal),
      address,
      state: "Pending",
    };

    try {
      const response = await fetch(apiUrl("/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: "Guest customer",
          foods: cartItems.map((item) => ({
            id: item.dish.id,
            name: item.dish.name,
            image: item.dish.image,
            quantity: item.quantity,
          })),
          date: order.date,
          total: order.total,
          address: order.address,
        }),
      });

      if (!response.ok) throw new Error("Could not create order.");

      const data = (await response.json()) as { order: Order };
      setOrders((items) => [
        {
          ...order,
          id: data.order.id,
          state: data.order.state === "Delivered" ? "Delivered" : "Pending",
        },
        ...items,
      ]);
      setCartItems([]);
      setCartOpen(false);
      setCartTab("order");
      setOrderSuccessOpen(true);
    } catch {
      toast("Could not send order to admin. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  function openCart(tab: CartTab = "cart") {
    setCartOpen(true);
    setCartTab(tab);
    if (tab === "order") void refreshOrderStates();
  }

  return (
    <main className="min-h-screen bg-[#404040] text-white">
      <Header
        cartCount={cartCount}
        deliveryLabel={address || "Delivery address"}
        onAddressClick={() => setAddressOpen(true)}
        onCartClick={() => openCart("cart")}
        onUserClick={() => setLoginAlertOpen(true)}
      />

      <div className="mx-auto max-w-[690px]">
        <Hero />
        <div className="space-y-8 px-8 py-7 max-sm:px-4">
          {sections.map((section) => (
            <MenuSection
              key={section.category.id}
              title={section.category.name}
              dishes={section.dishes}
              onSelectDish={(dish) => {
                setSelectedDish(dish);
                setSelectedQuantity(1);
              }}
            />
          ))}
        </div>
      </div>

      {cartNoticeOpen && <CartNotice />}
      <DeliveryTicker />
      <SiteFooter />

      {cartOpen && (
        <CartDrawer
          address={address}
          addressError={addressError}
          cartItems={cartItems}
          deliveryFee={deliveryFee}
          orders={orders}
          refreshing={ordersRefreshing}
          submitting={checkoutLoading}
          subtotal={subtotal}
          tab={cartTab}
          total={grandTotal}
          onAddressChange={(value) => {
            setAddress(value);
            setAddressError(false);
          }}
          onCheckout={checkout}
          onClose={() => setCartOpen(false)}
          onRefreshOrders={refreshOrderStates}
          onRemove={(dishId) =>
            setCartItems((items) => items.filter((item) => item.dish.id !== dishId))
          }
          onTabChange={openCart}
          onUpdateQuantity={updateCartQuantity}
        />
      )}

      {addressOpen && (
        <AddressDialog
          value={address}
          onChange={setAddress}
          onClose={() => setAddressOpen(false)}
        />
      )}

      {selectedDish && (
        <FoodDetailDialog
          dish={selectedDish}
          quantity={selectedQuantity}
          onClose={() => setSelectedDish(null)}
          onDecrease={() => setSelectedQuantity((quantity) => Math.max(1, quantity - 1))}
          onIncrease={() => setSelectedQuantity((quantity) => quantity + 1)}
          onAddToCart={() => {
            addToCart(selectedDish, selectedQuantity);
            setSelectedDish(null);
          }}
        />
      )}

      {orderSuccessOpen && (
        <SuccessOrderDialog
          onClose={() => setOrderSuccessOpen(false)}
          onBackHome={() => {
            setOrderSuccessOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {loginAlertOpen && <LoginAlert onClose={() => setLoginAlertOpen(false)} />}
    </main>
  );
}

function sectionIndex(id: string) {
  const index = sectionOrder.indexOf(id);
  return index === -1 ? 99 : index;
}
