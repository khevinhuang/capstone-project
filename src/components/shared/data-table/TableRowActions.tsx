import { type Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/Button';
import { PencilLine, Trash2 } from 'lucide-react';
import { type ReactNode, type MouseEvent } from 'react';

interface TableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit?: (row: Row<TData>) => void;
  onDelete?: (row: Row<TData>) => void;
  customActions?: {
    icon: ReactNode;
    label: string;
    onClick: (row: Row<TData>) => void;
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
  className: string;
}

export function TableRowActions<TData>({
  row,
  onEdit,
  onDelete,
  customActions = [],
  className,
}: TableRowActionsProps<TData>) {
  return (
    <div className="flex items-center gap-2" data-row-action>
      {onEdit && (
        <Button
          variant="text"
          size="sm"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onEdit(row);
          }}
          className="p-2.5"
          aria-label="Edit"
        >
          <PencilLine className="w-5 h-5" />
        </Button>
      )}

      {onDelete && (
        <Button
          variant="text"
          size="sm"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onDelete(row);
          }}
          // className="p-2.5"
          className={`${className} p-2.5`}
          aria-label="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      )}

      {customActions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'text'}
          size="sm"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            action.onClick(row);
          }}
          aria-label={action.label}
        >
          {action.icon}
        </Button>
      ))}
    </div>
  );
}
