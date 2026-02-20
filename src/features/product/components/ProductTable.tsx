import { DataTable, TableRowActions, type ColumnDef } from "@/components/shared/data-table";
import { Button } from "@/components/ui/Button";
import { SimpleSelect } from "@/components/ui/SimpleSelect";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Product } from "../types";

interface ProductTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAdd: () => void;
  onRetry?: () => void;
  isRetrying?: boolean;
}
export function ProductTable({
  products,
  onView,
  onUpdate,
  onDelete,
  onAdd,
  onRetry,
  isRetrying = false,
}: ProductTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categoryOptions = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((item) => {
      if (item.category) unique.add(item.category);
    });
    return [{ value: 'all', label: 'All Categories' }].concat(
      Array.from(unique)
        .sort()
        .map((material) => ({ value: material, label: material }))
    );
  }, [products]);
  const parsePrice = (price: string | number | undefined): number => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const clean = String(price).replace(/[^\d.]/g, '');
    return parseFloat(clean) || 0;
  };
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((item) => item.category === selectedCategory)
  }, [products, selectedCategory]);
  const columns = useMemo<ColumnDef<Product>[]>(() => {
    return [
      {
        id: 'index',
        header: '#',
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => row.original.category || '-',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        accessorFn: (row) => parsePrice(row.price),
        cell: ({ row }) => (
          <span className="block">
            ${Number(row.original.price || 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        )
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        accessorFn: (row) => row.stock,
        cell: ({ row }) => row.original.stock || '-'
      },
      {
        id: 'createAt',
        header: 'Date Added',
        accessorFn: (row) => row.createAt,
        cell: ({ row }) => {
          const value = row.original.createAt;
          const date = value ? new Date(value) : null;
          return (
            <span className="block">
              {date && !Number.isNaN(date.getTime()) ? format(date, "MMM dd, yyyy") : '-'}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => (
          <TableRowActions
            row={row}
            onDelete={(r) => onDelete(r.original)}
            onEdit={(r) => onUpdate(r.original)}
            className='text-ait-danger-600 hover:text-ait-danger-700 hover:bg-ait-danger-50'
          />
        )
      }
    ]
  }, [onUpdate, onDelete]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 border-b border-ait-neutral-200">
        {/* Filtered by Material */}
        <div className="flex items-center gap-2">
          <SimpleSelect
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            options={categoryOptions}
            size="md"
            className="min-w-[160px]"
          />
        </div>
        {/* Add New Product */}
        <Button
          variant="primary"
          size="md"
          onClick={onAdd}
          className="whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Button>
      </div>
      {/* Product Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        enableFiltering
        enablePagination
        emptyState={{
          title: 'No products found',
          description: 'Add a new product to see product list.',
          actionLabel: 'Retry',
          onAction: onRetry,
          actionLoading: isRetrying,
        }}
        onRowClick={(row) => onView(row.original)}
        pageSize={10}
        searchPlaceholder="Search products..."
      />
    </div>
  )
}
