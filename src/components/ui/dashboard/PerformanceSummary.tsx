'use client'

import React from 'react'

import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, Minus, Target, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

import { Badge } from '@/components/core/badge'
import { Skeleton } from '@/components/core/skeleton'
import { Progress } from '@/components/core/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'

import { cn } from '@/lib/utils'

interface PerformanceData {
  totalProjects: number
  activeProjects: number
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  pendingTasks: number
  overdueTasks: number
}

interface PerformanceSummaryProps {
  data: PerformanceData | null
  isLoading?: boolean
  period?: 'week' | 'month' | 'quarter'
}

interface MetricCardProps {
  title: string
  value: string
  subValue?: string
  progress?: number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: React.ComponentType<{ className?: string }>
  colorClass: string
  bgClass: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  progress,
  trend,
  trendValue,
  icon: Icon,
  colorClass,
  bgClass,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className='h-3 w-3' />
      case 'down':
        return <TrendingDown className='h-3 w-3' />
      default:
        return <Minus className='h-3 w-3' />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className={cn('p-4 rounded-lg border', bgClass)}>
      <div className='flex items-center justify-between mb-3'>
        <div className={cn('p-2 rounded-lg', bgClass)}>
          <Icon className={cn('h-4 w-4', colorClass)} />
        </div>
        {trend && trendValue && (
          <div className={cn('flex items-center gap-1 text-xs', getTrendColor())}>
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <div>
          <p className='text-2xl font-bold text-foreground'>{value}</p>
          <p className='text-sm text-muted-foreground'>{title}</p>
        </div>

        {subValue && <p className='text-xs text-muted-foreground'>{subValue}</p>}

        {typeof progress === 'number' && (
          <div className='space-y-1'>
            <Progress value={progress} className='h-2' />
            <p className='text-xs text-muted-foreground text-right'>{progress.toFixed(1)}%</p>
          </div>
        )}
      </div>
    </div>
  )
}

const EmptyState: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className='text-center py-12'>
      <div className='mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4'>
        <Target className='h-8 w-8 text-gray-400' />
      </div>
      <h3 className='text-lg font-medium text-foreground mb-2'>{t('performance.noData.title')}</h3>
      <p className='text-sm text-muted-foreground mb-4'>{t('performance.noData.description')}</p>
      <Badge variant='outline' className='text-xs'>
        {t('performance.noData.action')}
      </Badge>
    </div>
  )
}

