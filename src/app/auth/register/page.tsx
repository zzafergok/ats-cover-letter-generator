'use client'

import React from 'react'

import { RegisterForm } from '@/components/forms/auth/RegisterForm'

import { RegisterFormValues } from '@/lib/validations/auth'

export default function RegisterPage() {
  const handleRegister = async (data: RegisterFormValues) => {
    // Register işlemini burada gerçekleştirin
    console.log('Register data:', data)
  }

  return (
    <RegisterForm onSubmit={handleRegister} redirectOnSuccess='/dashboard' showLoginLink={true} variant='default' />
  )
}
