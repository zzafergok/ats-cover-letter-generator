import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('rounded-lg border text-card-foreground shadow-sm transition-all duration-200', {
  variants: {
    variant: {
      default: ['bg-white border-neutral-200', 'dark:bg-neutral-900 dark:border-neutral-700'].join(' '),
      muted: ['bg-neutral-50 border-neutral-200', 'dark:bg-neutral-800 dark:border-neutral-700'].join(' '),
      outline: ['border-2 border-neutral-200 bg-transparent', 'dark:border-neutral-700'].join(' '),
    },
    size: {
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8',
    },
    hover: {
      none: '',
      lift: 'hover:shadow-lg hover:-translate-y-1',
      glow: 'hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    hover: 'none',
  },
})

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, size, hover, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ variant, size, hover, className }))} {...props} />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight text-neutral-900 dark:text-neutral-100',
        className,
      )}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-neutral-600 dark:text-neutral-400', className)} {...props} />
  ),
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />,
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0 border-t border-neutral-200 dark:border-neutral-700', className)}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