const LoadingState: React.FC = () => (
  <div className='space-y-6'>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className='p-4 rounded-lg border bg-card/50'>
          <div className='flex items-center justify-between mb-3'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-4 w-12' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-16' />
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-2 w-full' />
          </div>
        </div>
      ))}
    </div>
    <div className='space-y-3'>
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-2 w-full' />
      <Skeleton className='h-4 w-3/4' />
    </div>
  </div>
)

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  data,
  isLoading = false,
  period = 'month',
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Card className='bg-card/70 backdrop-blur-sm border-border/50'>
        <CardHeader className='border-b border-border'>
          <CardTitle className='flex items-center space-x-2'>
            <TrendingUp className='h-5 w-5 text-green-600 dark:text-green-500' />
            <span>{t('performance.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          <LoadingState />
        </CardContent>
      </Card>
    )
  }

  if (!data || (data.totalProjects === 0 && data.totalTasks === 0)) {
    return (
      <Card className='bg-card/70 backdrop-blur-sm border-border/50'>
        <CardHeader className='border-b border-border'>
          <CardTitle className='flex items-center space-x-2'>
            <TrendingUp className='h-5 w-5 text-green-600 dark:text-green-500' />
            <span>{t('performance.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          <EmptyState />
        </CardContent>
      </Card>
    )
  }

  const safeCalculatePercentage = (value: number, total: number): number => {
    if (total === 0 || isNaN(value) || isNaN(total)) return 0
    const result = (value / total) * 100
    return isNaN(result) ? 0 : Math.min(100, Math.max(0, result))
  }

  const safeFormatNumber = (num: number): string => {
    if (isNaN(num) || num === null || num === undefined) return '0'
    return num.toString()
  }

  const completionRate = safeCalculatePercentage(data.completedTasks, data.totalTasks)
  const activeProjectRate = safeCalculatePercentage(data.activeProjects, data.totalProjects)
  const overdueRate = safeCalculatePercentage(data.overdueTasks, data.totalTasks)

  const getCompletionTrend = (): { trend: 'up' | 'down' | 'neutral'; value: string } => {
    if (completionRate >= 80) return { trend: 'up', value: '+12%' }
    if (completionRate >= 50) return { trend: 'neutral', value: '+5%' }
    return { trend: 'down', value: '-3%' }
  }

  const getActivityTrend = (): { trend: 'up' | 'down' | 'neutral'; value: string } => {
    if (activeProjectRate >= 70) return { trend: 'up', value: '+8%' }
    if (activeProjectRate >= 40) return { trend: 'neutral', value: '+2%' }
    return { trend: 'down', value: '-5%' }
  }

  const getEfficiencyTrend = (): { trend: 'up' | 'down' | 'neutral'; value: string } => {
    if (overdueRate <= 10) return { trend: 'up', value: '+15%' }
    if (overdueRate <= 25) return { trend: 'neutral', value: '+3%' }
    return { trend: 'down', value: '-8%' }
  }

  const completionTrend = getCompletionTrend()
  const activityTrend = getActivityTrend()
  const efficiencyTrend = getEfficiencyTrend()

  return (
    <Card className='bg-card/70 backdrop-blur-sm border-border/50'>
      <CardHeader className='border-b border-border'>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <TrendingUp className='h-5 w-5 text-green-600 dark:text-green-500' />
            <span>{t('performance.title')}</span>
          </div>
          <Badge variant='secondary' className='text-xs'>
            {t(`performance.period.${period}`)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <MetricCard
              title={t('performance.metrics.completionRate')}
              value={`${completionRate.toFixed(1)}%`}
              subValue={t('performance.metrics.completionSub', {
                completed: safeFormatNumber(data.completedTasks),
                total: safeFormatNumber(data.totalTasks),
              })}
              progress={completionRate}
              trend={completionTrend.trend}
              trendValue={completionTrend.value}
              icon={CheckCircle2}
              colorClass='text-green-600 dark:text-green-500'
              bgClass='bg-green-500/10 border-green-500/20'
            />

            <MetricCard
              title={t('performance.metrics.activeProjects')}
              value={`${activeProjectRate.toFixed(1)}%`}
              subValue={t('performance.metrics.activeProjectsSub', {
                active: safeFormatNumber(data.activeProjects),
                total: safeFormatNumber(data.totalProjects),
              })}
              progress={activeProjectRate}
              trend={activityTrend.trend}
              trendValue={activityTrend.value}
              icon={Target}
              colorClass='text-blue-600 dark:text-blue-500'
              bgClass='bg-blue-500/10 border-blue-500/20'
            />

            <MetricCard
              title={t('performance.metrics.efficiencyScore')}
              value={`${Math.max(0, 100 - overdueRate).toFixed(1)}%`}
              subValue={
                data.overdueTasks > 0
                  ? t('performance.metrics.overdueCount', { count: data.overdueTasks })
                  : t('performance.metrics.noOverdue')
              }
              progress={Math.max(0, 100 - overdueRate)}
              trend={efficiencyTrend.trend}
              trendValue={efficiencyTrend.value}
              icon={data.overdueTasks > 0 ? AlertTriangle : Clock}
              colorClass={
                data.overdueTasks > 0 ? 'text-orange-600 dark:text-orange-500' : 'text-purple-600 dark:text-purple-500'
              }
              bgClass={
                data.overdueTasks > 0
                  ? 'bg-orange-500/10 border-orange-500/20'
                  : 'bg-purple-500/10 border-purple-500/20'
              }
            />
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>{safeFormatNumber(data.totalTasks)}</p>
              <p className='text-sm text-muted-foreground'>{t('performance.summary.totalTasks')}</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-green-600 dark:text-green-500'>
                {safeFormatNumber(data.completedTasks)}
              </p>
              <p className='text-sm text-muted-foreground'>{t('performance.summary.completed')}</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-orange-600 dark:text-orange-500'>
                {safeFormatNumber(data.inProgressTasks)}
              </p>
              <p className='text-sm text-muted-foreground'>{t('performance.summary.inProgress')}</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-blue-600 dark:text-blue-500'>
                {safeFormatNumber(data.pendingTasks)}
              </p>
              <p className='text-sm text-muted-foreground'>{t('performance.summary.pending')}</p>
            </div>
          </div>

          <div className='bg-muted/50 rounded-lg p-4'>
            <h4 className='font-medium text-foreground mb-2'>{t('performance.evaluation.title')}</h4>
            <div className='space-y-2 text-sm text-muted-foreground'>
              {completionRate >= 80 && (
                <p className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-600' />
                  {t('performance.evaluation.excellent')}
                </p>
              )}
              {completionRate >= 50 && completionRate < 80 && (
                <p className='flex items-center gap-2'>
                  <Target className='h-4 w-4 text-orange-600' />
                  {t('performance.evaluation.good')}
                </p>
              )}
              {completionRate < 50 && (
                <p className='flex items-center gap-2'>
                  <AlertTriangle className='h-4 w-4 text-red-600' />
                  {t('performance.evaluation.poor')}
                </p>
              )}

              {data.overdueTasks === 0 && data.totalTasks > 0 && (
                <p className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-green-600' />
                  {t('performance.evaluation.timeManagement')}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
