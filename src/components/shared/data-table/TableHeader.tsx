import { flexRender, type Header, type Table } from '@tanstack/react-table';
import { cn } from '@/lib/cn';
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';

interface TableHeaderProps<TData> {
  table: Table<TData>;
}

export function TableHeader<TData>({ table }: TableHeaderProps<TData>) {
  return (
    <thead className="bg-neutral-50">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={cn(
                'px-4 py-3 text-left text-xs font-semibold text-neutral-600',
                header.column.getCanSort() && 'cursor-pointer select-none'
              )}
              onClick={header.column.getToggleSortingHandler()}
            >
              {header.isPlaceholder ? null : (
                <div className="flex items-center gap-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanSort() && <SortIndicator header={header} />}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

function SortIndicator<TData>({ header }: { header: Header<TData, unknown> }) {
  const sortDirection = header.column.getIsSorted();

  if (!sortDirection) {
    return <ChevronsUpDown className="w-4 h-4 text-neutral-400" />;
  }

  if (sortDirection === 'asc') {
    return <ChevronUp className="w-4 h-4 text-neutral-700" />;
  }

  return <ChevronDown className="w-4 h-4 text-neutral-700" />;
}
