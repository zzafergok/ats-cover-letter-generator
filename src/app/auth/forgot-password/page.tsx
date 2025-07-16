'use client'

import React from 'react'

import { ForgotPasswordForm } from '@/components/forms/auth/ForgotPasswordForm'

import { ForgotPasswordFormValues } from '@/lib/validations/auth'

export default function ForgotPasswordPage() {
  const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
    // Forgot password işlemini burada gerçekleştirin
    console.log('Forgot password data:', data)
  }

  return <ForgotPasswordForm onSubmit={handleForgotPassword} variant='default' showBackLink={true} />
}
