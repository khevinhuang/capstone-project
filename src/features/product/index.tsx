import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DeleteProductDialog } from "./components/DeleteProductDialog";
import { ProductTable } from "./components/ProductTable";
import { UpdateProductDialog } from "./components/UpdateProductDialog";
import { useProducts } from "./hooks/useProduct";
import { useProductMutations } from "./hooks/useProductMutation";
import { useProductStore } from "./store/product.store";
import { Product, ProductPayload, UpdateProductInput } from "./types";
import { scalePrice } from "./utils/price";

interface ProductUiState {
  updateDialogOpen: boolean;
  deleteDialogOpen: boolean;
  selectedProduct: Product | null;
}

type ProductUiAction =
  | { type: "OPEN_UPDATE"; payload: Product }
  | { type: "CLOSE_UPDATE" }
  | { type: "OPEN_DELETE"; payload: Product }
  | { type: "CLOSE_DELETE" }
  | { type: "CLEAR_SELECTED" };

const initialUiState: ProductUiState = {
  updateDialogOpen: false,
  deleteDialogOpen: false,
  selectedProduct: null,
};

function productUiReducer(state: ProductUiState, action: ProductUiAction): ProductUiState {
  switch (action.type) {
    case "OPEN_UPDATE":
      return {
        ...state,
        updateDialogOpen: true,
        selectedProduct: action.payload,
      };
    case "CLOSE_UPDATE":
      return {
        ...state,
        updateDialogOpen: false,
      };
    case "OPEN_DELETE":
      return {
        ...state,
        deleteDialogOpen: true,
        selectedProduct: action.payload,
      };
    case "CLOSE_DELETE":
      return {
        ...state,
        deleteDialogOpen: false,
      };
    case "CLEAR_SELECTED":
      return {
        ...state,
        selectedProduct: null,
      };
    default:
      return state;
  }
}

export default function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setProduct = useProductStore((state) => state.setProduct);
  const [uiState, dispatch] = useReducer(productUiReducer, initialUiState);
  const { toasts, success, error } = useToast();
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProducts();
  const { update, remove } = useProductMutations();

  useEffect(() => {
    setProduct(products);
  }, [products, setProduct]);

  useEffect(() => {
    const state = location.state as { productAction?: string; productName?: string } | null;
    if (state?.productAction === 'created') {
      const description = state.productName
        ? `"${state.productName}" has been added.`
        : 'Product has been added.';
      success('Product created successfully', description);
      void navigate('/product', { replace: true, state: null });
      return;
    }
    if (state?.productAction === 'updated') {
      const description = state.productName
        ? `"${state.productName}" has been updated.`
        : 'Product has been updated.';
      success('Product updated successfully', description);
      void navigate('/product', { replace: true, state: null });
    }
  }, [location.state, navigate, success]);

  const onView = (product: Product) => {
    void navigate(`/product/${product.id}`);
  };
  const onUpdate = (product: Product) => {
    // dispatch({ type: "OPEN_UPDATE", payload: product });
    void navigate(`/product/update/${product.id}`);
  };
  const handleUpdate = (id: Product['id'], updates: UpdateProductInput) => {
    const payload: ProductPayload = {
      name: (updates.name ?? '').trim(),
      category: (updates.category ?? '').trim(),
      description: (updates.description ?? '').trim(),
      price: scalePrice(updates.price ?? 0),
      stock: Number(updates.stock ?? 0),
      createAt: updates.createAt ?? new Date().toISOString(),
      avatar: uiState.selectedProduct?.avatar ?? '',
    };
    update.mutate(
      { id, payload },
      {
        onSuccess: () => {
          dispatch({ type: "CLOSE_UPDATE" });
          dispatch({ type: "CLEAR_SELECTED" });
          success('Product Updated Successfully', 'Your changes have been saved.');
        },
        onError: () => {
          error('Failed to update product', 'An error occurred. Please try again.');
        },
      }
    );
  };
  const onDelete = (product: Product) => {
    dispatch({ type: "OPEN_DELETE", payload: product });
  }
  const handleDelete = (id: Product['id']) => {
    remove.mutate(id, {
      onSuccess: () => {
        dispatch({ type: "CLOSE_DELETE" });
        dispatch({ type: "CLEAR_SELECTED" });
        success('Product Deleted Successfully', 'The product has been deleted');
      },
      onError: () => {
        error('Failed to delete product', 'An error occurred. Please try again.');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 rounded-full border-4 border-ait-neutral-200 border-t-ait-primary-500 animate-spin mb-4" />
        <p className="text-ait-body-lg-regular text-ait-neutral-600">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-ait-body-lg-regular text-ait-neutral-600 mb-4">
          Failed to load products. Please try again.
        </p>
        <div className="flex items-center gap-2">
          <Button onClick={() => { void refetch(); }} disabled={isFetching}>
            {isFetching ? 'Retrying...' : 'Retry'}
          </Button>
          <Button variant="secondary" onClick={() => { void navigate('/'); }}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-ait-h1 text-ait-neutral-900 mb-2">Product Category</h1>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl border border-ait-neutral-200 shadow-sm overflow-hidden">
        <ProductTable
          products={products}
          onView={onView}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAdd={() => {
            void navigate('/product/add');
          }}
          onRetry={() => {
            void refetch();
          }}
          isRetrying={isFetching}
        />
      </div>
      {/* Update Dialog */}
      <UpdateProductDialog
        open={uiState.updateDialogOpen}
        onOpenChange={(open) => {
          if (open) return;
          dispatch({ type: "CLOSE_UPDATE" });
          dispatch({ type: "CLEAR_SELECTED" });
        }}
        product={uiState.selectedProduct}
        onSubmit={handleUpdate}
        isSubmitting={update.isPending}
      />
      {/* Delete Dialog */}
      <DeleteProductDialog
        open={uiState.deleteDialogOpen}
        onOpenChange={(open) => {
          if (open) return;
          dispatch({ type: "CLOSE_DELETE" });
          dispatch({ type: "CLEAR_SELECTED" });
        }}
        product={uiState.selectedProduct}
        onConfirm={handleDelete}
      />
      {/* Toast Message */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}
