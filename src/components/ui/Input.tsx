import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const fieldRootVariants = cva('w-full', {
  variants: {
    orientation: {
      vertical: 'flex flex-col gap-1.5',
      horizontal: 'flex items-start gap-4',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

const labelVariants = cva('text-sm font-medium text-neutral-700', {
  variants: {
    disabled: {
      true: 'text-neutral-400',
      false: '',
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

const messageVariants = cva('text-sm', {
  variants: {
    tone: {
      hint: 'text-neutral-500',
      error: 'text-danger-500',
    },
    disabled: {
      true: 'text-neutral-400',
      false: '',
    },
  },
  defaultVariants: {
    tone: 'hint',
    disabled: false,
  },
});

const fieldBaseVariants = cva(
  'flex w-full items-center gap-2 border transition-colors outline-none',
  {
    variants: {
      variant: {
        box: 'h-12 rounded-lg bg-white px-4 py-3',
        underline: 'h-12 rounded-none bg-white px-0 py-3 border-x-0 border-t-0',
        offset: 'h-12 rounded-lg bg-white px-4 py-3 shadow-sm',
      },
      state: {
        default: 'border-neutral-300',
        disabled: 'border-neutral-300 bg-neutral-50',
        error: 'border-danger-400',
      },
    },
    compoundVariants: [
      {
        variant: 'underline',
        state: 'default',
        className: 'border-b border-neutral-300',
      },
      {
        variant: 'underline',
        state: 'disabled',
        className: 'border-b border-neutral-300',
      },
      {
        variant: 'underline',
        state: 'error',
        className: 'border-b border-danger-400',
      },

      {
        variant: 'box',
        state: 'default',
        className:
          'focus-within:border-primary-200 focus-within:ring-4 focus-within:ring-primary-100',
      },
      {
        variant: 'underline',
        state: 'default',
        className:
          'focus-within:border-primary-200 focus-within:ring-4 focus-within:ring-primary-100',
      },
      {
        variant: 'offset',
        state: 'default',
        className:
          'focus-within:border-primary-200 focus-within:ring-4 focus-within:ring-primary-100',
      },

      {
        variant: 'box',
        state: 'error',
        className:
          'focus-within:border-danger-400 focus-within:ring-4 focus-within:ring-danger-100',
      },
      {
        variant: 'underline',
        state: 'error',
        className:
          'focus-within:border-danger-400 focus-within:ring-4 focus-within:ring-danger-100',
      },
      {
        variant: 'offset',
        state: 'error',
        className:
          'focus-within:border-danger-400 focus-within:ring-4 focus-within:ring-danger-100',
      },
    ],
    defaultVariants: {
      variant: 'box',
      state: 'default',
    },
  }
);

const inputVariants = cva(
  'min-w-0 flex-1 bg-transparent text-base text-neutral-700 outline-none placeholder:text-neutral-400 disabled:text-neutral-400 disabled:placeholder:text-neutral-400',
  {
    variants: {
      variant: {
        box: '',
        underline: 'px-0',
        offset: '',
      },
    },
    defaultVariants: {
      variant: 'box',
    },
  }
);

const iconWrapperVariants = cva(
  'flex items-center justify-center text-neutral-400 [&_svg]:h-4 [&_svg]:w-4',
  {
    variants: {
      disabled: {
        true: 'text-neutral-400',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof fieldBaseVariants>, 'state'>,
    VariantProps<typeof fieldRootVariants> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  messageClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      inputClassName,
      labelClassName,
      messageClassName,
      orientation,
      variant,
      label,
      hint,
      error,
      leading,
      trailing,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? reactId;

    const message = error ?? hint;
    const messageTone = error ? 'error' : 'hint';
    const messageId = message ? `${inputId}-message` : undefined;
    const describedBy = messageId; // Simplified - no useMemo needed

    const state = disabled ? 'disabled' : error ? 'error' : 'default';

    const requiredIndicator = required ? (
      <span className="ml-0.5 text-danger-500" aria-hidden="true">
        *
      </span>
    ) : null;

    return (
      <div className={cn(fieldRootVariants({ orientation }), className)}>
        {label ? (
          <label htmlFor={inputId} className={cn(labelVariants({ disabled }), labelClassName)}>
            {label}
            {requiredIndicator}
          </label>
        ) : null}

        <div className={cn(orientation === 'horizontal' ? 'flex-1' : undefined)}>
          <div className={cn(fieldBaseVariants({ variant, state }), containerClassName)}>
            {leading ? (
              <span className={cn(iconWrapperVariants({ disabled }))}>{leading}</span>
            ) : null}

            <input
              {...props}
              id={inputId}
              ref={ref}
              disabled={disabled}
              required={required}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              className={cn(inputVariants({ variant }), inputClassName)}
            />

            {trailing ? (
              <span className={cn(iconWrapperVariants({ disabled }))}>{trailing}</span>
            ) : null}
          </div>

          {message ? (
            <p
              id={messageId}
              className={cn(
                messageVariants({ tone: messageTone, disabled }),
                'mt-1',
                messageClassName
              )}
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
