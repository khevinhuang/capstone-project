import * as React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  startOfDay,
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SimpleDatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'error';
  className?: string;
}

function CalendarGrid({
  month,
  selectedDate,
  onDateClick,
}: {
  month: Date;
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
}) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return startOfDay(date).getTime() === startOfDay(selectedDate).getTime();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return startOfDay(date).getTime() === startOfDay(today).getTime();
  };

  const isOutsideMonth = (date: Date) => {
    return date.getMonth() !== month.getMonth();
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-1">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center">
              <p className="text-ait-body-sm-semibold text-ait-neutral-600 text-xs">{day}</p>
            </div>
          ))}
        </div>
        {/* Date rows */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-0">
            {week.map((date, dateIdx) => {
              const selected = isSelected(date);
              const today = isToday(date);
              const outside = isOutsideMonth(date);

              return (
                <div key={dateIdx} className="flex items-center justify-center p-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDateClick(date);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer',
                      outside && 'text-ait-neutral-400',
                      !outside && !selected && 'text-ait-neutral-700 hover:bg-ait-neutral-100',
                      selected && 'bg-ait-primary-500 text-white hover:bg-ait-primary-600',
                      today && !selected && 'ring-2 ring-ait-primary-500 ring-inset'
                    )}
                  >
                    {format(date, 'd')}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SimpleDatePicker({
  date,
  onDateChange,
  placeholder = 'Select date',
  disabled = false,
  variant = 'default',
  className,
}: SimpleDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date());
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use timeout to avoid immediate close
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleDateClick = (selectedDate: Date) => {
    onDateChange?.(selectedDate);
    setIsOpen(false);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-ait-body-md-regular transition-colors bg-white',
          variant === 'default' &&
          'border-ait-neutral-300 focus:outline-none focus:ring-2 focus:ring-ait-primary-500 focus:border-transparent',
          variant === 'error' &&
          'border-ait-danger-500 focus:outline-none focus:ring-2 focus:ring-ait-danger-500 focus:border-transparent',
          disabled && 'opacity-50 cursor-not-allowed bg-ait-neutral-50',
          !disabled && 'hover:border-ait-neutral-400'
        )}
      >
        <span className={cn(!date && 'text-ait-neutral-500')}>
          {date ? format(date, 'dd MMM yyyy') : placeholder}
        </span>
        <CalendarIcon className="h-4 w-4 text-ait-neutral-500 flex-shrink-0" />
      </button>

      {isOpen && !disabled && (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-full left-0 mt-2 z-[200] rounded-lg border border-ait-neutral-200 bg-white shadow-ait-xl"
          style={{ minWidth: '320px' }}
        >
          {/* Header with month/year navigation */}
          <div className="flex items-center justify-between p-4 border-b border-ait-neutral-200">
            <button
              type="button"
              onClick={handlePrevMonth}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-1 rounded-md hover:bg-ait-neutral-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-ait-neutral-700" />
            </button>
            <p className="text-ait-body-md-semibold text-ait-neutral-900">
              {format(currentMonth, 'MMMM yyyy')}
            </p>
            <button
              type="button"
              onClick={handleNextMonth}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-1 rounded-md hover:bg-ait-neutral-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-ait-neutral-700" />
            </button>
          </div>

          {/* Calendar */}
          <CalendarGrid
            month={currentMonth}
            selectedDate={date || null}
            onDateClick={handleDateClick}
          />
        </div>
      )}
    </div>
  );
}
