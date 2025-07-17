// 'use client'

// import { formatDistanceToNow } from 'date-fns'
// import { useTranslation } from 'react-i18next'
// import { tr as trLocale, enUS as enUSLocale } from 'date-fns/locale'
// import { Activity as ActivityIcon, Plus, Edit, Trash2, Move, Folder, User } from 'lucide-react'

// import { useRecentActivities } from '@/hooks/use-activities'

// import { Badge } from '@/components/core/badge'
// import { Skeleton } from '@/components/core/skeleton'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/core/avatar'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'

// import { cn } from '@/lib/utils'
// import type { ActivityType } from '@/lib/types/activity'

// const activityIcons: Record<ActivityType, typeof Plus> = {
//   TASK_CREATED: Plus,
//   TASK_UPDATED: Edit,
//   TASK_DELETED: Trash2,
//   TASK_MOVED: Move,
//   PROJECT_CREATED: Folder,
//   PROJECT_UPDATED: Edit,
//   PROJECT_DELETED: Trash2,
//   COLUMN_CREATED: Plus,
//   COLUMN_UPDATED: Edit,
//   COLUMN_DELETED: Trash2,
//   USER_JOINED: User,
//   USER_ROLE_CHANGED: Edit,
//   BULK_TASKS_CREATED: Plus,
//   BULK_TASKS_MOVED: Move,
// }

// const activityColors: Record<ActivityType, string> = {
//   TASK_CREATED: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
//   TASK_UPDATED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
//   TASK_DELETED: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
//   TASK_MOVED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
//   PROJECT_CREATED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
//   PROJECT_UPDATED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
//   PROJECT_DELETED: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
//   COLUMN_CREATED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
//   COLUMN_UPDATED: 'bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400',
//   COLUMN_DELETED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
//   USER_JOINED: 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
//   USER_ROLE_CHANGED: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
//   BULK_TASKS_CREATED: 'bg-lime-100 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400',
//   BULK_TASKS_MOVED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
// }

// export default function RecentActivities() {
//   const { t, i18n } = useTranslation()
//   const { data: activitiesData, isLoading, error } = useRecentActivities(12)

//   const activities = Array.isArray(activitiesData) ? activitiesData : []

//   const getDateLocale = () => {
//     return i18n.language === 'tr' ? trLocale : enUSLocale
//   }

//   if (isLoading) {
//     return (
//       <Card className='bg-card/70 backdrop-blur-sm border-border/50 h-[520px] flex flex-col'>
//         <CardHeader className='border-b border-border flex-shrink-0'>
//           <CardTitle className='flex items-center gap-2'>
//             <ActivityIcon className='h-5 w-5 text-indigo-600 dark:text-indigo-500' />
//             {t('activities.title')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className='p-6 flex-1 overflow-hidden'>
//           <div className='space-y-3'>
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className='flex items-start gap-3'>
//                 <Skeleton className='h-7 w-7 rounded-full flex-shrink-0' />
//                 <div className='flex-1 space-y-2'>
//                   <div className='flex items-center gap-2'>
//                     <Skeleton className='h-4 w-4 rounded-full' />
//                     <Skeleton className='h-3 w-20' />
//                   </div>
//                   <Skeleton className='h-3 w-full' />
//                   <Skeleton className='h-2 w-16' />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   if (error || !activitiesData) {
//     return (
//       <Card className='bg-card/70 backdrop-blur-sm border-border/50 h-[520px] flex flex-col'>
//         <CardHeader className='border-b border-border flex-shrink-0'>
//           <CardTitle className='flex items-center gap-2'>
//             <ActivityIcon className='h-5 w-5 text-indigo-600 dark:text-indigo-500' />
//             {t('activities.title')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className='p-6 flex-1 flex items-center justify-center'>
//           <div className='text-center'>
//             <p className='text-sm text-muted-foreground'>{t('activities.error')}</p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card className='bg-card/70 backdrop-blur-sm border-border/50 h-[520px] flex flex-col'>
//       <CardHeader className='border-b border-border flex-shrink-0'>
//         <CardTitle className='flex items-center gap-2'>
//           <ActivityIcon className='h-5 w-5 text-indigo-600 dark:text-indigo-500' />
//           {t('activities.title')}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className='p-6 flex-1 overflow-hidden'>
//         {activities.length === 0 ? (
//           <div className='flex items-center justify-center h-full'>
//             <div className='text-center'>
//               <ActivityIcon className='h-12 w-12 text-muted-foreground/50 mx-auto mb-4' />
//               <p className='text-sm text-muted-foreground'>{t('activities.empty')}</p>
//             </div>
//           </div>
//         ) : (
//           <div className='h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'>
//             <div className='space-y-3 pr-2'>
//               {activities.map(
//                 (activity: {
//                   type: ActivityType
//                   id: string
//                   user?: { avatar?: string; name?: string }
//                   description: string
//                   timestamp: string | number | Date
//                   project?: { name: string }
//                 }) => {
//                   const Icon = activityIcons[activity.type] || ActivityIcon
//                   const colorClass =
//                     activityColors[activity.type] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'

//                   return (
//                     <div
//                       key={activity.id}
//                       className='flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 group'
//                     >
//                       <div
//                         className={cn(
//                           'p-1.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
//                           colorClass,
//                         )}
//                       >
//                         <Icon className='h-3 w-3' />
//                       </div>

//                       <div className='flex-1 min-w-0'>
//                         <div className='flex items-center gap-2 mb-1.5'>
//                           <Avatar className='h-5 w-5 flex-shrink-0'>
//                             <AvatarImage src={activity.user?.avatar} />
//                             <AvatarFallback className='text-xs'>
//                               {activity.user?.name?.charAt(0)?.toUpperCase() || 'U'}
//                             </AvatarFallback>
//                           </Avatar>
//                           <span className='text-xs font-medium text-foreground truncate'>
//                             {activity.user?.name || t('activities.unknownUser')}
//                           </span>
//                         </div>

//                         <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2'>
//                           {activity.description}
//                         </p>

//                         <div className='flex items-center gap-2'>
//                           <span className='text-xs text-muted-foreground'>
//                             {formatDistanceToNow(new Date(activity.timestamp), {
//                               addSuffix: true,
//                               locale: getDateLocale(),
//                             })}
//                           </span>

//                           {activity.project && (
//                             <Badge variant='outline' className='text-xs px-1.5 py-0.5 max-w-24 truncate'>
//                               {activity.project.name}
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 },
//               )}
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
