import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SimpleDatePicker } from '@/components/ui/SimpleDatePicker';
import { Textarea } from '@/components/ui/Textarea';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductMutations } from '../hooks/useProductMutation';
import { useProductStore } from '../store/product.store';
import type { ProductPayload } from '../types';
import { scalePrice } from '../utils/price';

const MAX_NAME_LENGTH = 100;
const MAX_CATEGORY_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 100;
const MIN_PRICE = 0.01;
const MAX_PRICE = 1000000;
const MIN_STOCK = 0;

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

export function AddProductPage() {
  const navigate = useNavigate();
  const addDraft = useProductStore((state) => state.addDraft);
  const setAddDraft = useProductStore((state) => state.setAddDraft);
  const clearAddDraft = useProductStore((state) => state.clearAddDraft);
  const { create } = useProductMutations();

  const [formData, setFormData] = useState(() => ({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    createAt: new Date().toISOString().slice(0, 10),
    ...addDraft,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateDraft = (next: typeof formData) => {
    setFormData(next);
    setAddDraft(next);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length > MAX_NAME_LENGTH) {
      newErrors.name = `Name must be ${MAX_NAME_LENGTH} characters or less`;
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (Number.isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a number';
    } else if (Number(formData.price) < MIN_PRICE) {
      newErrors.price = `Price must be at least ${MIN_PRICE}`;
    } else if (Number(formData.price) > MAX_PRICE) {
      newErrors.price = `Price must be ${MAX_PRICE.toLocaleString()} or less`;
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    } else if (formData.category.trim().length > MAX_CATEGORY_LENGTH) {
      newErrors.category = `Category must be ${MAX_CATEGORY_LENGTH} characters or less`;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock is required';
    } else if (!Number.isInteger(Number(formData.stock))) {
      newErrors.stock = 'Stock must be a whole number';
    } else if (Number(formData.stock) < MIN_STOCK) {
      newErrors.stock = `Stock must be at least ${MIN_STOCK}`;
    }

    if (!formData.createAt.trim()) {
      newErrors.createAt = 'Date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const payload: ProductPayload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      price: scalePrice(formData.price),
      stock: Number(formData.stock),
      createAt: new Date(formData.createAt).toISOString(),
      avatar: '',
    };

    create.mutate(payload, {
      onSuccess: (newProduct) => {
        clearAddDraft();
        void navigate('/product', {
          state: { productAction: 'created', productName: newProduct.name },
        });
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleCancel = () => {
    setErrors({});
    void navigate('/product');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="text"
          size="sm"
          onClick={handleCancel}
          className="p-2"
          aria-label="Back to products"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-ait-h1 text-ait-neutral-900">Add Product</h1>
          <p className="text-ait-body-md-regular text-ait-neutral-600">
            Fill in the details below to add a new product.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-ait-neutral-200 shadow-sm p-6 space-y-4">
        <div className="space-y-2">
          <label className="block text-ait-body-md-semibold text-ait-neutral-900">
            Name <span className="text-ait-danger-500">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => {
              const next = { ...formData, name: e.target.value };
              updateDraft(next);
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

        <div className="space-y-2">
          <label className="block text-ait-body-md-semibold text-ait-neutral-900">
            Category <span className="text-ait-danger-500">*</span>
          </label>
          <Input
            value={formData.category}
            onChange={(e) => {
              const next = { ...formData, category: e.target.value };
              updateDraft(next);
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

        <div className="space-y-2">
          <label className="block text-ait-body-md-semibold text-ait-neutral-900">
            Description <span className="text-ait-danger-500">*</span>
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => {
              const next = { ...formData, description: e.target.value };
              updateDraft(next);
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

        <div className="space-y-2">
          <label className="block text-ait-body-md-semibold text-ait-neutral-900">
            Price <span className="text-ait-danger-500">*</span>
          </label>
          <Input
            value={formData.price}
            onChange={(e) => {
              const next = { ...formData, price: e.target.value };
              updateDraft(next);
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

        <div className="space-y-2">
          <label className="block text-ait-body-md-semibold text-ait-neutral-900">
            Stock <span className="text-ait-danger-500">*</span>
          </label>
          <Input
            value={formData.stock}
            onChange={(e) => {
              const next = { ...formData, stock: e.target.value };
              updateDraft(next);
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

        <div className="space-y-2">
          <label className="block text-ait-body-md-semibold text-ait-neutral-900">
            Date Added <span className="text-ait-danger-500">*</span>
          </label>
          <SimpleDatePicker
            date={parseDateInputValue(formData.createAt)}
            onDateChange={(date) => {
              const next = { ...formData, createAt: date ? toDateInputValue(date) : '' };
              updateDraft(next);
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

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </div>
    </div>
  );
}
