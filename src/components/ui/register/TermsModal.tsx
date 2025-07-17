'use client'

import React from 'react'
import { X, FileText, Calendar, Shield, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
      aria-labelledby='terms-modal-title'
    >
      <div className='relative w-full max-w-4xl max-h-[90vh] mx-4 bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border bg-primary/5 flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-primary/10'>
              <FileText className='w-5 h-5 text-primary' />
            </div>
            <h2 id='terms-modal-title' className='text-xl font-semibold text-foreground'>
              {t('legal.terms.title')}
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
              <Calendar className='w-4 h-4' />
              <span>
                {t('legal.terms.lastUpdated')}: {t('legal.terms.lastUpdatedDate')}
              </span>
            </div>

            {/* Introduction */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.terms.sections.introduction.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>{t('legal.terms.sections.introduction.content')}</p>
            </section>

            {/* Service Description */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.terms.sections.serviceDescription.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed mb-3'>
                {t('legal.terms.sections.serviceDescription.content')}
              </p>
              <div className='bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                <p className='text-blue-800 dark:text-blue-200 text-sm'>
                  {t('legal.terms.sections.serviceDescription.note')}
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.terms.sections.userResponsibilities.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed mb-3'>
                {t('legal.terms.sections.userResponsibilities.intro')}
              </p>
              <div className='space-y-2 ml-4'>
                <p className='text-muted-foreground'>• {t('legal.terms.sections.userResponsibilities.item1')}</p>
                <p className='text-muted-foreground'>• {t('legal.terms.sections.userResponsibilities.item2')}</p>
                <p className='text-muted-foreground'>• {t('legal.terms.sections.userResponsibilities.item3')}</p>
                <p className='text-muted-foreground'>• {t('legal.terms.sections.userResponsibilities.item4')}</p>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3 flex items-center gap-2'>
                <AlertTriangle className='w-5 h-5 text-orange-500' />
                {t('legal.terms.sections.prohibitedActivities.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed mb-3'>
                {t('legal.terms.sections.prohibitedActivities.intro')}
              </p>
              <div className='space-y-2 ml-4'>
                <p className='text-muted-foreground'>• {t('legal.terms.sections.prohibitedActivities.item1')}</p>
                <p className='text-muted-foreground'>• {t('legal.terms.sections.prohibitedActivities.item2')}</p>
                <p className='text-muted-foreground'>• {t('legal.terms.sections.prohibitedActivities.item3')}</p>
                <p className='text-muted-foreground'>• {t('legal.terms.sections.prohibitedActivities.item4')}</p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.terms.sections.intellectualProperty.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {t('legal.terms.sections.intellectualProperty.content')}
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3 flex items-center gap-2'>
                <Shield className='w-5 h-5 text-blue-500' />
                {t('legal.terms.sections.limitationOfLiability.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {t('legal.terms.sections.limitationOfLiability.content')}
              </p>
            </section>

            {/* Service Modifications */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.terms.sections.serviceModifications.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {t('legal.terms.sections.serviceModifications.content')}
              </p>
            </section>

            {/* Termination */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.terms.sections.termination.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>{t('legal.terms.sections.termination.content')}</p>
            </section>

            {/* Governing Law */}
            <section>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {t('legal.terms.sections.governingLaw.title')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>{t('legal.terms.sections.governingLaw.content')}</p>
            </section>

            {/* Contact Information */}
            <section className='bg-muted/30 rounded-lg p-4 border border-border'>
              <h3 className='text-lg font-semibold text-foreground mb-3'>{t('legal.terms.sections.contact.title')}</h3>
              <p className='text-muted-foreground leading-relaxed'>{t('legal.terms.sections.contact.content')}</p>
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
            {t('legal.terms.footer.effectiveDate')}: {t('legal.terms.lastUpdatedDate')}
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

export default TermsModal
