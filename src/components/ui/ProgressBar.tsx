import { forwardRef, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const progressBarVariants = cva('relative h-2 w-full overflow-hidden rounded-full bg-neutral-200', {
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const progressFillVariants = cva(
  'absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out',
  {
    variants: {
      color: {
        primary: 'bg-primary-500',
        info: 'bg-info-500',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        danger: 'bg-danger-500',
      },
    },
    defaultVariants: {
      color: 'primary',
    },
  }
);

export interface ProgressBarProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof progressBarVariants>,
    VariantProps<typeof progressFillVariants> {
  value?: number;
  max?: number;
  showAnimation?: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, size, color, value = 0, max = 100, showAnimation = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn(progressBarVariants({ size, className }))} {...props}>
        <div
          className={cn(progressFillVariants({ color }), !showAnimation && 'transition-none')}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

// ProgressBarLabel component with title, percentage, and optional description
export interface ProgressBarLabelProps extends ProgressBarProps {
  label?: string;
  showPercentage?: boolean;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export const ProgressBarLabel = forwardRef<HTMLDivElement, ProgressBarLabelProps>(
  (
    {
      className,
      size,
      color,
      value = 0,
      max = 100,
      showAnimation = true,
      label,
      showPercentage = true,
      description,
      ctaText,
      ctaHref,
      onCtaClick,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayPercentage = Math.round(percentage);

    const handleCtaClick = (e: React.MouseEvent) => {
      if (onCtaClick) {
        e.preventDefault();
        onCtaClick();
      }
    };

    return (
      <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
        {/* Title & Percentage Row */}
        {(label || showPercentage) && (
          <div className="flex items-start gap-2">
            {label && (
              <span className="flex-1 text-sm font-medium leading-5 text-neutral-900">{label}</span>
            )}
            {showPercentage && (
              <span className="text-xs font-normal leading-4 text-neutral-500">
                {displayPercentage}%
              </span>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <ProgressBar
          size={size}
          color={color}
          value={value}
          max={max}
          showAnimation={showAnimation}
        />

        {/* Description Row */}
        {(ctaText || description) && (
          <div className="flex items-start gap-2">
            {ctaText && (
              <a
                href={ctaHref || '#'}
                onClick={handleCtaClick}
                className="text-xs font-medium leading-4 text-primary-400 underline underline-offset-2 hover:text-primary-500 transition-colors"
              >
                {ctaText}
              </a>
            )}
            {description && (
              <span className="flex-1 text-xs font-normal leading-4 text-neutral-500">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

ProgressBarLabel.displayName = 'ProgressBarLabel';
