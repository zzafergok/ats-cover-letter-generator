import { type CSSProperties } from 'react'

/**
 * Badge styling utility to ensure consistent styling across the project
 * This eliminates CSS conflicts by providing predefined style combinations
 */
export const getBadgeStyles = (options: {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'custom'
  color?: string
  backgroundColor?: string
  textColor?: string
  opacity?: string
}): CSSProperties => {
  const { variant = 'outline', color, backgroundColor, textColor } = options

  // For custom colors, always use full inline styling
  if (variant === 'custom' || color || backgroundColor || textColor) {
    return {
      backgroundColor: backgroundColor || (color ? color + '15' : 'transparent'),
      color: textColor || color || 'hsl(var(--foreground))',
      borderColor: color || 'hsl(var(--border))',
      borderWidth: '1px',
      borderStyle: 'solid',
    }
  }

  // Predefined variants using CSS variables for theme consistency
  const variants: Record<string, CSSProperties> = {
    default: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      borderWidth: '0',
    },
    secondary: {
      backgroundColor: 'hsl(var(--secondary))',
      color: 'hsl(var(--secondary-foreground))',
      borderWidth: '0',
    },
    destructive: {
      backgroundColor: 'hsl(var(--destructive))',
      color: 'hsl(var(--destructive-foreground))',
      borderWidth: '0',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground))',
      borderColor: 'hsl(var(--border))',
      borderWidth: '1px',
      borderStyle: 'solid',
    },
  }

  return variants[variant] || variants.outline
}

/**
 * Priority-based badge styling for consistent task priority display
 */
export const getPriorityBadgeProps = (priority: string) => {
  const priorityConfig: Record<string, { color: string; label: string }> = {
    LOW: { color: '#10b981', label: 'Düşük' },
    MEDIUM: { color: '#f59e0b', label: 'Orta' },
    HIGH: { color: '#f97316', label: 'Yüksek' },
    URGENT: { color: '#ef4444', label: 'Acil' },
  }

  const config = priorityConfig[priority.toUpperCase()] || priorityConfig.MEDIUM

  return {
    variant: 'custom' as const,
    color: config.color,
    children: config.label,
  }
}

/**
 * Status-based badge styling for consistent task status display
 */
export const getStatusBadgeProps = (status: string) => {
  const statusConfig: Record<string, { color: string; label: string }> = {
    TODO: { color: '#6b7280', label: 'Yapılacak' },
    IN_PROGRESS: { color: '#3b82f6', label: 'Devam Ediyor' },
    REVIEW: { color: '#f59e0b', label: 'İnceleme' },
    DONE: { color: '#10b981', label: 'Tamamlandı' },
  }

  const config = statusConfig[status.toUpperCase()] || statusConfig.TODO

  return {
    variant: 'custom' as const,
    color: config.color,
    children: config.label,
  }
}

/**
 * Tag-based badge styling for consistent tag display
 */
export const getTagBadgeProps = (tagColor: string, tagName: string) => {
  return {
    variant: 'custom' as const,
    color: tagColor,
    children: tagName,
  }
}
