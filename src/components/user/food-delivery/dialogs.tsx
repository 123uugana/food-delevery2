import Link from "next/link";
import { CheckCircle2, Clock3, LogOut, Minus, Plus, UserRound, X } from "lucide-react";
import type { Dish } from "@/components/admin/mock-data";
import { formatTotal } from "./utils";

export function CartNotice() {
  return (
    <div className="fixed left-1/2 top-[68px] z-50 -translate-x-1/2 rounded-sm border border-white/30 bg-[#1d1d20] px-4 py-2 text-[12px] font-medium text-white shadow-xl">
      ✓ Food is being added to the cart!
    </div>
  );
}

export function FoodDetailDialog({
  dish,
  quantity,
  onClose,
  onDecrease,
  onIncrease,
  onAddToCart,
}: {
  dish: Dish;
  quantity: number;
  onClose: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  onAddToCart: () => void;
}) {
  const total = formatTotal(dish.price, quantity);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="relative grid w-full max-w-[520px] grid-cols-[1.05fr_1fr] overflow-hidden rounded-xl bg-white p-4 text-[#18181b] shadow-2xl max-sm:max-w-[360px] max-sm:grid-cols-1">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid size-7 place-items-center rounded-full border border-[#ededed] bg-white text-[#9b9b9b]"
          aria-label="Close food detail"
        >
          <X className="size-3.5" />
        </button>

        <div className="h-[210px] overflow-hidden rounded-lg max-sm:h-[180px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- Food detail uses remote URLs from admin data and Blob. */}
          <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex min-h-[210px] flex-col px-5 py-3 max-sm:min-h-0 max-sm:px-1">
          <div>
            <h2 className="pr-7 text-[20px] font-black text-[#ef4444]">{dish.name}</h2>
            <p className="mt-2 max-w-[220px] text-[11px] font-medium leading-4 text-[#333]">
              {dish.ingredients}
            </p>
          </div>

          <div className="mt-auto grid grid-cols-[1fr_auto] items-end gap-4 pt-7">
            <div>
              <p className="text-[11px] font-medium text-[#555]">Total price</p>
              <p className="mt-1 text-[16px] font-black">{total}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="rounded-sm bg-[#ef4444] px-2.5 py-1 text-[13px] font-black text-white">
                {quantity}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onDecrease}
                  className="grid size-7 place-items-center rounded-full border border-[#e5e5e5] text-[#ef4444]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-5 text-center text-[13px] font-semibold">{quantity}</span>
                <button
                  onClick={onIncrease}
                  className="grid size-7 place-items-center rounded-full border border-[#e5e5e5] text-[#ef4444]"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onAddToCart}
            className="mt-4 h-9 rounded-full bg-[#18181b] text-[11px] font-semibold text-white"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export function SuccessOrderDialog({
  onBackHome,
  onClose,
}: {
  onBackHome: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 px-4">
      <div className="relative grid w-full max-w-[360px] place-items-center rounded-lg bg-white px-8 py-9 text-center text-[#18181b] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 grid size-7 place-items-center rounded-full text-[#777]"
          aria-label="Close success dialog"
        >
          <X className="size-4" />
        </button>
        <CheckCircle2 className="size-14 text-[#ef4444]" />
        <h2 className="mt-4 text-[14px] font-black">Your order has been successfully placed!</h2>
        <button
          onClick={onBackHome}
          className="mt-6 h-8 rounded-full bg-[#18181b] px-5 text-[10px] font-bold text-white"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}

export function LoginAlert({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/35 px-4">
      <div className="w-full max-w-[300px] rounded-lg bg-white p-5 text-center text-[#18181b] shadow-2xl">
        <Clock3 className="mx-auto size-9 text-[#ef4444]" />
        <h2 className="mt-3 text-[13px] font-black">You need to log in first</h2>
        <p className="mt-1 text-[9px] font-medium text-[#777]">
          Please sign in before opening your account.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            href="/log-in"
            onClick={onClose}
            className="grid h-8 place-items-center rounded-md bg-[#18181b] text-[10px] font-bold text-white"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            onClick={onClose}
            className="grid h-8 place-items-center rounded-md border text-[10px] font-bold"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AccountDialog({
  email,
  onClose,
  onLogout,
}: {
  email: string;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/35 px-4">
      <div className="w-full max-w-[300px] rounded-lg bg-white p-5 text-center text-[#18181b] shadow-2xl">
        <UserRound className="mx-auto size-9 text-[#ef4444]" />
        <h2 className="mt-3 text-[13px] font-black">Your account</h2>
        <p className="mt-1 truncate text-[10px] font-medium text-[#777]">{email}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="h-8 rounded-md bg-[#18181b] text-[10px] font-bold text-white"
          >
            Close
          </button>
          <button
            onClick={onLogout}
            className="flex h-8 items-center justify-center gap-1 rounded-md border text-[10px] font-bold"
          >
            <LogOut className="size-3" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddressDialog({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
      <div className="w-full max-w-[360px] rounded-lg bg-white p-5 text-[#18181b] shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-[14px] font-bold">Please write your delivery address!</h2>
          <button onClick={onClose} className="grid size-7 place-items-center rounded-full">
            <X className="size-4" />
          </button>
        </div>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Please enter your address here"
          className="h-10 w-full rounded-md border border-[#e5e5e5] px-3 text-[12px] outline-none focus:border-[#ef4444]"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="h-8 rounded-md px-4 text-[11px] font-semibold">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="h-8 rounded-md bg-[#18181b] px-4 text-[11px] font-semibold text-white"
          >
            Deliver here
          </button>
        </div>
      </div>
    </div>
  );
}
