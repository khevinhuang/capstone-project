import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Building2, User } from 'lucide-react';
import { cn } from '@/lib/cn';

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-700 transition-colors hover:border-neutral-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-100',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-14 w-14 text-lg',
        '2xl': 'h-16 w-16 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const statusVariants = cva('absolute bottom-0 right-0 rounded-full ring-2 ring-white', {
  variants: {
    size: {
      xs: 'h-2 w-2',
      sm: 'h-2.5 w-2.5',
      md: 'h-3 w-3',
      lg: 'h-3.5 w-3.5',
      xl: 'h-4 w-4',
      '2xl': 'h-[18px] w-[18px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const fallbackIconSize: Record<NonNullable<VariantProps<typeof avatarVariants>['size']>, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-7 w-7',
  '2xl': 'h-8 w-8',
};

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt: string;
  fallbackText: string;
  placeholder?: boolean;
  status?: 'online' | 'company';
  imgClassName?: string;
}

export function Avatar({
  src,
  alt,
  fallbackText,
  size,
  placeholder = false,
  status,
  className,
  imgClassName,
  ...props
}: AvatarProps) {
  const resolvedSize = size ?? 'md';
  const initial = fallbackText.trim().charAt(0).toUpperCase() || '?';

  return (
    <div
      className={cn(avatarVariants({ size: resolvedSize }), className)}
      {...props}
      {...(!src ? { role: 'img', 'aria-label': alt } : {})}
    >
      {src ? (
        <img src={src} alt={alt} className={cn('h-full w-full object-cover', imgClassName)} />
      ) : placeholder ? (
        <User className={cn(fallbackIconSize[resolvedSize])} aria-hidden="true" />
      ) : (
        <span className="font-medium text-primary-700">{initial}</span>
      )}

      {status === 'online' && (
        <span
          className={cn(statusVariants({ size: resolvedSize }), 'bg-success-500')}
          aria-hidden="true"
        />
      )}

      {status === 'company' && (
        <span
          className={cn(
            statusVariants({ size: resolvedSize }),
            'flex items-center justify-center border border-neutral-200 bg-white text-primary-500'
          )}
          aria-hidden="true"
        >
          <Building2 className={cn('h-3 w-3', resolvedSize === '2xl' && 'h-3.5 w-3.5')} />
        </span>
      )}
    </div>
  );
}
