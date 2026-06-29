import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import type { CartItem, CartTab, CustomerOrder } from "./types";
import { formatCurrency, parsePrice } from "./utils";

export function CartDrawer({
  address,
  addressError,
  cartItems,
  deliveryFee,
  orders,
  refreshing,
  submitting,
  subtotal,
  tab,
  total,
  onAddressChange,
  onCheckout,
  onClose,
  onRemove,
  onRefreshOrders,
  onTabChange,
  onUpdateQuantity,
}: {
  address: string;
  addressError: boolean;
  cartItems: CartItem[];
  deliveryFee: number;
  orders: CustomerOrder[];
  refreshing: boolean;
  submitting: boolean;
  subtotal: number;
  tab: CartTab;
  total: number;
  onAddressChange: (value: string) => void;
  onCheckout: () => void;
  onClose: () => void;
  onRemove: (dishId: string) => void;
  onRefreshOrders: () => void;
  onTabChange: (tab: CartTab) => void;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
}) {
  const isCart = tab === "cart";

  return (
    <div className="fixed inset-0 z-50 bg-black/35">
      <aside className="ml-auto flex h-full w-full max-w-[340px] flex-col bg-[#404040] p-3 text-[#18181b] shadow-2xl max-sm:max-w-full">
        <div className="mb-3 flex items-center justify-between px-1 text-white">
          <div className="flex items-center gap-1.5">
            <ShoppingCart className="size-4" />
            <h2 className="text-[13px] font-bold">Order detail</h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-6 place-items-center rounded-full border border-white/30 text-white/80"
            aria-label="Close cart"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 rounded-full bg-white p-1 text-[10px] font-semibold">
          <button
            onClick={() => onTabChange("cart")}
            className={`h-6 rounded-full ${isCart ? "bg-[#ef4444] text-white" : "text-[#18181b]"}`}
          >
            Cart
          </button>
          <button
            onClick={() => onTabChange("order")}
            className={`h-6 rounded-full ${!isCart ? "bg-[#ef4444] text-white" : "text-[#18181b]"}`}
          >
            Order
          </button>
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-lg bg-white p-3">
          {isCart ? (
            <CartContent
              address={address}
              addressError={addressError}
              cartItems={cartItems}
              onAddressChange={onAddressChange}
              onRemove={onRemove}
              onUpdateQuantity={onUpdateQuantity}
            />
          ) : (
            <OrderHistory
              orders={orders}
              refreshing={refreshing}
              onRefresh={onRefreshOrders}
            />
          )}
        </div>

        <PaymentSummary
          deliveryFee={deliveryFee}
          disabled={!isCart || cartItems.length === 0}
          submitting={submitting}
          subtotal={subtotal}
          total={total}
          onCheckout={onCheckout}
        />
      </aside>
    </div>
  );
}

