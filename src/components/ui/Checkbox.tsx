import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

type CheckboxState = boolean | 'indeterminate';

const checkboxBoxVariants = cva(
  'inline-flex shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
      },
      shape: {
        square: 'rounded',
        circle: 'rounded-full',
      },
    },
    defaultVariants: {
      size: 'sm',
      shape: 'square',
    },
  }
);

const labelTextVariants = cva('text-neutral-700', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

const hintTextVariants = cva('text-neutral-500', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export interface CheckboxProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'checked' | 'defaultChecked'>,
    Omit<VariantProps<typeof checkboxBoxVariants>, 'variant'> {
  label?: ReactNode;
  hint?: ReactNode;
  boxClassName?: string;
  variant?: 'solid' | 'outline';
  checked?: CheckboxState;
  defaultChecked?: CheckboxState;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      size,
      shape,
      variant,
      label,
      hint,
      boxClassName,
      checked,
      defaultChecked,
      disabled,
      id,
      onChange,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const mergedRef = useRef<HTMLInputElement | null>(null);

    const isControlled = checked !== undefined;
    const [uncontrolledState, setUncontrolledState] = useState<CheckboxState>(
      () => defaultChecked ?? false
    );

    const state = isControlled ? checked : uncontrolledState;
    const showCheck = state === true;
    const showIndeterminate = state === 'indeterminate';
    const isSelected = showCheck || showIndeterminate;
    const inputChecked = state === true;

    useEffect(() => {
      const node = mergedRef.current;
      if (!node) return;
      node.indeterminate = showIndeterminate;
    }, [showIndeterminate]);

    const boxClasses = useMemo(
      () =>
        cn(
          checkboxBoxVariants({ size, shape }),
          disabled
            ? isSelected
              ? 'bg-neutral-300 border-neutral-300'
              : 'bg-neutral-100 border-neutral-300'
            : isSelected
              ? variant === 'outline'
                ? 'bg-white border-primary-500 text-primary-500 group-hover:border-primary-600'
                : 'bg-primary-500 border-primary-500 text-white group-hover:bg-primary-600 group-hover:border-primary-600'
              : 'bg-white border-neutral-300 group-hover:border-neutral-400',
          boxClassName
        ),
      [size, shape, variant, disabled, isSelected, boxClassName]
    );

    const iconClasses = useMemo(
      () =>
        cn(
          size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5',
          disabled && variant === 'outline' && isSelected ? 'text-neutral-500' : undefined
        ),
      [size, disabled, variant, isSelected]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (mergedRef.current) mergedRef.current.indeterminate = false;
        onChange?.(e);
        onCheckedChange?.(e.currentTarget.checked);

        if (!isControlled) {
          setUncontrolledState(e.currentTarget.checked);
        }
      },
      [onChange, onCheckedChange, isControlled]
    );

    return (
      <label
        className={cn(
          'group inline-flex max-w-full items-start gap-2',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          className
        )}
      >
        <input
          {...props}
          id={inputId}
          ref={(node) => {
            mergedRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          type="checkbox"
          className="peer sr-only"
          disabled={disabled}
          checked={inputChecked}
          aria-checked={showIndeterminate ? 'mixed' : undefined}
          aria-describedby={hintId}
          onChange={handleChange}
        />

        <span aria-hidden="true" className={boxClasses}>
          {showIndeterminate ? <Minus className={iconClasses} /> : null}
          {showCheck ? <Check className={iconClasses} /> : null}
        </span>

        {(label || hint) && (
          <span className="flex min-w-0 flex-col">
            {label ? (
              <span
                className={cn(
                  labelTextVariants({ size }),
                  isSelected ? 'font-medium' : 'font-normal',
                  disabled ? 'text-neutral-400' : undefined
                )}
              >
                {label}
              </span>
            ) : null}
            {hint ? (
              <span
                id={hintId}
                className={cn(
                  hintTextVariants({ size }),
                  disabled ? 'text-neutral-400' : undefined
                )}
              >
                {hint}
              </span>
            ) : null}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
