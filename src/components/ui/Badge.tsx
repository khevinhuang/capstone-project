import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { Users, Circle } from 'lucide-react';

const SIZES = {
  badge: {
    sm: { padding: 'px-1.5 py-0.5', text: 'text-xs' },
    md: { padding: 'px-2 py-1', text: 'text-sm' },
    lg: { padding: 'px-2.5 py-1.5', text: 'text-base' },
  },
  dot: {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  },
  avatar: {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  },
  flag: {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
  },
  counter: {
    sm: 'h-5 min-w-[1.25rem] px-1 text-xs',
    md: 'h-6 min-w-[1.5rem] px-1.5 text-sm',
    lg: 'h-7 min-w-[1.75rem] px-2 text-base',
  },
  counterOnly: {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  },
  iconOnly: {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  },
} as const;

const GAPS = {
  dot: { sm: 'gap-1.5', md: 'gap-2', lg: 'gap-2.5' },
  flag: { sm: 'gap-1', md: 'gap-1.5', lg: 'gap-2' },
  counter: { sm: 'gap-1', md: 'gap-1.5', lg: 'gap-2' },
} as const;

const PADDINGS = {
  flag: {
    sm: 'pl-1 pr-2 py-0.5',
    md: 'pl-1.5 pr-2.5 py-1',
    lg: 'pl-2 pr-3 py-1.5',
  },
  counter: {
    sm: 'pl-2 pr-1 py-0.5',
    md: 'pl-3 pr-1.5 py-1',
    lg: 'pl-4 pr-2 py-1.5',
  },
} as const;

const COUNTER_BUBBLE_COLORS = {
  default: 'bg-neutral-700 text-white',
  primary: 'bg-primary-700 text-white',
  secondary: 'bg-secondary-700 text-white',
  success: 'bg-success-700 text-white',
  warning: 'bg-warning-700 text-white',
  error: 'bg-danger-700 text-white',
  info: 'bg-info-700 text-white',
} as const;

const DEFAULT_SIZES = {
  dot: 'sm' as const,
  avatar: 'sm' as const,
  flag: 'sm' as const,
  counter: 'md' as const,
  counterOnly: 'md' as const,
  iconOnly: 'md' as const,
} as const;

const generateCompoundVariants = () => {
  const variants: Array<{
    type?: 'dot' | 'avatar' | 'flag' | 'counter' | 'counterOnly' | 'iconOnly';
    size?: 'sm' | 'md' | 'lg';
    className: string;
  }> = [];

  Object.entries(GAPS.dot).forEach(([size, gap]) => {
    variants.push({ type: 'dot', size: size as 'sm' | 'md' | 'lg', className: gap });
  });

  variants.push({ type: 'avatar', className: 'gap-2' });

  Object.entries(PADDINGS.flag).forEach(([size, padding]) => {
    variants.push({
      type: 'flag',
      size: size as 'sm' | 'md' | 'lg',
      className: `${padding} ${GAPS.flag[size as keyof typeof GAPS.flag]}`,
    });
  });

  Object.entries(PADDINGS.counter).forEach(([size, padding]) => {
    variants.push({
      type: 'counter',
      size: size as 'sm' | 'md' | 'lg',
      className: `${padding} ${GAPS.counter[size as keyof typeof GAPS.counter]}`,
    });
  });

  Object.entries(SIZES.counterOnly).forEach(([size, classes]) => {
    variants.push({
      type: 'counterOnly',
      size: size as 'sm' | 'md' | 'lg',
      className: `gap-0 p-0 ${classes} aspect-square justify-center leading-none`,
    });
  });

  Object.entries(SIZES.iconOnly).forEach(([size, classes]) => {
    variants.push({
      type: 'iconOnly',
      size: size as 'sm' | 'md' | 'lg',
      className: `gap-0 p-0 ${classes} aspect-square justify-center`,
    });
  });

  return variants;
};

const badgeVariants = cva(
  'inline-flex items-center gap-2 font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-neutral-50 text-neutral-600 border border-neutral-50',
        primary: 'bg-primary-50 text-primary-600 border border-primary-50',
        secondary: 'bg-secondary-50 text-secondary-600 border border-secondary-50',
        success: 'bg-success-50 text-success-600 border border-success-50',
        warning: 'bg-warning-50 text-warning-600 border border-warning-50',
        error: 'bg-danger-50 text-danger-600 border border-danger-50',
        info: 'bg-info-50 text-info-600 border border-info-50',
      },
      type: {
        default: '',
        dot: '',
        avatar: '',
        flag: '',
        counter: '',
        counterOnly: '',
        iconOnly: '',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-1 text-sm',
        lg: 'px-2.5 py-1.5 text-base',
      },
    },
    compoundVariants: generateCompoundVariants(),
    defaultVariants: {
      variant: 'default',
      type: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  label?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  dotColor?: string;
  flagSrc?: string;
  flagAlt?: string;
  flagEmoji?: string;
  counter?: number;
  maxCounter?: number;
  icon?: ReactNode;
}

