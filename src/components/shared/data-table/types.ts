import { type ColumnDef, type Row } from '@tanstack/react-table';
import { type ReactNode } from 'react';

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onRowClick?: (row: Row<TData>) => void;
  enableRowSelection?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  searchPlaceholder?: string;
  emptyState?: {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionLoading?: boolean;
  };
  actions?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    className?: string;
    variant?:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'text'
      | 'link'
      | 'destructive-primary'
      | 'destructive-secondary'
      | 'destructive-tertiary'
      | 'destructive-text'
      | 'destructive-link'
      | 'elevated-primary'
      | 'elevated-secondary';
  }[];
  bulkActions?: {
    label: string;
    icon?: ReactNode;
    onClick: (selectedRows: Row<TData>[]) => void;
    className?: string;
    variant?:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'text'
      | 'link'
      | 'destructive-primary'
      | 'destructive-secondary'
      | 'destructive-tertiary'
      | 'destructive-text'
      | 'destructive-link'
      | 'elevated-primary'
      | 'elevated-secondary';
  }[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
}

export interface DataTableActionsProps<TData> {
  row: Row<TData>;
  onEdit?: (row: Row<TData>) => void;
  onDelete?: (row: Row<TData>) => void;
  customActions?: {
    icon: ReactNode;
    label: string;
    onClick: (row: Row<TData>) => void;
  }[];
}
