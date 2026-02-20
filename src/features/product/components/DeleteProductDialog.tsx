import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/Dialog";
import type { Product } from "../types";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onConfirm: (id: Product['id']) => void;
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onConfirm
}: DeleteProductDialogProps) {
  if (!product) return null;

  const handleConfirm = () => {
    onConfirm(product.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>Delete Product</DialogHeader>
        <DialogBody>
          <p>
            Are you sure want to delete{' '}
            <span className="text-ait-body-md-semibold text-ait-neutral-900">
              {product.name}
            </span>
            ? This action cannot be undone.
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive-primary" onClick={handleConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}