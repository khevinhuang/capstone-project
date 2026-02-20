import * as React from 'react';
import { createPortal } from 'react-dom';
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  addMonths,
  subMonths as subtractMonths,
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import 'react-day-picker/style.css';

const QUICK_FILTERS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This week', value: 'this-week' },
  { label: 'Last week', value: 'last-week' },
  { label: 'This month', value: 'this-month' },
  { label: 'Last month', value: 'last-month' },
  { label: 'This year', value: 'this-year' },
  { label: 'Last year', value: 'last-year' },
  { label: 'All time', value: 'all-time' },
] as const;

interface DateTimeRange {
  from: Date;
  to: Date;
}

interface DateTimeRangePickerProps {
  value?: DateTimeRange;
  onChange?: (range: DateTimeRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'error';
  className?: string;
  showQuickFilters?: boolean;
  showTimePicker?: boolean;
}

function getQuickFilterRange(filter: string): DateTimeRange | null {
  const now = new Date();

  switch (filter) {
    case 'today':
      return { from: startOfDay(now), to: endOfDay(now) };
    case 'yesterday':
      return { from: startOfDay(subDays(now, 1)), to: endOfDay(subDays(now, 1)) };
    case 'this-week':
      return {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case 'last-week':
      return {
        from: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
        to: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      };
    case 'this-month':
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case 'last-month':
      return { from: startOfMonth(subMonths(now, 1)), to: endOfMonth(subMonths(now, 1)) };
    case 'this-year':
      return { from: startOfYear(now), to: endOfYear(now) };
    case 'last-year':
      return { from: startOfYear(subYears(now, 1)), to: endOfYear(subYears(now, 1)) };
    case 'all-time':
      return { from: new Date(2000, 0, 1), to: endOfDay(now) };
    default:
      return null;
  }
}

function CalendarGrid({
  month,
  selectedRange,
  onDateClick,
  onDateHover,
}: {
  month: Date;
  selectedRange: DateTimeRange | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
}) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  const currentDate = startDate;

  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const isRangeStart = (date: Date) => {
    if (!selectedRange) return false;
    return startOfDay(date).getTime() === startOfDay(selectedRange.from).getTime();
  };

  const isRangeEnd = (date: Date) => {
    if (!selectedRange) return false;
    return startOfDay(date).getTime() === startOfDay(selectedRange.to).getTime();
  };

  const isInRange = (date: Date) => {
    if (!selectedRange) return false;
    const dateTime = startOfDay(date).getTime();
    const fromTime = startOfDay(selectedRange.from).getTime();
    const toTime = startOfDay(selectedRange.to).getTime();
    return dateTime > fromTime && dateTime < toTime;
  };

  const isOutsideMonth = (date: Date) => {
    return date.getMonth() !== month.getMonth();
  };

  return (
    <div className="flex flex-col gap-3 p-6">
      <div className="flex items-center justify-between w-[280px]">
        <p className="text-ait-body-lg-semibold text-ait-neutral-900">
          {format(month, 'MMMM yyyy')}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        {/* Weekday headers */}
        <div className="flex">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat', 'Su'].map((day) => (
            <div key={day} className="w-10 h-10 flex items-center justify-center">
              <p className="text-ait-body-md-semibold text-ait-neutral-900 text-sm">{day}</p>
            </div>
          ))}
        </div>
        {/* Date rows */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex">
            {week.map((date, dateIdx) => {
              const isStart = isRangeStart(date);
              const isEnd = isRangeEnd(date);
              const inRange = isInRange(date);
              const outside = isOutsideMonth(date);

              return (
                <div key={dateIdx} className="relative w-10 h-10">
                  {inRange && <div className="absolute inset-0 bg-[#c6eff8]" />}
                  <button
                    type="button"
                    onClick={() => onDateClick(date)}
                    onMouseEnter={() => onDateHover(date)}
                    onMouseLeave={() => onDateHover(null)}
                    className={cn(
                      'relative w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors',
                      outside && 'text-ait-neutral-400',
                      !outside &&
                        !isStart &&
                        !isEnd &&
                        !inRange &&
                        'text-ait-neutral-700 hover:bg-ait-neutral-100',
                      (isStart || isEnd) && 'bg-[#00487a] text-white hover:bg-[#00487a]',
                      inRange && 'text-[#00487a]'
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

function TimeInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={2}
      className="w-12 h-10 text-center border border-ait-neutral-300 rounded-lg text-ait-body-md-regular text-ait-neutral-900 focus:outline-none focus:ring-2 focus:ring-ait-primary-500 focus:border-transparent"
    />
  );
}

export function DateTimeRangePicker({
  value,
  onChange,
  placeholder = 'Select date time',
  disabled = false,
  variant = 'default',
  className,
  showQuickFilters = true,
  showTimePicker = true,
}: DateTimeRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateTimeRange | null>(value || null);
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(null);
  const [currentMonth1, setCurrentMonth1] = React.useState(new Date());
  const [currentMonth2, setCurrentMonth2] = React.useState(addMonths(new Date(), 1));
  const [selectingFrom, setSelectingFrom] = React.useState(true);

  // Time state
  const [fromHour, setFromHour] = React.useState('08');
  const [fromMinute, setFromMinute] = React.useState('00');
  const [toHour, setToHour] = React.useState('08');
  const [toMinute, setToMinute] = React.useState('00');

  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });

  React.useEffect(() => {
    setTempRange(value || null);
  }, [value]);

  React.useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideContainer = containerRef.current?.contains(target);
      const isClickInsideDropdown = dropdownRef.current?.contains(target);

      if (!isClickInsideContainer && !isClickInsideDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      updatePosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const handleQuickFilterClick = (filter: string) => {
    setSelectedFilter(filter);
    const range = getQuickFilterRange(filter);
    if (range) {
      setTempRange(range);
    }
  };

  const handleDateClick = (date: Date) => {
    if (selectingFrom) {
      setTempRange({ from: date, to: date });
      setSelectingFrom(false);
    } else {
      if (tempRange && date >= tempRange.from) {
        setTempRange({ ...tempRange, to: date });
      } else {
        setTempRange({ from: date, to: date });
      }
      setSelectingFrom(true);
    }
    setSelectedFilter(null);
  };

  const handleApply = () => {
    if (tempRange && showTimePicker) {
      const fromDate = new Date(tempRange.from);
      fromDate.setHours(parseInt(fromHour) || 0, parseInt(fromMinute) || 0);

      const toDate = new Date(tempRange.to);
      toDate.setHours(parseInt(toHour) || 0, parseInt(toMinute) || 0);

      onChange?.({ from: fromDate, to: toDate });
    } else if (tempRange) {
      onChange?.(tempRange);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(value || null);
    setIsOpen(false);
  };

  const formatRange = () => {
    if (!value) return placeholder;
    const fromStr = format(value.from, showTimePicker ? 'MMM d, yyyy, HH:mm' : 'MMM d, yyyy');
    const toStr = format(value.to, showTimePicker ? 'MMM d, yyyy, HH:mm' : 'MMM d, yyyy');
    return `${fromStr} – ${toStr}`;
  };

  const handlePrevMonth1 = () => {
    setCurrentMonth1(subtractMonths(currentMonth1, 1));
    setCurrentMonth2(subtractMonths(currentMonth2, 1));
  };

  const handleNextMonth2 = () => {
    setCurrentMonth1(addMonths(currentMonth1, 1));
    setCurrentMonth2(addMonths(currentMonth2, 1));
  };

  const dropdownContent = isOpen && !disabled && (
    <div
      ref={dropdownRef}
      data-portal="datepicker"
      className="fixed z-[100] rounded-lg border border-ait-neutral-200 bg-ait-white shadow-ait-lg flex flex-col max-h-[90vh] max-w-[95vw]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        minWidth: `${dropdownPosition.width}px`,
      }}
    >
      <div className="flex overflow-auto flex-1">
        {/* Quick filters sidebar */}
        {showQuickFilters && (
          <>
            <div className="flex flex-col gap-1 p-3 w-40">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => handleQuickFilterClick(filter.value)}
                  className={cn(
                    'px-4 py-2.5 rounded-md text-left text-ait-body-md-regular transition-colors',
                    selectedFilter === filter.value
                      ? 'bg-[#e3fafc] text-[#003768] font-medium'
                      : 'bg-white text-ait-neutral-900 hover:bg-ait-neutral-50'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="w-px bg-ait-neutral-200" />
          </>
        )}

        {/* Calendar section */}
        <div className="flex flex-col">
          <div className="flex overflow-auto">
            {/* Left calendar */}
            <div className="relative">
              <button
                type="button"
                onClick={handlePrevMonth1}
                className="absolute left-6 top-6 z-10 p-2.5 hover:bg-ait-neutral-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-ait-neutral-700" />
              </button>
              <CalendarGrid
                month={currentMonth1}
                selectedRange={tempRange}
                onDateClick={handleDateClick}
                onDateHover={() => {}}
              />
              {showTimePicker && (
                <div className="px-6 pb-6 flex items-center gap-2 justify-center">
                  <TimeInput value={fromHour} onChange={setFromHour} placeholder="08" />
                  <span className="text-ait-neutral-500">:</span>
                  <TimeInput value={fromMinute} onChange={setFromMinute} placeholder="00" />
                </div>
              )}
            </div>

            {/* Right calendar */}
            <div className="relative">
              <button
                type="button"
                onClick={handleNextMonth2}
                className="absolute right-6 top-6 z-10 p-2.5 hover:bg-ait-neutral-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-ait-neutral-700" />
              </button>
              <CalendarGrid
                month={currentMonth2}
                selectedRange={tempRange}
                onDateClick={handleDateClick}
                onDateHover={() => {}}
              />
              {showTimePicker && (
                <div className="px-6 pb-6 flex items-center gap-2 justify-center">
                  <TimeInput value={toHour} onChange={setToHour} placeholder="08" />
                  <span className="text-ait-neutral-500">:</span>
                  <TimeInput value={toMinute} onChange={setToMinute} placeholder="00" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Outside scrollable area */}
      <div className="border-t border-ait-neutral-200 px-6 py-4 bg-ait-white rounded-b-lg flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-ait-body-md-regular text-ait-neutral-700 flex-1 min-w-0 truncate">
            {tempRange && (
              <>
                {format(tempRange.from, showTimePicker ? 'MMM d, yyyy, HH:mm' : 'MMM d, yyyy')}
                {' – '}
                {format(tempRange.to, showTimePicker ? 'MMM d, yyyy, HH:mm' : 'MMM d, yyyy')}
              </>
            )}
          </p>
          <div className="flex gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 text-ait-body-md-semibold text-[#56b1d7] border border-[#56b1d7] rounded-lg hover:bg-[#e3fafc] transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!tempRange}
              className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-[#00487a] rounded-lg hover:bg-[#003768] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-lg border bg-ait-white px-4 py-2.5 text-ait-body-md-regular transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ait-primary-500 focus-within:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-left',
          variant === 'default' && 'border-ait-neutral-300 hover:border-ait-neutral-400',
          variant === 'error' && 'border-ait-danger-500 focus-within:ring-ait-danger-500'
        )}
      >
        <span className={cn(!value && 'text-ait-neutral-500')}>{formatRange()}</span>
        <CalendarIcon className="h-4 w-4 text-ait-neutral-500" />
      </button>

      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}

// Keep old components for backward compatibility
export function DatePicker({
  date,
  onDateChange,
  ...props
}: {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'error';
  className?: string;
}) {
  const handleChange = (range: DateTimeRange | undefined) => {
    onDateChange?.(range?.from);
  };

  return (
    <DateTimeRangePicker
      {...props}
      value={date ? { from: date, to: date } : undefined}
      onChange={handleChange}
      showQuickFilters={false}
      showTimePicker={false}
    />
  );
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  ...props
}: {
  dateRange?: { from?: Date; to?: Date };
  onDateRangeChange?: (dateRange: { from?: Date; to?: Date } | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'error';
  className?: string;
}) {
  const handleChange = (range: DateTimeRange | undefined) => {
    if (range) {
      onDateRangeChange?.({ from: range.from, to: range.to });
    } else {
      onDateRangeChange?.(undefined);
    }
  };

  const value =
    dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined;

  return (
    <DateTimeRangePicker
      {...props}
      value={value}
      onChange={handleChange}
      showQuickFilters={false}
      showTimePicker={false}
    />
  );
}

interface DatePickerFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function DatePickerField({
  label,
  error,
  helperText,
  required,
  children,
}: DatePickerFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-ait-body-md-bold text-ait-neutral-900">
          {label}
          {required && <span className="text-ait-danger-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {(error || helperText) && (
        <p
          className={cn(
            'text-ait-caption-md-regular',
            error ? 'text-ait-danger-500' : 'text-ait-neutral-500'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export type { DateTimeRange, DateTimeRangePickerProps, DatePickerFieldProps };