function CartContent({
  address,
  addressError,
  cartItems,
  onAddressChange,
  onRemove,
  onUpdateQuantity,
}: {
  address: string;
  addressError: boolean;
  cartItems: CartItem[];
  onAddressChange: (value: string) => void;
  onRemove: (dishId: string) => void;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
}) {
  if (cartItems.length === 0) {
    return <EmptyState title="Your cart is empty" text="Hungry? Pick something tasty." />;
  }

  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-3 text-[11px] font-bold">My cart</h3>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <CartLine
              key={item.dish.id}
              item={item}
              onRemove={() => onRemove(item.dish.id)}
              onUpdateQuantity={(quantity) => onUpdateQuantity(item.dish.id, quantity)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-md border border-[#efefef] p-3">
        <h3 className="mb-2 text-[11px] font-bold">Delivery location</h3>
        <input
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
          placeholder="Please enter your address"
          className={`h-9 w-full rounded-md border px-3 text-[10px] outline-none ${
            addressError ? "border-[#ef4444]" : "border-[#eeeeee] focus:border-[#ef4444]"
          }`}
        />
        {addressError && (
          <p className="mt-1.5 text-[8px] font-semibold text-[#ef4444]">
            Please complete your address.
          </p>
        )}
      </section>
    </div>
  );
}

function CartLine({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}) {
  const lineTotal = parsePrice(item.dish.price) * item.quantity;

  return (
    <article className="grid grid-cols-[56px_1fr_auto] gap-2 rounded-md border border-[#efefef] p-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- Cart item uses menu image URL. */}
      <img src={item.dish.image} alt={item.dish.name} className="size-14 rounded-md object-cover" />
      <div className="min-w-0">
        <h4 className="line-clamp-1 text-[10px] font-black text-[#ef4444]">{item.dish.name}</h4>
        <p className="line-clamp-2 text-[8px] leading-3 text-[#565656]">{item.dish.ingredients}</p>
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="grid size-5 place-items-center rounded-full border border-[#eeeeee]"
            aria-label="Decrease cart quantity"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-4 text-center text-[10px] font-semibold">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="grid size-5 place-items-center rounded-full border border-[#eeeeee]"
            aria-label="Increase cart quantity"
          >
            <Plus className="size-3" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="grid size-6 place-items-center rounded-full border border-[#fecaca] text-[#ef4444]"
          aria-label="Remove item"
        >
          <Trash2 className="size-3" />
        </button>
        <p className="text-[9px] font-black">{formatCurrency(lineTotal)}</p>
      </div>
    </article>
  );
}

function OrderHistory({
  orders,
  refreshing,
  onRefresh,
}: {
  orders: CustomerOrder[];
  refreshing: boolean;
  onRefresh: () => void;
}) {
  if (orders.length === 0) {
    return <EmptyState title="Orders yet?" text="Your recent orders will appear here." />;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[11px] font-bold">Order history</h3>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="h-6 rounded-full border border-[#eeeeee] px-3 text-[9px] font-bold text-[#ef4444] disabled:text-[#999]"
        >
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-md border border-[#efefef] p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-black">{order.total}</p>
                <p className="text-[8px] font-medium text-[#777]">{order.date}</p>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[8px] font-bold ${
                  order.state === "Delivered"
                    ? "border-[#bbf7d0] text-[#16a34a]"
                    : "border-[#fed7aa] text-[#ea580c]"
                }`}
              >
                {order.state}
              </span>
            </div>
            <ul className="space-y-1.5">
              {order.items.map((item) => (
                <li key={item.dish.id} className="flex items-center justify-between text-[9px]">
                  <span className="line-clamp-1 text-[#555]">{item.dish.name}</span>
                  <span className="font-bold">x{item.quantity}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 line-clamp-2 text-[8px] leading-3 text-[#777]">{order.address}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="grid min-h-[210px] place-items-center rounded-md bg-[#f7f7f7] px-6 text-center">
      <div>
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-white text-[#ef4444] shadow-sm">
          <ShoppingCart className="size-6" />
        </div>
        <h3 className="text-[12px] font-black">{title}</h3>
        <p className="mt-1 text-[9px] font-medium text-[#777]">{text}</p>
      </div>
    </div>
  );
}

function PaymentSummary({
  deliveryFee,
  disabled,
  submitting,
  subtotal,
  total,
  onCheckout,
}: {
  deliveryFee: number;
  disabled: boolean;
  submitting: boolean;
  subtotal: number;
  total: number;
  onCheckout: () => void;
}) {
  return (
    <section className="mt-3 rounded-lg bg-white p-3 text-[#18181b]">
      <h3 className="mb-3 text-[11px] font-bold">Payment info</h3>
      <SummaryRow label="Items" value={formatCurrency(subtotal)} />
      <SummaryRow label="Shipping" value={deliveryFee ? formatCurrency(deliveryFee) : "-"} />
      <div className="my-3 border-t border-dashed border-[#dfdfdf]" />
      <SummaryRow label="Total" value={total ? formatCurrency(total) : "-"} strong />
      <button
        onClick={onCheckout}
        disabled={disabled || submitting}
        className="mt-3 h-9 w-full rounded-full bg-[#ef4444] text-[10px] font-bold text-white disabled:bg-[#fecaca]"
      >
        {submitting ? "Sending..." : "Checkout"}
      </button>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between text-[9px] ${strong ? "font-black" : ""}`}>
      <span className="text-[#777]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
