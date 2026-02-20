import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const textareaVariants = cva(
  'w-full rounded-lg text-ait-body-md-regular text-ait-neutral-900 placeholder:text-ait-neutral-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none',
  {
    variants: {
      variant: {
        outlined: [
          'border bg-transparent',
          'border-ait-neutral-300',
          'hover:border-ait-neutral-400',
          'focus:border-ait-primary-500 focus:ring-2 focus:ring-ait-primary-500 focus:ring-offset-1',
        ],
        box: [
          'border-0 bg-ait-neutral-50',
          'hover:bg-ait-neutral-100',
          'focus:bg-white focus:ring-2 focus:ring-ait-primary-500 focus:ring-offset-1',
        ],
      },
      inputSize: {
        sm: 'px-3 py-2 text-sm min-h-[80px]',
        md: 'px-4 py-2.5 min-h-[100px]',
        lg: 'px-4 py-3 min-h-[120px]',
      },
      hasError: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'outlined',
        hasError: true,
        className: 'border-ait-danger-500 focus:border-ait-danger-500 focus:ring-ait-danger-500',
      },
      {
        variant: 'box',
        hasError: true,
        className: 'bg-ait-danger-50 focus:bg-ait-danger-50 focus:ring-ait-danger-500',
      },
    ],
    defaultVariants: {
      variant: 'outlined',
      inputSize: 'md',
      hasError: false,
    },
  }
);

export interface TextareaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  error?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoGrow?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      inputSize,
      error,
      resize = 'vertical',
      autoGrow = false,
      maxLength,
      showCount = false,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [charCount, setCharCount] = React.useState(0);

    // Combine refs
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // Auto-grow functionality
    React.useEffect(() => {
      if (autoGrow && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [autoGrow, props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);

      if (autoGrow && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }

      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          className={cn(
            textareaVariants({ variant, inputSize, hasError: error }),
            resize === 'none' && 'resize-none',
            resize === 'vertical' && 'resize-y',
            resize === 'horizontal' && 'resize-x',
            resize === 'both' && 'resize',
            className
          )}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        {showCount && maxLength && (
          <div className="absolute bottom-2 right-3 text-ait-caption-md-regular text-ait-neutral-500">
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface TextareaFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
}

export function TextareaField({
  label,
  error,
  helperText,
  required,
  children,
  orientation = 'vertical',
}: TextareaFieldProps) {
  if (orientation === 'horizontal') {
    return (
      <div className="flex gap-4 items-start">
        {label && (
          <label className="text-ait-body-md-bold text-ait-neutral-900 min-w-[120px] pt-2.5">
            {label}
            {required && <span className="text-ait-danger-500 ml-1">*</span>}
          </label>
        )}
        <div className="flex-1 space-y-2">
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
      </div>
    );
  }

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

export { Textarea, textareaVariants };
