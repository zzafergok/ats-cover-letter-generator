import { cva } from 'class-variance-authority'

export const toggleButtonStyles = cva(
  [
    'relative rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2',
    'bg-white dark:bg-neutral-800 transition-colors duration-300',
    'border border-neutral-200 dark:border-neutral-700',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 w-auto min-w-20',
        md: 'h-10 w-auto min-w-24',
        lg: 'h-12 w-auto min-w-28',
      },
      isActive: {
        true: 'border-primary-300 dark:border-primary-700 shadow-sm',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      isActive: false,
    },
  },
)

export const dropdownStyles = cva(
  [
    'absolute mt-1 rounded-md shadow-lg',
    'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
    'py-1 z-50 min-w-full',
    // Hizalama için kritik stiller
    'origin-top-left transform-gpu',
  ],
  {
    variants: {
      align: {
        left: 'left-0 right-auto',
        right: 'right-0 left-auto',
        center: 'left-1/2 -translate-x-1/2',
      },
      width: {
        auto: 'w-auto',
        full: 'w-full',
        trigger: 'w-[var(--trigger-width)]',
      },
    },
    defaultVariants: {
      align: 'left',
      width: 'trigger',
    },
  },
)

export const menuItemStyles = cva(
  [
    'w-full flex items-center px-3 py-2 text-sm transition-colors',
    'hover:bg-neutral-50 dark:hover:bg-neutral-700',
    'focus:bg-neutral-50 dark:focus:bg-neutral-700 focus:outline-none',
  ],
  {
    variants: {
      isActive: {
        true: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
        false: 'text-neutral-900 dark:text-neutral-100',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
)

export const iconContainerStyles = 'flex-shrink-0 flex items-center justify-center w-6 h-6 mr-2'

// Yeni positioning utilities
export const dropdownContainerStyles = cva(['relative inline-block'], {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-auto',
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
})
