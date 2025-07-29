'use client'

import React from 'react'
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form'
import { FileText, Plus, X, HelpCircle, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { FormError } from '@/components/core/form-error'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/core/dialog'
import { Badge } from '@/components/core/badge'
import { Alert, AlertDescription } from '@/components/core/alert'
import { ATSFormData } from '@/types/form.types'

interface ProfessionalSummarySectionProps {
  register: UseFormRegister<ATSFormData>
  errors: FieldErrors<ATSFormData>
  watch: UseFormWatch<ATSFormData>
  setValue: UseFormSetValue<ATSFormData>
  getValues: UseFormGetValues<ATSFormData>
}

export function ProfessionalSummarySection({
  register,
  errors,
  watch,
  setValue,
  getValues,
}: ProfessionalSummarySectionProps) {
  const keySkills = watch('professionalSummary.keySkills') || []
  const summaryText = watch('professionalSummary.summary') || ''
  // const [showHelpDialog, setShowHelpDialog] = useState(false) // Removed unused

  const addKeySkill = () => {
    const current = getValues('professionalSummary.keySkills')
    setValue('professionalSummary.keySkills', [...current, ''])
  }

  const removeKeySkill = (index: number) => {
    const current = getValues('professionalSummary.keySkills')
    if (current.length > 3) {
      setValue(
        'professionalSummary.keySkills',
        current.filter((_, i) => i !== index),
      )
    }
  }

  // Professional Summary Analysis
  const analyzeSummary = (text: string) => {
    const checks = {
      hasExperience: /(\d+\+?\s*(yıl|year)|deneyim|experience|uzman|expert)/i.test(text),
      hasTechnologies:
        /(\w+\.(js|ts|py)|react|node|python|java|angular|vue|docker|aws|sql|mongodb|postgresql|redis|express|spring|django|flask|laravel|php|c#|c\+\+|kotlin|swift|go|rust|ruby|scala|r|matlab|tensorflow|pytorch|kubernetes|jenkins)/i.test(
          text,
        ),
      hasSpecialSkills:
        /(mikroservis|microservice|restful|api|cloud|devops|agile|scrum|clean code|tdd|ci\/cd|architecture|senior|lead|management|optimization|performance)/i.test(
          text,
        ),
      hasPersonality:
        /(problem.*çöz|team|takım|collaborative|innovative|creative|analytical|detail|oriented|motivated|passionate|dedicated|reliable|communication|leadership|adaptable)/i.test(
          text,
        ),
      lengthOk: text.length >= 100 && text.length <= 400,
    }

    return checks
  }

  const summaryChecks = analyzeSummary(summaryText)
  const completedChecks = Object.values(summaryChecks).filter(Boolean).length
  const totalChecks = Object.keys(summaryChecks).length

  // Character count status
  const getCharCountStatus = (length: number) => {
    if (length < 100) return { status: 'short', color: 'text-red-500', message: 'Çok kısa' }
    if (length >= 100 && length <= 200) return { status: 'good', color: 'text-yellow-500', message: 'İyi' }
    if (length >= 200 && length <= 400) return { status: 'optimal', color: 'text-green-500', message: 'Optimal' }
    return { status: 'long', color: 'text-red-500', message: 'Çok uzun' }
  }

  const charStatus = getCharCountStatus(summaryText.length)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='h-5 w-5' />
          Profesyonel Özet
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='targetPosition'>Hedef Pozisyon *</Label>
            <Input
              id='targetPosition'
              {...register('professionalSummary.targetPosition')}
              placeholder='Örn: Senior Full Stack Developer'
              className={errors.professionalSummary?.targetPosition ? 'border-destructive' : ''}
            />
            <FormError message={errors.professionalSummary?.targetPosition?.message} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='yearsOfExperience'>Deneyim Yılı *</Label>
            <Input
              id='yearsOfExperience'
              type='number'
              min='0'
              max='50'
              {...register('professionalSummary.yearsOfExperience', { valueAsNumber: true })}
              className={errors.professionalSummary?.yearsOfExperience ? 'border-destructive' : ''}
            />
            <FormError message={errors.professionalSummary?.yearsOfExperience?.message} />
          </div>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='summary' className='text-base font-medium'>
              Professional Summary *
            </Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='ghost' size='sm' className='h-auto p-1'>
                  <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground' />
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    🎯 Mükemmel Professional Summary Nasıl Yazılır?
                  </DialogTitle>
                </DialogHeader>
                <div className='space-y-6'>
                  {/* Yapı ve Sıralama */}
                  <div>
                    <h4 className='font-medium text-sm mb-3 flex items-center gap-2'>📐 Yapı ve Sıralama:</h4>
                    <ol className='space-y-2 text-sm'>
                      <li className='flex gap-2'>
                        <span className='font-medium text-blue-600'>1.</span>
                        <div>
                          <strong>Deneyim + Pozisyon:</strong> &quot;5+ yıl deneyimli Full Stack Developer&quot;
                        </div>
                      </li>
                      <li className='flex gap-2'>
                        <span className='font-medium text-blue-600'>2.</span>
                        <div>
                          <strong>Ana Teknolojiler:</strong> &quot;React, Node.js, PostgreSQL ile&quot;
                        </div>
                      </li>
                      <li className='flex gap-2'>
                        <span className='font-medium text-blue-600'>3.</span>
                        <div>
                          <strong>Özel Yetkinlikler:</strong> &quot;mikroservis mimarileri tasarımında uzman&quot;
                        </div>
                      </li>
                      <li className='flex gap-2'>
                        <span className='font-medium text-blue-600'>4.</span>
                        <div>
                          <strong>Kişilik/Yaklaşım:</strong> &quot;problem çözme odaklı, takım player&quot;
                        </div>
                      </li>
                    </ol>
                  </div>

                  {/* İyi Örnekler */}
                  <div>
                    <h4 className='font-medium text-sm mb-3 text-green-700'>✅ İyi Örnekler:</h4>
                    <div className='space-y-4'>
                      <div className='p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                        <div className='font-medium text-sm mb-2'>Software Developer:</div>
                        <p className='text-sm text-foreground'>
                          &quot;4+ yıl deneyimli Full Stack Developer. JavaScript, React, Node.js ile enterprise web
                          uygulamaları geliştirme uzmanı. RESTful API ve mikroservis mimarilerinde deneyimli. Code
                          review ve performans optimizasyonunda güçlü, Agile metodolojilerle çalışan problem çözücü
                          developer.&quot;
                        </p>
                      </div>
                      <div className='p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                        <div className='font-medium text-sm mb-2'>Entry Level:</div>
                        <p className='text-sm text-foreground'>
                          &quot;Computer Science mezunu junior developer. HTML, CSS, JavaScript ve React ile modern web
                          uygulamaları geliştirme deneyimi. University projelerinde full-stack development ve Git
                          kullanımı. Öğrenmeye açık, takım çalışmasında etkili genç yazılım geliştirici.&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kaçınılacaklar */}
                  <div>
                    <h4 className='font-medium text-sm mb-3 text-red-700'>❌ Kaçınılacaklar:</h4>
                    <ul className='space-y-1 text-sm'>
                      <li>❌ &quot;Ben bir yazılım geliştiricisiyim...&quot; (kişisel zamirler)</li>
                      <li>❌ Çok genel ifadeler: &quot;teknolojiye ilgili&quot;</li>
                      <li>❌ Çok kısa: &quot;React developer&quot;</li>
                      <li>❌ Çok uzun: 500+ karakter</li>
                    </ul>
                  </div>

                  {/* ATS İpuçları */}
                  <div>
                    <h4 className='font-medium text-sm mb-3 text-blue-700'>🎯 ATS İpuçları:</h4>
                    <ul className='space-y-1 text-sm'>
                      <li>✅ İş ilanından teknoloji isimlerini kullanın</li>
                      <li>✅ Sayısal başarılar ekleyin: &quot;5+ proje&quot;, &quot;%40 performans artışı&quot;</li>
                      <li>✅ Sektör terimlerini kullanın: &quot;enterprise&quot;, &quot;microservices&quot;</li>
                      <li>✅ Sertifika varsa belirtin: &quot;AWS Certified&quot;</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Textarea
            id='summary'
            {...register('professionalSummary.summary')}
            placeholder='Örnek: "5+ yıl deneyimli Full Stack Developer. React, Node.js ve PostgreSQL ile modern web uygulamaları geliştirme konusunda uzman. Mikroservis mimarileri ve RESTful API tasarımında deneyimli. Problem çözme odaklı, takım çalışmasında güçlü yazılım geliştirici."'
            rows={4}
            className={`${errors.professionalSummary?.summary ? 'border-destructive' : ''} ${
              summaryText.length > 0
                ? charStatus.status === 'optimal'
                  ? 'border-green-500'
                  : charStatus.status === 'good'
                    ? 'border-yellow-500'
                    : 'border-red-500'
                : ''
            }`}
            maxLength={500}
          />

          {/* Character Counter & Status */}
          <div className='flex items-center justify-between text-xs'>
            <div className='flex items-center gap-4'>
              <span className={`font-medium ${charStatus.color}`}>
                {summaryText.length}/400 karakter • {charStatus.message}
              </span>
              {summaryText.length >= 200 && summaryText.length <= 300 && (
                <Badge variant='secondary' className='text-xs bg-green-100 text-green-700'>
                  200-300 karakter optimal
                </Badge>
              )}
            </div>
            <div className='flex items-center gap-1'>
              <span className='text-muted-foreground'>Kalite:</span>
              <span
                className={`font-medium ${
                  completedChecks >= 4 ? 'text-green-500' : completedChecks >= 2 ? 'text-yellow-500' : 'text-red-500'
                }`}
              >
                {completedChecks}/{totalChecks}
              </span>
            </div>
          </div>

          {/* Live Feedback */}
          {summaryText.length > 20 && (
            <div className='p-3 bg-muted/30 rounded-lg border space-y-2'>
              <h5 className='text-xs font-medium mb-2'>📝 Canlı Değerlendirme:</h5>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-xs'>
                <div
                  className={`flex items-center gap-2 ${
                    summaryChecks.hasExperience ? 'text-green-600' : 'text-orange-500'
                  }`}
                >
                  {summaryChecks.hasExperience ? (
                    <CheckCircle className='h-3 w-3' />
                  ) : (
                    <AlertTriangle className='h-3 w-3' />
                  )}
                  {summaryChecks.hasExperience ? 'Deneyim seviyesi belirtildi' : 'Deneyim seviyesi ekleyin'}
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    summaryChecks.hasTechnologies ? 'text-green-600' : 'text-orange-500'
                  }`}
                >
                  {summaryChecks.hasTechnologies ? (
                    <CheckCircle className='h-3 w-3' />
                  ) : (
                    <AlertTriangle className='h-3 w-3' />
                  )}
                  {summaryChecks.hasTechnologies ? 'Teknoloji becerileri eklendi' : 'Teknoloji becerileri ekleyin'}
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    summaryChecks.hasSpecialSkills ? 'text-green-600' : 'text-orange-500'
                  }`}
                >
                  {summaryChecks.hasSpecialSkills ? (
                    <CheckCircle className='h-3 w-3' />
                  ) : (
                    <AlertTriangle className='h-3 w-3' />
                  )}
                  {summaryChecks.hasSpecialSkills ? 'Özel yetkinlik eklendi' : 'Özel yetkinlik/başarı ekleyin'}
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    summaryChecks.hasPersonality ? 'text-green-600' : 'text-orange-500'
                  }`}
                >
                  {summaryChecks.hasPersonality ? (
                    <CheckCircle className='h-3 w-3' />
                  ) : (
                    <AlertTriangle className='h-3 w-3' />
                  )}
                  {summaryChecks.hasPersonality ? 'Kişilik özelliği eklendi' : 'Kişilik özelliği belirtin'}
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          {summaryText.length === 0 && (
            <Alert className='border-blue-200 bg-blue-50 dark:bg-blue-900/20'>
              <Lightbulb className='h-4 w-4 text-blue-500' />
              <AlertDescription className='text-sm'>
                <strong>💡 İpucu:</strong> Deneyim seviyeniz + ana teknolojileriniz + özel becerileriniz + kişilik
                özelliklerinizi 2-4 cümlede özetleyin.
                <br />
                <span className='text-muted-foreground'>
                  Örnek: &quot;3+ yıl deneyimli React Developer. TypeScript, Node.js ve PostgreSQL ile SPA geliştirme
                  uzmanı. Performance optimization ve clean code prensiplerine odaklı problem solver.&quot;
                </span>
              </AlertDescription>
            </Alert>
          )}

          <FormError message={errors.professionalSummary?.summary?.message} />
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label className='text-base font-medium'>
              Anahtar Yetenekler * <span className='text-xs text-muted-foreground'>(En az 1 adet gerekli)</span>
            </Label>
            <Button type='button' variant='outline' size='sm' onClick={addKeySkill}>
              <Plus className='h-4 w-4 mr-2' />
              Ekle
            </Button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {keySkills.map((_, index) => (
              <div key={index} className='flex gap-2'>
                <Input
                  placeholder='React, Node.js, Python...'
                  {...register(`professionalSummary.keySkills.${index}`)}
                />
                {keySkills.length > 1 && (
                  <Button type='button' variant='outline' size='sm' onClick={() => removeKeySkill(index)}>
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <FormError message={errors.professionalSummary?.keySkills?.message} />
        </div>
      </CardContent>
    </Card>
  )
}
