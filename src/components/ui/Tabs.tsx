import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const tabsListVariants = cva(
  'inline-flex items-center justify-start border-b border-ait-neutral-200',
  {
    variants: {
      variant: {
        default: 'gap-0',
        pills: 'gap-2 border-0 bg-ait-neutral-100 p-1 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-ait-body-md-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ait-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: [
          'px-4 py-2.5 -mb-px border-b-2 border-transparent',
          'text-ait-neutral-600 hover:text-ait-neutral-900',
          'data-[state=active]:border-ait-primary-500 data-[state=active]:text-ait-primary-600 data-[state=active]:font-semibold',
        ],
        pills: [
          'px-4 py-2 rounded-md',
          'text-ait-neutral-600 hover:text-ait-neutral-900',
          'data-[state=active]:bg-white data-[state=active]:text-ait-primary-600 data-[state=active]:shadow-sm',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Tabs = TabsPrimitive.Root;

interface TabsListProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
);
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ait-primary-500 focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
