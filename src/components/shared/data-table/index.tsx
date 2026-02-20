import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTableState } from './hooks/useTableState';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { TablePagination } from './TablePagination';
import { TableToolbar } from './TableToolbar';
import { type DataTableProps } from './types';

export function DataTable<TData>({
  data,
  columns,
  onRowClick,
  enableRowSelection = false,
  enablePagination = true,
  pageSize = 10,
  enableSorting = true,
  enableFiltering = true,
  searchPlaceholder = 'Search...',
  emptyState,
  actions = [],
  bulkActions = [],
}: DataTableProps<TData>) {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
  } = useTableState(pageSize);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
    }),
    ...(enableFiltering && {
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
    }),
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
    }),
    ...(enableRowSelection && {
      onRowSelectionChange: setRowSelection,
      enableRowSelection: true,
    }),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
      {(enableFiltering || actions.length > 0 || bulkActions.length > 0) && (
        <TableToolbar
          table={table}
          searchValue={globalFilter}
          onSearchChange={setGlobalFilter}
          searchPlaceholder={searchPlaceholder}
          actions={actions}
          bulkActions={bulkActions}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <TableHeader table={table} />
          <TableBody table={table} onRowClick={onRowClick} emptyState={emptyState} />
        </table>
      </div>

      {enablePagination && <TablePagination table={table} />}
    </div>
  );
}

// Re-export types and utilities
export type { ColumnDef } from '@tanstack/react-table';
export { TableRowActions } from './TableRowActions';
export type { DataTableProps } from './types';
