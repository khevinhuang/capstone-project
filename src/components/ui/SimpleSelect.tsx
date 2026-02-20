import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';

export interface SimpleSelectOption {
  value: string;
  label: string;
}

export interface SimpleSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SimpleSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export const SimpleSelect = React.forwardRef<HTMLButtonElement, SimpleSelectProps>(
  ({ value, onChange, options, placeholder, disabled, className, variant, size }, ref) => {
    return (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger ref={ref} className={className} variant={variant} size={size}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SimpleSelect.displayName = 'SimpleSelect';