const validateBadgeProps = (props: BadgeProps) => {
  const errors: string[] = [];

  switch (props.type) {
    case 'avatar':
      if (!props.avatarSrc) errors.push('avatarSrc is required when type="avatar"');
      break;
    case 'flag':
      if (!props.flagSrc && !props.flagEmoji)
        errors.push('flagSrc or flagEmoji is required when type="flag"');
      break;
    case 'counter':
    case 'counterOnly':
      if (props.counter === undefined)
        errors.push('counter is required when type="counter" or type="counterOnly"');
      break;
    case 'iconOnly':
      if (!props.icon) errors.push('icon is required when type="iconOnly"');
      break;
  }

  if (errors.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('Badge component validation errors:', errors);
  }
};

const DotIndicator = ({
  color = 'currentColor',
  size = 'sm',
}: {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}) => (
  <Circle
    className={cn('rounded-full shrink-0', SIZES.dot[size])}
    style={{ color }}
    fill="currentColor"
  />
);

const AvatarIndicator = ({
  src,
  alt = 'Avatar',
  size = 'sm',
}: {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const iconSize = size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <div
      className={cn(
        'rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden',
        SIZES.avatar[size]
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <Users className={cn('text-neutral-600 hidden', iconSize)} />
    </div>
  );
};

const FlagIndicator = ({
  size = 'sm',
  src,
  alt = 'Flag',
  emoji,
}: {
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  alt?: string;
  emoji?: string;
}) => (
  <div
    className={cn(
      'shrink-0 rounded-full overflow-hidden flex items-center justify-center',
      SIZES.flag[size]
    )}
  >
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : emoji ? (
      <span className="w-full h-full flex items-center justify-center text-sm leading-none">
        {emoji}
      </span>
    ) : null}
  </div>
);

const CounterIndicator = ({
  count,
  max = 99,
  size = 'md',
  variant = 'default',
}: {
  count: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: NonNullable<BadgeProps['variant']>;
}) => {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold shrink-0 leading-none',
        COUNTER_BUBBLE_COLORS[variant],
        SIZES.counter[size]
      )}
    >
      {displayCount}
    </span>
  );
};

const CounterOnlyIndicator = ({
  count,
  max = 99,
  size = 'md',
}: {
  count: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const displayCount = count > max ? `${max}+` : count;

  const textClasses = {
    sm: 'text-xs font-semibold',
    md: 'text-sm font-semibold',
    lg: 'text-base font-semibold',
  };

  return <span className={cn(textClasses[size])}>{displayCount}</span>;
};

const IconOnlyIndicator = ({
  icon,
  size = 'md',
}: {
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const iconSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span className={cn('flex items-center justify-center shrink-0', iconSize[size])}>{icon}</span>
  );
};

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      type,
      size,
      label,
      children,
      avatarSrc,
      avatarAlt,
      dotColor,
      flagSrc,
      flagAlt,
      flagEmoji,
      counter,
      maxCounter,
      icon,
      ...props
    },
    ref
  ) => {
    validateBadgeProps({ type, avatarSrc, flagSrc, flagEmoji, counter, icon });

    const displayLabel = label || children;
    const effectiveType = type === 'flag' && !flagSrc && !flagEmoji ? 'default' : type;
    const showLabel = Boolean(displayLabel) && type !== 'iconOnly' && type !== 'counterOnly';

    const renderIndicator = () => {
      const effectiveSize = size || DEFAULT_SIZES[type as keyof typeof DEFAULT_SIZES] || 'md';

      switch (type) {
        case 'dot':
          return <DotIndicator color={dotColor} size={effectiveSize} />;
        case 'avatar':
          return <AvatarIndicator src={avatarSrc} alt={avatarAlt} size={effectiveSize} />;
        case 'flag':
          return (
            <FlagIndicator size={effectiveSize} src={flagSrc} alt={flagAlt} emoji={flagEmoji} />
          );
        case 'counter':
          return counter !== undefined ? (
            <CounterIndicator
              count={counter}
              max={maxCounter}
              size={effectiveSize}
              variant={variant || 'default'}
            />
          ) : null;
        case 'counterOnly':
          return counter !== undefined ? (
            <CounterOnlyIndicator count={counter} max={maxCounter} size={effectiveSize} />
          ) : null;
        case 'iconOnly':
          return <IconOnlyIndicator icon={icon} size={effectiveSize} />;
        default:
          return null;
      }
    };

    const indicator = renderIndicator();

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, type: effectiveType, size }), className)}
        {...props}
      >
        {type === 'counter' && showLabel ? (
          <>
            <span>{displayLabel}</span>
            {indicator}
          </>
        ) : (
          <>
            {indicator}
            {showLabel && <span>{displayLabel}</span>}
          </>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
