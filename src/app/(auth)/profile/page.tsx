'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Profile() {
  const { t } = useTranslation()

  return (
    <div className='px-4 py-6 sm:px-0 bg-white dark:bg-neutral-900 min-h-screen'>
      <div className='bg-white dark:bg-neutral-800 shadow-sm dark:shadow-lg rounded-lg p-6 border border-neutral-200 dark:border-neutral-700'>
        <h1 className='text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>{t('pages.profile.title')}</h1>
        <p className='text-neutral-600 dark:text-neutral-300'>{t('pages.profile.content')}</p>
      </div>
    </div>
  )
}
