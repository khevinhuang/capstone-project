import { flexRender, type Row, type Table } from '@tanstack/react-table';
import type { MouseEvent } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

interface TableBodyProps<TData> {
  table: Table<TData>;
  onRowClick?: (row: Row<TData>) => void;
  emptyState?: {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionLoading?: boolean;
  };
}

export function TableBody<TData>({ table, onRowClick, emptyState }: TableBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>, row: Row<TData>) => {
    const target = event.target as HTMLElement;
    const interactiveTarget = target.closest(
      'button, a, input, textarea, select, [role="button"], [data-row-action]'
    );

    if (interactiveTarget) return;
    onRowClick?.(row);
  };

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={table.getAllColumns().length}
            className="px-4 py-12 text-center text-neutral-500"
          >
            <div className="flex flex-col items-center gap-2">
              <p className="text-ait-body-lg-semibold text-ait-neutral-900">
                {emptyState?.title || 'No data available'}
              </p>
              {emptyState?.description && (
                <p className="text-ait-body-md-regular text-ait-neutral-600">{emptyState.description}</p>
              )}
              {emptyState?.onAction && emptyState?.actionLabel && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={emptyState.onAction}
                  disabled={emptyState.actionLoading}
                >
                  {emptyState.actionLoading ? 'Retrying...' : emptyState.actionLabel}
                </Button>
              )}
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-white divide-y divide-neutral-200">
      {rows.map((row) => (
        <tr
          key={row.id}
          onClick={(event) => handleRowClick(event, row)}
          className={cn('hover:bg-neutral-50 transition-colors', onRowClick && 'cursor-pointer')}
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
