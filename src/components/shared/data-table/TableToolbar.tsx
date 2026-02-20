import { type Table, type Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/Button';
import { type ReactNode } from 'react';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';

interface TableToolbarProps<TData> {
  table: Table<TData>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
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

export function TableToolbar<TData>({
  table,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  actions = [],
  bulkActions = [],
}: TableToolbarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b border-neutral-200">
      <div className="flex flex-1 items-center gap-4">
        <Input
          variant="box"
          className="flex-1 max-w-sm"
          value={searchValue}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          placeholder={searchPlaceholder}
          leading={<Search />}
          inputClassName="text-sm"
        />

        {hasSelection && bulkActions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">{selectedRows.length} selected</span>
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'secondary'}
                size="sm"
                className={action.className}
                onClick={() => action.onClick(selectedRows)}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'primary'}
              className={action.className}
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
