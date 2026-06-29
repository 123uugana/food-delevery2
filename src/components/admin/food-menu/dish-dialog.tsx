"use client";

import { ChangeEvent, useRef, useState } from "react";
import { ImageIcon, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { type Category } from "@/components/admin/mock-data";
import { type DishDraft } from "./types";

type DishDialogProps = {
  title: string;
  open: boolean;
  initial: DishDraft;
  categories: Category[];
  submitLabel: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: DishDraft) => void | Promise<void>;
  onDelete?: () => void;
};

export function DishDialog({
  title,
  open,
  initial,
  categories,
  submitLabel,
  onOpenChange,
  onSubmit,
  onDelete,
}: DishDialogProps) {
  const [draft, setDraft] = useState<DishDraft>(initial);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof DishDraft>(key: K, value: DishDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setDraft((current) => ({
      ...current,
      image: URL.createObjectURL(file),
      imageFile: file,
    }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await onSubmit(draft);
    } finally {
      setSubmitting(false);
    }
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
            <Select value={draft.categoryId} onValueChange={(value) => update("categoryId", value)}>
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
                className="h-full w-full object-cover object-center"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute right-2 top-2 size-8 rounded-full bg-white"
                onClick={() =>
                  setDraft((current) => ({ ...current, image: "", imageFile: null }))
                }
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
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
