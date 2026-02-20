import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: '',
      line: 'border-b border-ait-neutral-200',
      border: 'border border-ait-neutral-300 rounded-lg mb-2 overflow-hidden',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const accordionTriggerVariants = cva(
  'flex w-full items-center justify-between py-4 text-left transition-all hover:bg-ait-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
  {
    variants: {
      variant: {
        default: 'px-0',
        line: 'px-0',
        border: 'px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const accordionContentVariants = cva(
  'overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
  {
    variants: {
      variant: {
        default: 'px-0 pb-4',
        line: 'px-0 pb-4',
        border: 'px-6 pb-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface AccordionContextValue {
  variant?: 'default' | 'line' | 'border';
  flipIcon?: boolean;
}

const AccordionContext = React.createContext<AccordionContextValue>({});

type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  variant?: 'default' | 'line' | 'border';
  flipIcon?: boolean;
  className?: string;
};

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, variant = 'default', flipIcon = false, ...props }, ref) => (
  <AccordionContext.Provider value={{ variant, flipIcon }}>
    <AccordionPrimitive.Root ref={ref} className={cn('w-full', className)} {...props} />
  </AccordionContext.Provider>
));
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    />
  );
});
AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> {
  icon?: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, icon, ...props }, ref) => {
  const { variant, flipIcon } = React.useContext(AccordionContext);

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(accordionTriggerVariants({ variant }), className)}
        {...props}
      >
        {flipIcon ? (
          <>
            <ChevronDown className="h-5 w-5 shrink-0 text-ait-neutral-600 transition-transform duration-200" />
            <div className="flex flex-1 items-center gap-3 ml-3">
              {icon && (
                <div className="flex h-6 w-6 items-center justify-center text-ait-primary-500">
                  {icon}
                </div>
              )}
              <span className="text-ait-body-lg-semibold text-ait-neutral-900">{children}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-1 items-center gap-3">
              {icon && (
                <div className="flex h-6 w-6 items-center justify-center text-ait-primary-500">
                  {icon}
                </div>
              )}
              <span className="text-ait-body-lg-semibold text-ait-neutral-900">{children}</span>
            </div>
            <ChevronDown className="h-5 w-5 shrink-0 text-ait-neutral-600 transition-transform duration-200" />
          </>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { variant } = React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(accordionContentVariants({ variant }), className)}
      {...props}
    >
      <div className="text-ait-body-md-regular text-ait-neutral-700">{children}</div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export type { AccordionProps };
