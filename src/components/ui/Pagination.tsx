import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 7; // Maximum number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages if total pages is less than or equal to showPages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Show pages 2, 3, 4 if current page is in first few pages
      if (currentPage <= 3) {
        pages.push(2, 3, 4);
        pages.push('...');
        pages.push(totalPages);
      }
      // Show last pages if current page is near the end
      else if (currentPage >= totalPages - 2) {
        pages.push('...');
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
      // Show pages around current page
      else {
        pages.push(2, 3, 4);
        pages.push('...');
        pages.push(totalPages - 1, totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-ait-neutral-200 pt-5 pb-6 px-6',
        className
      )}
    >
      {/* Left side - Rows per page selector */}
      {onItemsPerPageChange && (
        <div className="flex items-center gap-3">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-auto gap-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-ait-body-md-regular text-ait-neutral-700">Rows per page</p>
        </div>
      )}

      {/* Right side - Page navigation */}
      <div className="flex items-center gap-3">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center justify-center w-10 h-10 p-2.5 rounded-bl-lg rounded-tl-lg transition-colors',
            currentPage === 1
              ? 'text-ait-neutral-400 cursor-not-allowed'
              : 'text-ait-neutral-700 hover:bg-ait-neutral-100'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-0.5">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={cn(
                'w-10 h-10 flex items-center justify-center p-3 rounded-lg font-medium text-sm leading-5 transition-colors',
                page === currentPage
                  ? 'bg-[#00487a] text-white'
                  : page === '...'
                    ? 'text-ait-neutral-500 cursor-default'
                    : 'text-ait-neutral-500 hover:bg-ait-neutral-100'
              )}
              style={{ fontFamily: 'Roboto, sans-serif', fontVariationSettings: "'wdth' 100" }}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center justify-center w-10 h-10 p-2.5 rounded-br-lg rounded-tr-lg transition-colors',
            currentPage === totalPages
              ? 'text-ait-neutral-400 cursor-not-allowed'
              : 'text-ait-neutral-700 hover:bg-ait-neutral-100'
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
