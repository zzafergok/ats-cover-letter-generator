# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server
- `npm run build` - Build production bundle  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler without emitting
- `npm run prettier` - Format code with Prettier
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Additional Commands
- `npm run prettier:check` - Check code formatting
- `npm run clean` - Clean build artifacts

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom theme
- **State Management**: Zustand with persistence
- **API Client**: Axios with custom interceptors
- **UI Components**: Radix UI primitives with custom design system
- **Authentication**: JWT-based with refresh tokens
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: i18next with browser language detection

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable UI components
  - `core/` - Base UI components (buttons, inputs, etc.)
  - `ui/` - Feature-specific components
  - `layout/` - Navigation and layout components
- `src/lib/` - Utilities and configurations
- `src/store/` - Zustand state stores
- `src/types/` - TypeScript type definitions
- `src/providers/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/services/` - API service layers
- `src/schemas/` - Zod validation schemas
- `src/constants/` - Application constants
- `src/locales/` - Translation files

### Key Features
The application is an ATS (Applicant Tracking System) focused CV and cover letter generator with the following main features:

1. **Authentication System** - JWT-based auth with refresh tokens and session management
2. **CV Management** - Upload, generate, and optimize CVs with ATS scoring
3. **Cover Letter Generation** - Basic and detailed cover letter creation with templates
4. **User Profile Management** - Complete profile system with education, experience, skills
5. **Template System** - Multiple CV and cover letter templates
6. **Salary Calculator** - Compensation analysis tools
7. **Multi-language Support** - Turkish and English localization

### Authentication Architecture
- Uses JWT access tokens (short-lived) and refresh tokens (longer-lived)
- Automatic token refresh via Axios interceptors
- Session persistence in sessionStorage with "Remember Me" functionality
- Protected routes with `ProtectedRoute` component
- Auth state managed via `AuthProvider` context and Zustand stores

### State Management Pattern
- **Zustand stores** for global state with persistence
- **React Hook Form** for form state management
- **Zod schemas** for validation
- Store files: `cvStore.ts`, `coverLetterStore.ts`, `userProfileStore.ts`, etc.

### API Architecture
- Centralized API configuration in `lib/api/`
- Type-safe API calls with comprehensive TypeScript interfaces
- Service layer pattern with separate files for different domains
- Automatic authentication header injection
- Response/request interceptors for error handling

### Component Architecture
- **Radix UI** primitives for accessibility
- **Custom design system** with consistent theming
- **Compound component pattern** for complex UI elements
- **Feature-based organization** under `components/ui/`

### Styling System
- **Tailwind CSS** with custom configuration
- **CSS custom properties** for theme variables
- **Dark mode support** via class-based theming
- **Custom animations** and utility classes
- **Responsive design** with mobile-first approach

### Form Handling
- **React Hook Form** for performance and UX
- **Zod validation** with TypeScript integration
- **Custom form components** in `components/form/`
- **Validation schemas** centralized in `lib/validations/`

### Development Patterns
- **TypeScript strict mode** enabled
- **Path aliases** configured (`@/` maps to `src/`)
- **ESLint + Prettier** for code quality
- **Component co-location** pattern
- **Custom hooks** for reusable logic

## Important Notes

### Authentication
- Always use the `useAuth` hook for authentication state
- Protected routes automatically redirect to login if not authenticated
- Session tokens are automatically managed - don't handle manually

### API Calls
- Use the centralized API services in `lib/api/api.ts`
- All API responses follow the `{ success: boolean, data: T, message?: string }` pattern
- Error handling is centralized in Axios interceptors

### State Management
- Use Zustand stores for global state that needs persistence
- Use React Hook Form for form-specific state
- Keep component state local when possible

### Styling
- Use Tailwind classes for styling
- Custom components should extend base Radix UI primitives
- Follow the established color palette and spacing system

### Type Safety
- All API responses have TypeScript interfaces in `types/api.types.ts`
- Use Zod schemas for runtime validation
- Avoid `any` types - create proper interfaces instead

### Testing
- Jest configuration is set up for unit testing
- Testing Library is available for component testing
- Run tests before committing changes