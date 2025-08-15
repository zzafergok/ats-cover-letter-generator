import { twMerge } from 'tailwind-merge'
import { type ClassValue, clsx } from 'clsx'

/**
 * Combines class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, ms = 300): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

/**
 * Checks if the client is in dark mode
 */
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  return (
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
}

/**
 * Gets a nested object property by a dot-notation path
 */
export function get(obj: any, path: string, defaultValue: any = undefined) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
  const result = travel(/[,[\]]+?/) || travel(/[,.[\]]+?/)
  return result === undefined || result === obj ? defaultValue : result
}

/**
 * Sanitizes HTML to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Formats a date for display
 */
export function formatDate(date: Date | string, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formats a number with thousands separator for Turkish locale
 * @param value - The number value to format
 * @returns Formatted string with dots as thousands separator
 */
export function formatNumberInput(value: string): string {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '')

  // Convert to number and back to remove leading zeros
  const number = parseFloat(numericValue)

  // If it's not a valid number, return empty string
  if (isNaN(number)) return ''

  // Format with Turkish locale (uses dots for thousands separator)
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(number)
}

/**
 * Removes formatting from a formatted number string to get raw numeric value
 * @param formattedValue - The formatted string (e.g., "40.000")
 * @returns Raw numeric string (e.g., "40000")
 */
export function parseFormattedNumber(formattedValue: string): string {
  return formattedValue.replace(/\./g, '')
}

/**
 * Type-safe LocalStorage access
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch (error) {
      console.error('Error getting item from localStorage', error)
      return defaultValue
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error setting item in localStorage', error)
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing item from localStorage', error)
    }
  },
}
