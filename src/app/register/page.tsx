'use client'

import { Suspense } from 'react'

import RegisterForm from './RegisterForm'

import { LoadingSpinner } from '@/components/core/loading-spinner'

const RegisterPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterForm />
    </Suspense>
  )
}

export default RegisterPage
