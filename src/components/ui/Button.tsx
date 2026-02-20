import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        secondary:
          'border border-primary-500 bg-white text-primary-500 hover:bg-primary-50 active:bg-primary-100',
        tertiary: 'bg-neutral-100 text-primary-500 hover:bg-neutral-200 active:bg-neutral-300',
        text: 'bg-transparent text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200',
        link: 'bg-transparent text-primary-500 hover:underline underline-offset-4',
        'destructive-primary':
          'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 focus-visible:ring-danger-500',
        'destructive-secondary':
          'border border-danger-500 bg-white text-danger-500 hover:bg-danger-25 active:bg-danger-50 focus-visible:ring-danger-500',
        'destructive-tertiary':
          'bg-danger-50 text-danger-500 hover:bg-danger-100 active:bg-danger-200 focus-visible:ring-danger-500',
        'destructive-text':
          'bg-transparent text-danger-500 hover:bg-danger-50 active:bg-danger-100 focus-visible:ring-danger-500',
        'destructive-link':
          'bg-transparent text-danger-500 hover:underline underline-offset-4 focus-visible:ring-danger-500',
        'elevated-primary':
          'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-lg',
        'elevated-secondary':
          'border border-primary-500 bg-white text-primary-500 hover:bg-primary-50 active:bg-primary-100 shadow-lg',
      },
      size: {
        xs: 'h-7 px-2 text-[10px] rounded-md',
        sm: 'h-8 px-3 text-xs rounded-md',
        md: 'h-10 px-4 text-sm rounded-lg',
        lg: 'h-12 px-6 text-base rounded-lg',
        xl: 'h-14 px-8 text-lg rounded-xl',
      },
      isIconOnly: {
        true: 'px-0 aspect-square',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      isIconOnly: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isIconOnly, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, isIconOnly, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
