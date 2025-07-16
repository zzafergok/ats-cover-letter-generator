// Navigation Components
export { PublicNavbar } from './PublicNavbar'
export { AuthNavbar } from './AuthNavbar'
export { PublicFooter } from './PublicFooter'
export { AuthFooter } from './AuthFooter'

// Type definitions for navigation components
export interface NavigationItem {
  name: string
  href: string
  current?: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  badge?: number
  description?: string
  external?: boolean
}

export interface DropdownSection {
  title: string
  items: NavigationItem[]
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
  type: 'info' | 'warning' | 'success' | 'error'
  action?: {
    label: string
    href: string
  }
}

export interface SocialLink {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  hoverColor: string
}

export interface FooterSection {
  title: string
  links: Array<{
    name: string
    href: string
    external?: boolean
    description?: string
  }>
}

// Navigation utilities
export const createNavigationItem = (
  name: string,
  href: string,
  options?: Partial<NavigationItem>,
): NavigationItem => ({
  name,
  href,
  ...options,
})

export const isActiveRoute = (pathname: string, href: string): boolean => {
  if (href === '/') {
    return pathname === '/'
  }
  return pathname.startsWith(href)
}

// Constants
export const NAVIGATION_HEIGHTS = {
  PUBLIC_NAVBAR: 'h-16 lg:h-20',
  AUTH_NAVBAR: 'h-16',
  FOOTER: 'auto',
} as const

export const NAVIGATION_Z_INDEX = {
  NAVBAR: 'z-50',
  DROPDOWN: 'z-50',
  MOBILE_MENU: 'z-40',
  OVERLAY: 'z-40',
} as const
