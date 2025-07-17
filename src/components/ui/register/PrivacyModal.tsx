'use client'

import React from 'react'
import { X, Shield, Eye, Database, Lock, Users, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-200'
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role='dialog'
      aria-modal='true'
      aria-labelledby='privacy-modal-title'
    >
      <div className='relative w-full max-w-4xl max-h-[90vh] mx-4 bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border bg-green-50 dark:bg-green-950/30 flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-green-500/10'>
              <Shield className='w-5 h-5 text-green-600 dark:text-green-400' />
            </div>
            <h2 id='privacy-modal-title' className='text-xl font-semibold text-foreground'>
              {t('legal.privacy.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-2 rounded-lg hover:bg-muted transition-colors'
            aria-label={t('common.close')}
          >
            <X className='w-5 h-5 text-muted-foreground' />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='space-y-6'>
            {/* Last Updated */}
            <div className='flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3'>
              <Globe className='w-4 h-4' />
              <span>
                {t('legal.privacy.lastUpdated')}: {t('legal.privacy.lastUpdatedDate')}
              </span>
            </div>

            {/* Introduction */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.privacy.sections.introduction.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {t('legal.privacy.sections.introduction.content')}
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3 flex items-center gap-2'>
                <Database className='w-5 h-5 text-blue-500' />
                {t('legal.privacy.sections.informationCollection.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed mb-4'>
                {t('legal.privacy.sections.informationCollection.intro')}
              </p>

              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium text-foreground mb-2'>
                    {t('legal.privacy.sections.informationCollection.personalInfo.title')}
                  </h4>
                  <div className='space-y-2 ml-4'>
                    <p className='text-muted-foreground'>
                      • {t('legal.privacy.sections.informationCollection.personalInfo.item1')}
                    </p>
                    <p className='text-muted-foreground'>
                      • {t('legal.privacy.sections.informationCollection.personalInfo.item2')}
                    </p>
                    <p className='text-muted-foreground'>
                      • {t('legal.privacy.sections.informationCollection.personalInfo.item3')}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className='font-medium text-foreground mb-2'>
                    {t('legal.privacy.sections.informationCollection.technicalInfo.title')}
                  </h4>
                  <div className='space-y-2 ml-4'>
                    <p className='text-muted-foreground'>
                      • {t('legal.privacy.sections.informationCollection.technicalInfo.item1')}
                    </p>
                    <p className='text-muted-foreground'>
                      • {t('legal.privacy.sections.informationCollection.technicalInfo.item2')}
                    </p>
                    <p className='text-muted-foreground'>
                      • {t('legal.privacy.sections.informationCollection.technicalInfo.item3')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3 flex items-center gap-2'>
                <Eye className='w-5 h-5 text-purple-500' />
                {t('legal.privacy.sections.informationUse.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed mb-3'>
                {t('legal.privacy.sections.informationUse.intro')}
              </p>
              <div className='space-y-2 ml-4'>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.informationUse.item1')}</p>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.informationUse.item2')}</p>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.informationUse.item3')}</p>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.informationUse.item4')}</p>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.informationUse.item5')}</p>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3 flex items-center gap-2'>
                <Users className='w-5 h-5 text-orange-500' />
                {t('legal.privacy.sections.informationSharing.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed mb-3'>
                {t('legal.privacy.sections.informationSharing.intro')}
              </p>
              <div className='bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
                <p className='text-yellow-800 dark:text-yellow-200 text-sm font-medium'>
                  {t('legal.privacy.sections.informationSharing.commitment')}
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3 flex items-center gap-2'>
                <Lock className='w-5 h-5 text-green-500' />
                {t('legal.privacy.sections.dataSecurity.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed mb-3'>
                {t('legal.privacy.sections.dataSecurity.content')}
              </p>
              <div className='space-y-2 ml-4'>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.dataSecurity.measure1')}</p>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.dataSecurity.measure2')}</p>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.dataSecurity.measure3')}</p>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.dataSecurity.measure4')}</p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.privacy.sections.dataRetention.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {t('legal.privacy.sections.dataRetention.content')}
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.privacy.sections.userRights.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed mb-3'>
                {t('legal.privacy.sections.userRights.intro')}
              </p>
              <div className='space-y-2 ml-4'>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.userRights.right1')}</p>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.userRights.right2')}</p>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.userRights.right3')}</p>
                <p className='text-muted-foreground'>• {t('legal.privacy.sections.userRights.right4')}</p>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.privacy.sections.cookies.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed mb-3'>
                {t('legal.privacy.sections.cookies.content')}
              </p>
              <div className='bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                <p className='text-blue-800 dark:text-blue-200 text-sm'>{t('legal.privacy.sections.cookies.note')}</p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.privacy.sections.policyChanges.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {t('legal.privacy.sections.policyChanges.content')}
              </p>
            </section>

            {/* Contact Information */}
            <section className='bg-muted/30 rounded-lg p-4 border border-border'>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.privacy.sections.contact.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>{t('legal.privacy.sections.contact.content')}</p>
              <div className='mt-2'>
                <a
                  href='mailto:gok.zaferr@gmail.com'
                  className='text-primary hover:text-primary/80 transition-colors font-medium'
                >
                  gok.zaferr@gmail.com
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end p-6 border-t border-border bg-muted/30 flex-shrink-0'>
          {/* <p className='text-sm text-muted-foreground'>
            {t('legal.privacy.footer.effectiveDate')}: {t('legal.privacy.lastUpdatedDate')}
          </p> */}
          <button
            onClick={onClose}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium'
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyModal
