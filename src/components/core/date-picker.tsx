'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'

import {
  getDay,
  format,
  addDays,
  isToday,
  addYears,
  subYears,
  setHours,
  getHours,
  endOfWeek,
  addMonths,
  subMonths,
  isSameDay,
  endOfMonth,
  getMinutes,
  setMinutes,
  startOfWeek,
  isSameMonth,
  startOfMonth,
  isWithinInterval,
} from 'date-fns'
import { tr } from 'date-fns/locale/tr'
import { enUS } from 'date-fns/locale/en-US'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Globe, X } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/core/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

import { cn } from '@/lib/utils'

export interface DateRange {
  from: Date | null
  to: Date | null
}

export interface DatePickerProps {
  // Value props
  value?: Date | Date[] | DateRange | null
  onChange?: (date: Date | Date[] | DateRange | null) => void

  // Mode configuration
  mode?: 'single' | 'multiple' | 'range'
  enableTime?: boolean
  enableTimezone?: boolean

  // Date constraints
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  disabledDaysOfWeek?: number[] // 0-6 (Sunday-Saturday)

  // Display options
  placeholder?: string
  dateFormat?: string
  timeFormat?: string
  locale?: 'tr' | 'en'
  showWeekNumbers?: boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6

  // UI configuration
  disabled?: boolean
  readOnly?: boolean
  clearable?: boolean
  className?: string

  // Advanced features
  enablePresets?: boolean
  customPresets?: Array<{
    label: string
    value: Date | DateRange | Date[]
  }>

  // Events
  onFocus?: () => void
  onBlur?: () => void
  onMonthChange?: (month: Date) => void
  onYearChange?: (year: number) => void
}

const timeZones = [
  { value: 'Europe/Istanbul', label: 'İstanbul (GMT+3)' },
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
]

const defaultPresets = {
  single: [
    { label: 'Bugün', value: new Date() },
    { label: 'Yarın', value: addDays(new Date(), 1) },
    { label: 'Bir hafta sonra', value: addDays(new Date(), 7) },
  ],
  range: [
    {
      label: 'Son 7 gün',
      value: { from: addDays(new Date(), -7), to: new Date() },
    },
    {
      label: 'Son 30 gün',
      value: { from: addDays(new Date(), -30), to: new Date() },
    },
    {
      label: 'Bu ay',
      value: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    },
  ],
}

