// Core UI Components
export { Button, buttonVariants } from './components/core/Button/Button'
export { Input } from './components/core/Input/Input'
export { Textarea } from './components/core/Textarea/Textarea'
export { Checkbox } from './components/core/Checkbox/Checkbox'
export { Switch } from './components/core/Switch/Switch'
export { Label } from './components/core/Label/Label'

// Select Components
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './components/core/Select/Select'

// Dialog Components
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/core/Dialog/Dialog'

// Tabs Components
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/core/Tabs/Tabs'

// Card Components
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/core/Card/Card'

// Alert Dialog Components
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './components/core/AlertDialog/AlertDialog'

// Avatar Components
export { Avatar, AvatarFallback, AvatarImage } from './components/core/Avatar/Avatar'

// Dropdown Menu Components
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './components/core/Dropdown/Dropdown'

// Loading Components
export { LoadingSpinner, LoadingDots, LoadingPulse } from './components/core/Loading/LoadingSpinner'

export type { BadgeProps } from './components/core/Badge/Badge'
export { Badge, badgeVariants } from './components/core/Badge/Badge'

// Skeleton Components
export { Skeleton, SkeletonAvatar, SkeletonText } from './components/core/Skeleton/Skeleton'

// Toast Components
export { Toast } from './components/core/Toast/Toast'

// Tooltip Components
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/core/Tooltip/Tooltip'

// Popover Components
export { Popover, PopoverContent, PopoverTrigger } from './components/core/Popover/Popover'

// Command Components
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './components/core/CommandMenu/CommandMenu'

// Accordion Components
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/core/Accordion/Accordion'

// Separator Component
export { Separator } from './components/core/Separator/Seperator'

// Slider Component
export { Slider } from './components/core/Slider/Slider'

// Form Components
export { Form } from './components/form/Form'

// UI Components
export { ThemeToggle } from './components/ui/ThemeToggle/ThemeToggle'

export { LanguageToggle } from './components/ui/LanguageToggle/LanguageToggle'

export { ToastContainer } from './components/ui/ToastContainer/ToastContainer'

export { ComponentDemo } from './components/ui/ComponentDemo/ComponentDemo'

export { EnhancedErrorBoundary } from './components/ui/ErrorBoundary/EnhancedErrorBoundary'

export { DataTable } from './components/core/DataTable/DataTable'

export { FileUpload } from './components/ui/FileUpload/FileUpload'

export { PageHeader } from './components/ui/PageHeader/PageHeader'

// Form Components
export { LoginForm } from './components/forms/auth/LoginForm'

// Custom Hooks
export { useAuth } from './hooks/useAuth'

export { useForm } from './hooks/useForm'

export { useTheme } from './hooks/useTheme'

export { useLocale } from './hooks/useLocale'

export { useLocalStorage } from './hooks/useLocalStorage'

export { useTokenManager, type UseTokenManagerReturn } from './hooks/useTokenManager'

// Utilities
export { cn, debounce, isDarkMode, get, storage, formatDate, sanitizeHtml } from './lib/utils'

// Validation Schemas
export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  checkPasswordStrength,
  validateLoginData,
  PasswordStrength,
} from './lib/validations/auth'

// Types
export type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from './lib/validations/auth'

export type {
  BaseComponentProps,
  FormFieldProps,
  ButtonProps,
  InputProps,
  SelectProps,
  SelectOption,
  ThemeMode,
  ThemeState,
  ApiResponse,
  ApiError,
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  LoadingState,
  Optional,
  RequiredFields,
  DeepPartial,
  NonEmptyArray,
  ValueOf,
} from './types'

// Store Types
export type { RootState, AppDispatch } from './store'

export type {
  LangState,
  ThemeState as StoreThemeState,
  UserState,
  Toast as StoreToast,
  ToastState,
  LoadingState as StoreLoadingState,
  LoadingItem,
} from './store/types'

// Store Hooks
export { useAppDispatch, useAppSelector } from './store'

// Store Actions
export { setLanguage, selectCurrentLanguage, selectAvailableLanguages } from './store/slices/langSlice'

export {
  setTheme as setStoreTheme,
  updateSystemPreference,
  selectTheme,
  selectEffectiveTheme,
} from './store/slices/themeSlice'

export {
  setUser,
  logoutUser,
  setLoading,
  setError,
  selectUser,
  selectIsAuthenticated,
  selectError,
} from './store/slices/userSlice'

export {
  showToast,
  removeToast,
  clearAllToasts,
  updateToast,
  showTemporaryToast,
  selectToasts,
  selectToastById,
  selectToastsByType,
  selectToastCount,
} from './store/slices/toastSlice'

export {
  startLoading,
  stopLoading,
  updateLoading,
  clearAllLoading,
  setGlobalLoading,
  setPageLoading,
  selectLoadingItems,
  selectGlobalLoading,
  selectPageLoading,
  selectIsLoading,
  selectLoadingProgress,
  selectLoadingMessage,
  selectLoadingByType,
  selectLongestRunningLoading,
  selectAnyLoading,
  withLoading,
} from './store/slices/loadingSlice'

// API Services
export { apiService, apiInstance, createApiInstance, axiosBaseQuery } from './services/apiService'

export {
  tokenManagerService,
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
  isTokenExpired,
  updateLastActivity,
  isSessionExpired,
  refreshAccessToken,
  getTokenInfo,
} from './services/authService'

export {
  apiSlice,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useDeleteUserMutation,
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useHealthCheckQuery,
  useGetApiInfoQuery,
  useLazyGetCurrentUserQuery,
  useLazyGetPostsQuery,
  usePrefetch,
} from './services/apiSlice'

// API Constants
export { API_ENDPOINTS, HTTP_STATUS, ERROR_CODES, REQUEST_TIMEOUT, CACHE_DURATIONS } from './services/constants'

// API Types
export type {
  ApiResponse as ServiceApiResponse,
  ApiError as ServiceApiError,
  RefreshTokenResponse,
  RequestConfig,
} from './services/utils'

export type {
  LoginCredentials as ApiLoginCredentials,
  ApiUser,
  AuthResponse as ApiAuthResponse,
} from './services/apiSlice'

// Providers
export { ClientProviders } from './providers/ClientProviders'

export { AuthProvider } from './providers/AuthProvider'

export { TokenManagerProvider, useTokenManagerContext } from './providers/TokenManagerProvider'

// Locale Utils
export {
  getUserLocale,
  setUserLocale,
  isSupportedLocale,
  detectPreferredLocale,
  parseAcceptLanguage,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from './lib/locale-utils'

// i18n Setup
export { default as i18n } from './locales'

// Security Utils
export { secureStorage } from './utils/security'

export { componentDemoData } from './data/componentDemoData'

// Configuration
export { default as apiConfig } from './config/api'
