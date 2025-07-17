'use client'

import { Suspense } from 'react'

import EmailVerification from './EmailVerification'

const VerifyEmailPage = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-background'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      }
    >
      <EmailVerification />
    </Suspense>
  )
}

export default VerifyEmailPage
