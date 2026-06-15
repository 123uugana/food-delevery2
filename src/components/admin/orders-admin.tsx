"use client";

import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  orders as seedOrders,
  type DeliveryState,
  type Order,
} from "@/components/admin/mock-data";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const states: DeliveryState[] = ["Pending", "Delivered", "Cancelled"];

const statusClass: Record<DeliveryState, string> = {
  Pending: "border-[#ff4f55] bg-white text-[#111]",
  Delivered: "border-[#5cc784] bg-[#f9fffb] text-[#111]",
  Cancelled: "border-[#dddddd] bg-white text-[#111]",
};

export function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["order-1", "order-2", "order-3"]),
  );
  const [expanded, setExpanded] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkState, setBulkState] = useState<DeliveryState>("Delivered");

  const selectedCount = selected.size;
  const allSelected = selected.size === orders.length;

  const totalItems = useMemo(() => `${orders.length * 2 + 8} items`, [orders.length]);

  function toggleSelected(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function updateStatus(id: string, state: DeliveryState) {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, state } : order)),
    );
    toast("Delivery state updated.");
  }

  function applyBulkState() {
    setOrders((current) =>
      current.map((order) =>
        selected.has(order.id) ? { ...order, state: bulkState } : order,
      ),
    );
    setBulkOpen(false);
    toast("Delivery state changed for selected orders.", {
      icon: <Check className="size-4" />,
    });
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-md bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between border-b border-[#e7e7e7] px-4 py-5">
          <div>
            <h1 className="text-[20px] font-bold leading-5">Orders</h1>
            <p className="mt-1 text-[11px] font-medium text-[#777]">{totalItems}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-8 rounded-full border-[#dedede] bg-white px-5 text-[12px] font-medium"
            >
              <CalendarDays className="mr-2 size-4" />
              13 June 2023 - 14 July 2023
            </Button>
            <Button
              className="h-9 rounded-full bg-[#151518] px-4 text-[12px] font-semibold text-white hover:bg-[#151518]"
              onClick={() => selectedCount > 0 && setBulkOpen(true)}
              disabled={selectedCount === 0}
            >
              Change delivery state
              <span className="ml-3 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#151518]">
                {selectedCount}
              </span>
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="h-[50px] bg-[#f7f7f7] hover:bg-[#f7f7f7]">
              <TableHead className="w-12 pl-4">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) =>
                    setSelected(checked ? new Set(orders.map((order) => order.id)) : new Set())
                  }
                />
              </TableHead>
              <TableHead className="w-16 text-[12px] font-medium">№</TableHead>
              <TableHead className="w-[190px] text-[12px] font-medium">Customer</TableHead>
              <TableHead className="w-[180px] text-[12px] font-medium">Food</TableHead>
              <TableHead className="w-[130px] text-[12px] font-medium">Date</TableHead>
              <TableHead className="w-[120px] text-[12px] font-medium">Total</TableHead>
              <TableHead className="text-[12px] font-medium">Delivery Address</TableHead>
              <TableHead className="w-[150px] text-[12px] font-medium">
                Delivery state
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <TableRow
                  className={cn(
                    "h-[52px] border-[#e8e8e8] text-[13px]",
                    selected.has(order.id) && "bg-[#f4f4f4]",
                  )}
                >
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selected.has(order.id)}
                      onCheckedChange={() => toggleSelected(order.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{order.number}</TableCell>
                  <TableCell className="font-medium text-[#777]">{order.customer}</TableCell>
                  <TableCell>
                    <button
                      className="flex w-full items-center justify-between text-[#5f5f5f]"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <span>{order.foods.length} foods</span>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          expanded === order.id && "rotate-180",
                        )}
                      />
                    </button>
                  </TableCell>
                  <TableCell className="font-medium text-[#676767]">{order.date}</TableCell>
                  <TableCell className="font-medium text-[#676767]">{order.total}</TableCell>
                  <TableCell className="max-w-[270px] truncate text-[12px] font-medium leading-4 text-[#676767]">
                    {order.address}
                  </TableCell>
                  <TableCell>
                    <StatusSelect
                      value={order.state}
                      onChange={(state) => updateStatus(order.id, state)}
                    />
                  </TableCell>
                </TableRow>
                {expanded === order.id && (
                  <TableRow className="border-[#e8e8e8] bg-white hover:bg-white">
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell colSpan={2} className="py-2">
                      <div className="space-y-2">
                        {order.foods.map((food) => (
                          <div key={food.id} className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element -- Mock table thumbnails use plain img tags. */}
                            <img
                              src={food.image}
                              alt={food.name}
                              className="size-8 rounded-md object-cover"
                            />
                            <span className="text-[12px] font-medium">{food.name}</span>
                            <span className="ml-auto text-[12px] font-semibold">x 1</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell colSpan={3} />
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </section>

      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <PaginationButton disabled>
            <ChevronLeft className="size-4" />
          </PaginationButton>
          {[1, 2, 3, 4, 5].map((page) => (
            <PaginationButton key={page} active={page === 1}>
              {page}
            </PaginationButton>
          ))}
          <PaginationButton>...</PaginationButton>
          <PaginationButton>10</PaginationButton>
          <PaginationButton>
            <ChevronRight className="size-4" />
          </PaginationButton>
        </div>
      </div>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-[340px] rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-[14px] font-semibold">
              Change delivery state
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-3">
            {states.map((state) => (
              <button
                key={state}
                onClick={() => setBulkState(state)}
                className={cn(
                  "h-8 flex-1 rounded-full bg-[#f4f4f4] text-[12px] font-medium",
                  bulkState === state && "border border-[#ff4248] bg-white text-[#ff4248]",
                )}
              >
                {state}
              </button>
            ))}
          </div>
          <Button
            className="h-9 rounded-full bg-[#151518] text-[12px] hover:bg-[#151518]"
            onClick={applyBulkState}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: DeliveryState;
  onChange: (state: DeliveryState) => void;
}) {
  return (
    <Select value={value} onValueChange={(state) => onChange(state as DeliveryState)}>
      <SelectTrigger
        className={cn(
          "h-8 w-[102px] rounded-full px-3 text-[11px] font-bold",
          statusClass[value],
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-[80] min-w-[108px] rounded-md bg-white p-2 shadow-lg">
        {states.map((state) => (
          <SelectItem key={state} value={state} className="text-[11px] font-semibold">
            {state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function PaginationButton({
  children,
  active,
  disabled,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-white text-[12px] font-medium text-[#333] shadow-sm disabled:opacity-40",
        active && "bg-[#333436] text-white",
      )}
    >
      {children}
    </button>
  );
}
