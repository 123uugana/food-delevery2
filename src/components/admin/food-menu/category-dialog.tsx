import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CategoryDialogProps = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
};

export function CategoryDialog({
  open,
  value,
  onChange,
  onOpenChange,
  onSubmit,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[430px] gap-7 rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">Add new category</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label className="text-[12px] font-medium">Category name</Label>
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Type category name..."
            className="h-10 rounded-md text-[13px]"
          />
        </div>
        <div className="flex justify-end">
          <Button className="h-10 rounded-md bg-[#121214] px-5 text-[13px]" onClick={onSubmit}>
            Add category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
