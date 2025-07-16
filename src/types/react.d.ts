import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // CSS custom properties için
    style?: React.CSSProperties & Record<`--${string}`, string | number>
  }
}

export {}
