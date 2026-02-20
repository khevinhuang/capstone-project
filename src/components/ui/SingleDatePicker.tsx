import * as React from 'react';
import { createPortal } from 'react-dom';
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

interface SingleDatePickerProps {
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
                    onClick={() => onDateClick(date)}
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
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

export function SingleDatePicker({
  date,
  onDateChange,
  placeholder = 'Select date',
  disabled = false,
  variant = 'default',
  className,
}: SingleDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date());
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });

  // Update position when opening
  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 350; // Approximate height

      setDropdownPosition({
        top: spaceBelow >= dropdownHeight ? rect.bottom + 4 : rect.top - dropdownHeight - 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
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

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const dropdownContent = isOpen && !disabled && (
    <div
      ref={dropdownRef}
      data-portal="datepicker"
      className="fixed z-[100] rounded-lg border border-ait-neutral-200 bg-white shadow-ait-xl"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        minWidth: `${Math.max(dropdownPosition.width, 320)}px`,
      }}
    >
      {/* Header with month/year navigation */}
      <div className="flex items-center justify-between p-4 border-b border-ait-neutral-200">
        <button
          type="button"
          onClick={handlePrevMonth}
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
  );

  return (
    <div className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
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
          {date ? format(date, 'MMM d, yyyy') : placeholder}
        </span>
        <CalendarIcon className="h-4 w-4 text-ait-neutral-500 flex-shrink-0" />
      </button>

      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}
