import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { SimpleDatePicker } from "@/components/ui/SimpleDatePicker";
import { Textarea } from "@/components/ui/Textarea";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/product.store";
import type { Product, UpdateProductInput } from "../types";
import { toEditablePrice } from "../utils/price";

interface UpdateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSubmit: (id: Product['id'], updates: UpdateProductInput) => void;
  isSubmitting?: boolean;
}

const MAX_NAME_LENGTH = 100;
const MAX_CATEGORY_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 100;
const MIN_PRICE = 0.01;
const MAX_PRICE = 1000000;
const MIN_STOCK = 0;

function formatDateInput(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function UpdateProductDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isSubmitting = false
}: UpdateProductDialogProps) {
  const setUpdateDraft = useProductStore((state) => state.setUpdateDraft);
  const clearUpdateDraft = useProductStore((state) => state.clearUpdateDraft);
  const [formData, setFormData] = useState<UpdateProductInput>({
    name: '',
    category: '',
    description: '',
    createAt: '',
    price: '',
    stock: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && product) {
      const baseData: UpdateProductInput = {
        name: product.name,
        description: product.description,
        category: product.category,
        price: toEditablePrice(product.price),
        stock: String(product.stock),
        createAt: formatDateInput(product.createAt),
      };
      const draft = useProductStore.getState().updateDrafts[String(product.id)];
      setFormData({ ...baseData, ...draft });
      setErrors({});
    }
  }, [open, product]);
  if (!product) return null;

  const onCancel = () => {
    setErrors({});
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length > MAX_NAME_LENGTH) {
      newErrors.name = `Name must be ${MAX_NAME_LENGTH} characters or less`;
    }

    if (!formData.price?.trim()) {
      newErrors.price = 'Price is required';
    } else if (Number.isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a number';
    } else if (Number(formData.price) < MIN_PRICE) {
      newErrors.price = `Price must be at least ${MIN_PRICE}`;
    } else if (Number(formData.price) > MAX_PRICE) {
      newErrors.price = `Price must be ${MAX_PRICE.toLocaleString()} or less`;
    }

    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    } else if (formData.category.trim().length > MAX_CATEGORY_LENGTH) {
      newErrors.category = `Category must be ${MAX_CATEGORY_LENGTH} characters or less`;
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
    }

    if (!formData.stock?.trim()) {
      newErrors.stock = 'Stock is required';
    } else if (!Number.isInteger(Number(formData.stock))) {
      newErrors.stock = 'Stock must be a whole number';
    } else if (Number(formData.stock) < MIN_STOCK) {
      newErrors.stock = `Stock must be at least ${MIN_STOCK}`;
    }

    if (!formData.createAt?.trim()) {
      newErrors.createAt = 'Date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(product.id, {
      ...formData,
      createAt: formData?.createAt ? new Date(formData.createAt).toISOString() : formData.createAt
    });
    clearUpdateDraft(product.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          {/* Update Name Input */}
          <div className="space-y-2">
            <label className="block text-ait-body-md-semibold text-ait-neutral-900">
              Name <span className="text-ait-danger-500">*</span>
            </label>
            <Input
              value={formData.name || ''}
              onChange={(e) => {
                const next = { ...formData, name: e.target.value };
                setFormData(next);
                setUpdateDraft(product.id, next);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="Enter product name"
              error={!!errors.name}
              maxLength={MAX_NAME_LENGTH}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-ait-caption-md-regular text-ait-danger-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>
          {/* Update Category Input */}
          <div className="space-y-2">
            <label className="block text-ait-body-md-semibold text-ait-neutral-900">
              Category <span className="text-ait-danger-500">*</span>
            </label>
            <Input
              value={formData.category || ''}
              onChange={(e) => {
                const next = { ...formData, category: e.target.value };
                setFormData(next);
                setUpdateDraft(product.id, next);
                if (errors.category) setErrors({ ...errors, category: '' });
              }}
              placeholder="Enter category"
              error={!!errors.category}
              maxLength={MAX_CATEGORY_LENGTH}
              disabled={isSubmitting}
            />
            {errors.category && (
              <p className="text-ait-caption-md-regular text-ait-danger-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.category}
              </p>
            )}
          </div>
          {/* Update Description Input */}
          <div className="space-y-2">
            <label className="block text-ait-body-md-semibold text-ait-neutral-900">
              Description <span className="text-ait-danger-500">*</span>
            </label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => {
                const next = { ...formData, description: e.target.value };
                setFormData(next);
                setUpdateDraft(product.id, next);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder="Enter description"
              error={!!errors.description}
              inputSize="md"
              maxLength={MAX_DESCRIPTION_LENGTH}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-ait-caption-md-regular text-ait-danger-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>
          {/* Update Price Input */}
          <div className="space-y-2">
            <label className="block text-ait-body-md-semibold text-ait-neutral-900">
              Price <span className="text-ait-danger-500">*</span>
            </label>
            <Input
              value={formData.price || ''}
              onChange={(e) => {
                const next = { ...formData, price: e.target.value };
                setFormData(next);
                setUpdateDraft(product.id, next);
                if (errors.price) setErrors({ ...errors, price: '' });
              }}
              placeholder="Enter price"
              error={!!errors.price}
              type="number"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step="0.01"
              inputMode="decimal"
              disabled={isSubmitting}
            />
            {errors.price && (
              <p className="text-ait-caption-md-regular text-ait-danger-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.price}
              </p>
            )}
          </div>
          {/* Update Stock Input */}
          <div className="space-y-2">
            <label className="block text-ait-body-md-semibold text-ait-neutral-900">
              Stock <span className="text-ait-danger-500">*</span>
            </label>
            <Input
              value={formData.stock || ''}
              onChange={(e) => {
                const next = { ...formData, stock: e.target.value };
                setFormData(next);
                setUpdateDraft(product.id, next);
                if (errors.stock) setErrors({ ...errors, stock: '' });
              }}
              placeholder="Enter stock"
              error={!!errors.stock}
              type="number"
              min={MIN_STOCK}
              step="1"
              inputMode="numeric"
              disabled={isSubmitting}
            />
            {errors.stock && (
              <p className="text-ait-caption-md-regular text-ait-danger-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.stock}
              </p>
            )}
          </div>
          {/* Update CreateAt Input */}
          <div className="space-y-2">
            <label className="block text-ait-body-md-semibold text-ait-neutral-900">
              Date Added <span className="text-ait-danger-500">*</span>
            </label>
            <SimpleDatePicker
              date={parseDateInputValue(formData.createAt)}
              onDateChange={(date) => {
                const next = { ...formData, createAt: date ? toDateInputValue(date) : '' };
                setFormData(next);
                setUpdateDraft(product.id, next);
                if (errors.createAt) setErrors({ ...errors, createAt: '' });
              }}
              placeholder="Select date"
              variant={errors.createAt ? 'error' : 'default'}
              disabled={isSubmitting}
              className="w-full"
            />
            {errors.createAt && (
              <p className="text-ait-caption-md-regular text-ait-danger-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.createAt}
              </p>
            )}
          </div>
        </DialogBody>
        {/* Update Action Button Dialog */}
        <DialogFooter>
          <Button variant="primary" onClick={onCancel}>Cancel</Button>
          <Button disabled={isSubmitting} onClick={handleSubmit}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