export function DatePicker({
  value,
  onChange,

  mode = 'single',
  enableTime = false,
  enableTimezone = false,

  minDate,
  maxDate,
  disabledDates = [],
  disabledDaysOfWeek = [],

  placeholder = 'Tarih seçin',
  dateFormat = 'dd/MM/yyyy',
  timeFormat = 'HH:mm',
  locale = 'tr',
  showWeekNumbers = false,
  weekStartsOn = 1, // Monday

  disabled = false,
  readOnly = false,
  clearable = true,
  className,

  enablePresets = false,
  customPresets,

  onFocus,
  onBlur,
  onMonthChange,
  onYearChange,
}: DatePickerProps) {
  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value instanceof Date ? value : new Date())
  const [selectedTime, setSelectedTime] = useState({
    hours: value instanceof Date ? getHours(value) : 12,
    minutes: value instanceof Date ? getMinutes(value) : 0,
  })
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/Istanbul')
  const [inputValue, setInputValue] = useState('')

  // Refs
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Locale configuration
  const dateLocale = locale === 'tr' ? tr : enUS

  // Format display value
  const formatDisplayValue = useCallback(
    (date: Date | Date[] | DateRange | null) => {
      if (!date) return ''

      try {
        if (date instanceof Date) {
          const formatString = enableTime ? `${dateFormat} ${timeFormat}` : dateFormat
          return format(date, formatString, { locale: dateLocale })
        }

        if (Array.isArray(date)) {
          return date.map((d) => format(d, dateFormat, { locale: dateLocale })).join(', ')
        }

        if (typeof date === 'object' && 'from' in date) {
          const { from, to } = date as DateRange
          if (!from) return ''
          if (!to) return format(from, dateFormat, { locale: dateLocale })
          return `${format(from, dateFormat, { locale: dateLocale })} - ${format(to, dateFormat, { locale: dateLocale })}`
        }
      } catch (error) {
        console.error('Date formatting error:', error)
        return ''
      }

      return ''
    },
    [dateFormat, timeFormat, enableTime, dateLocale],
  )

  // Update input value when value changes
  useEffect(() => {
    setInputValue(formatDisplayValue(value ?? null))
  }, [value, formatDisplayValue])

  // Check if date is disabled
  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      if (disabledDates.some((disabledDate) => isSameDay(date, disabledDate))) return true
      if (disabledDaysOfWeek.includes(getDay(date))) return true
      return false
    },
    [minDate, maxDate, disabledDates, disabledDaysOfWeek],
  )

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn })
    const days = []
    let day = start

    while (day <= end) {
      days.push(day)
      day = addDays(day, 1)
    }

    return days
  }, [currentMonth, weekStartsOn])

  // Check if date is selected
  const isDateSelected = useCallback(
    (date: Date) => {
      if (!value) return false

      if (value instanceof Date) {
        return isSameDay(date, value)
      }

      if (Array.isArray(value)) {
        return value.some((selectedDate) => isSameDay(date, selectedDate))
      }

      if (typeof value === 'object' && 'from' in value) {
        const { from, to } = value as DateRange
        if (!from) return false
        if (!to) return isSameDay(date, from)
        return isWithinInterval(date, { start: from, end: to })
      }

      return false
    },
    [value],
  )

  // Check if date is in range start/end
  const isRangeStart = useCallback(
    (date: Date) => {
      if (mode !== 'range' || !value || typeof value !== 'object' || !('from' in value)) return false
      const { from } = value as DateRange
      return from && isSameDay(date, from)
    },
    [mode, value],
  )

  const isRangeEnd = useCallback(
    (date: Date) => {
      if (mode !== 'range' || !value || typeof value !== 'object' || !('from' in value)) return false
      const { to } = value as DateRange
      return to && isSameDay(date, to)
    },
    [mode, value],
  )

  // Handle date selection
  const handleDateSelect = useCallback(
    (selectedDate: Date) => {
      if (isDateDisabled(selectedDate)) return

      let newValue: Date | Date[] | DateRange | null = null

      // Apply time if enabled
      const dateWithTime = enableTime
        ? setMinutes(setHours(selectedDate, selectedTime.hours), selectedTime.minutes)
        : selectedDate

      switch (mode) {
        case 'single':
          newValue = dateWithTime
          if (!enableTime) setIsOpen(false)
          break

        case 'multiple': {
          const currentArray = Array.isArray(value) ? value : []
          const existingIndex = currentArray.findIndex((date) => isSameDay(date, selectedDate))

          if (existingIndex >= 0) {
            // Remove if already selected
            newValue = currentArray.filter((_, index) => index !== existingIndex)
          } else {
            // Add to selection
            newValue = [...currentArray, dateWithTime]
          }
          break
        }
        case 'range': {
          const currentRange =
            value && typeof value === 'object' && 'from' in value ? (value as DateRange) : { from: null, to: null }

          if (!currentRange.from || (currentRange.from && currentRange.to)) {
            // Start new range
            newValue = { from: dateWithTime, to: null }
          } else {
            // Complete range
            const from = currentRange.from
            const to = dateWithTime

            newValue = from <= to ? { from, to } : { from: to, to: from }

            if (!enableTime) setIsOpen(false)
          }
          break
        }
      }

      onChange?.(newValue)
    },
    [mode, value, enableTime, selectedTime, isDateDisabled, onChange],
  )

  // Handle time change
  const handleTimeChange = useCallback(
    (hours: number, minutes: number) => {
      setSelectedTime({ hours, minutes })

      if (value instanceof Date) {
        const newDate = setMinutes(setHours(value, hours), minutes)
        onChange?.(newDate)
      }
    },
    [value, onChange],
  )

  // Handle preset selection
  const handlePresetSelect = useCallback(
    (presetValue: Date | Date[] | DateRange) => {
      onChange?.(presetValue)
      if (mode === 'single' && !enableTime) {
        setIsOpen(false)
      }
    },
    [mode, enableTime, onChange],
  )

  // Clear selection
  const handleClear = useCallback(() => {
    onChange?.(null)
    setInputValue('')
  }, [onChange])

  // Navigation handlers
  const goToPreviousMonth = useCallback(() => {
    const newMonth = subMonths(currentMonth, 1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }, [currentMonth, onMonthChange])

  const goToNextMonth = useCallback(() => {
    const newMonth = addMonths(currentMonth, 1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }, [currentMonth, onMonthChange])

  const goToPreviousYear = useCallback(() => {
    const newMonth = subYears(currentMonth, 1)
    setCurrentMonth(newMonth)
    onYearChange?.(newMonth.getFullYear())
  }, [currentMonth, onYearChange])

  const goToNextYear = useCallback(() => {
    const newMonth = addYears(currentMonth, 1)
    setCurrentMonth(newMonth)
    onYearChange?.(newMonth.getFullYear())
  }, [currentMonth, onYearChange])

  // Get presets for current mode
  const presets = useMemo(() => {
    if (customPresets) return customPresets
    return mode === 'range' ? defaultPresets.range : defaultPresets.single
  }, [mode, customPresets])

  // Render calendar header
  const renderCalendarHeader = () => (
    <div className='flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-700'>
      <div className='flex items-center gap-1'>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={goToPreviousYear}>
          <ChevronLeft className='w-4 h-4' />
          <ChevronLeft className='w-4 h-4 -ml-2' />
        </Button>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={goToPreviousMonth}>
          <ChevronLeft className='w-4 h-4' />
        </Button>
      </div>

      <div className='font-medium'>{format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}</div>

      <div className='flex items-center gap-1'>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={goToNextMonth}>
          <ChevronRight className='w-4 h-4' />
        </Button>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={goToNextYear}>
          <ChevronRight className='w-4 h-4' />
          <ChevronRight className='w-4 h-4 -ml-2' />
        </Button>
      </div>
    </div>
  )

  // Render week days header
  const renderWeekDaysHeader = () => {
    const weekDays = []
    const start = startOfWeek(new Date(), { weekStartsOn })

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i)
      weekDays.push(
        <div key={i} className='text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 p-2'>
          {format(day, 'EEE', { locale: dateLocale })}
        </div>,
      )
    }

    return (
      <div className={cn('grid grid-cols-7', showWeekNumbers && 'grid-cols-8')}>
        {showWeekNumbers && (
          <div className='text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 p-2'>#</div>
        )}
        {weekDays}
      </div>
    )
  }

  // Render calendar grid
  const renderCalendarGrid = () => {
    const weeks: JSX.Element[] = []
    let week: JSX.Element[] = []

    calendarDays.forEach((day, index) => {
      if (showWeekNumbers && index % 7 === 0) {
        // Add week number
        week.push(
          <div key={`week-${index}`} className='text-center text-sm text-neutral-400 p-2'>
            {format(day, 'w')}
          </div>,
        )
      }

      const isCurrentMonth = isSameMonth(day, currentMonth)
      const isSelected = isDateSelected(day)
      const isDisabled = isDateDisabled(day)
      const isTodayDate = isToday(day)
      const isRangeStartDate = isRangeStart(day)
      const isRangeEndDate = isRangeEnd(day)

      week.push(
        <button
          key={day.toISOString()}
          onClick={() => handleDateSelect(day)}
          disabled={isDisabled}
          className={cn(
            'relative w-10 h-10 text-sm rounded-md transition-colors',
            'hover:bg-neutral-100 dark:hover:bg-neutral-700',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            !isCurrentMonth && 'text-neutral-300 dark:text-neutral-600',
            isCurrentMonth && 'text-neutral-900 dark:text-neutral-100',
            isTodayDate && !isSelected && 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300',
            isSelected && 'bg-primary-500 text-white',
            isRangeStartDate && 'rounded-r-none',
            isRangeEndDate && 'rounded-l-none',
            isSelected && mode === 'range' && !isRangeStartDate && !isRangeEndDate && 'rounded-none',
            isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
          )}
        >
          {format(day, 'd')}
          {isTodayDate && !isSelected && (
            <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full' />
          )}
        </button>,
      )

      if ((index + 1) % 7 === 0 || index === calendarDays.length - 1) {
        weeks.push(
          <div
            key={`week-${Math.floor(index / 7)}`}
            className={cn('grid gap-1', showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7')}
          >
            {week}
          </div>,
        )
        week = []
      }
    })

    return <div className='space-y-1 p-3'>{weeks}</div>
  }

  // Render time picker
  const renderTimePicker = () => {
    if (!enableTime) return null

    const hours = Array.from({ length: 24 }, (_, i) => i)
    const minutes = Array.from({ length: 60 }, (_, i) => i)

    return (
      <div className='border-t border-neutral-200 dark:border-neutral-700 p-3'>
        <div className='flex items-center gap-2 mb-3'>
          <Clock className='w-4 h-4 text-neutral-500' />
          <span className='text-sm font-medium'>Saat</span>
        </div>

        <div className='flex items-center gap-2'>
          <Select
            value={selectedTime.hours.toString()}
            onValueChange={(value) => handleTimeChange(parseInt(value), selectedTime.minutes)}
          >
            <SelectTrigger className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour.toString()}>
                  {hour.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className='text-neutral-500'>:</span>

          <Select
            value={selectedTime.minutes.toString()}
            onValueChange={(value) => handleTimeChange(selectedTime.hours, parseInt(value))}
          >
            <SelectTrigger className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {minutes
                .filter((minute) => minute % 5 === 0)
                .map((minute) => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {enableTimezone && (
          <div className='mt-3'>
            <div className='flex items-center gap-2 mb-2'>
              <Globe className='w-4 h-4 text-neutral-500' />
              <span className='text-sm font-medium'>Zaman Dilimi</span>
            </div>
            <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    )
  }

  // Render presets
  const renderPresets = () => {
    if (!enablePresets || !presets.length) return null

    return (
      <div className='border-r border-neutral-200 dark:border-neutral-700 w-48 p-3'>
        <div className='text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300'>Hızlı Seçim</div>
        <div className='space-y-1'>
          {presets.map((preset, index) => (
            <Button
              key={index}
              variant='ghost'
              size='sm'
              className='w-full justify-start h-8 px-2'
              onClick={() => handlePresetSelect(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  // Render footer
  const renderFooter = () => (
    <div className='border-t border-neutral-200 dark:border-neutral-700 p-3 flex items-center justify-between'>
      <div className='text-sm text-neutral-500 dark:text-neutral-400'>
        {mode === 'multiple' && Array.isArray(value) && <span>{value.length} tarih seçildi</span>}
        {mode === 'range' && value && typeof value === 'object' && 'from' in value && (
          <span>
            {(value as DateRange).from && (value as DateRange).to
              ? `${Math.ceil(((value as DateRange).to!.getTime() - (value as DateRange).from!.getTime()) / (1000 * 60 * 60 * 24) + 1)} gün`
              : 'Bitiş tarihi seçin'}
          </span>
        )}
      </div>

      <div className='flex items-center gap-2'>
        {clearable && value && (
          <Button variant='ghost' size='sm' onClick={handleClear}>
            Temizle
          </Button>
        )}
        <Button size='sm' onClick={() => setIsOpen(false)}>
          {enableTime ? 'Tamam' : 'Kapat'}
        </Button>
      </div>
    </div>
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant='outline'
          className={cn(
            'justify-start text-left font-normal',
            !value && 'text-neutral-500 dark:text-neutral-400',
            className,
          )}
          disabled={disabled}
          onClick={() => !readOnly && setIsOpen(true)}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <CalendarIcon className='mr-2 h-4 w-4 shrink-0' />
          <span className='truncate'>{inputValue || placeholder}</span>
          {clearable && value && !disabled && !readOnly && (
            <X
              className='ml-auto h-4 w-4 shrink-0 opacity-50 hover:opacity-100'
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-0' align='start' sideOffset={8}>
        <div className={cn('flex', enablePresets && 'min-w-[600px]')}>
          {renderPresets()}

          <div className='flex-1'>
            {renderCalendarHeader()}
            {renderWeekDaysHeader()}
            {renderCalendarGrid()}
            {renderTimePicker()}
            {renderFooter()}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Helper functions for creating specific date pickers
export function createSingleDatePicker(props: Partial<DatePickerProps> = {}) {
  return <DatePicker mode='single' {...props} />
}

export function createDateRangePicker(props: Partial<DatePickerProps> = {}) {
  return <DatePicker mode='range' enablePresets={true} {...props} />
}

export function createMultipleDatePicker(props: Partial<DatePickerProps> = {}) {
  return <DatePicker mode='multiple' {...props} />
}

export function createDateTimePicker(props: Partial<DatePickerProps> = {}) {
  return <DatePicker mode='single' enableTime={true} {...props} />
}

// Usage example component
export function DatePickerExample() {
  const [singleDate, setSingleDate] = useState<Date | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | null>(null)
  const [multipleDates, setMultipleDates] = useState<Date[]>([])

  return (
    <div className='space-y-6 p-6'>
      <div>
        <label className='block text-sm font-medium mb-2'>Tek Tarih</label>
        <DatePicker
          mode='single'
          value={singleDate}
          onChange={(date) => setSingleDate(date as Date)}
          placeholder='Tarih seçin'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Tarih Aralığı</label>
        <DatePicker
          mode='range'
          value={dateRange}
          onChange={(range) => setDateRange(range as DateRange)}
          placeholder='Tarih aralığı seçin'
          enablePresets={true}
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Çoklu Tarih</label>
        <DatePicker
          mode='multiple'
          value={multipleDates}
          onChange={(dates) => setMultipleDates(dates as Date[])}
          placeholder='Tarihleri seçin'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Tarih ve Saat</label>
        <DatePicker
          mode='single'
          enableTime={true}
          value={singleDate}
          onChange={(date) => setSingleDate(date as Date)}
          placeholder='Tarih ve saat seçin'
        />
      </div>
    </div>
  )
}
