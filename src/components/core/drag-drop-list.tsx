'use client'

import React, { useCallback, useState } from 'react'

import { GripVertical, Trash2 } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult, DroppableStateSnapshot } from 'react-beautiful-dnd'

import { Button } from './button'

import { cn } from '@/lib/utils'

export interface DragDropItem {
  id: string
  content: React.ReactNode
}

export interface DragDropListProps {
  items: DragDropItem[]
  onReorder: (items: DragDropItem[]) => void
  onRemove?: (id: string) => void
  droppableId?: string
  className?: string
  itemClassName?: string
  isDragDisabled?: boolean
  showDragHandle?: boolean
  showRemoveButton?: boolean
  renderItem?: (item: DragDropItem, index: number) => React.ReactNode
}

export function DragDropList({
  items,
  onReorder,
  onRemove,
  droppableId = 'droppable-list',
  className,
  itemClassName,
  isDragDisabled = false,
  showDragHandle = true,
  showRemoveButton = true,
  renderItem,
}: DragDropListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      setActiveId(null)
      const { source, destination } = result

      // Geçersiz drop
      if (!destination) return

      // Aynı pozisyona drop
      if (destination.index === source.index) return

      // Sıralamayı güncelle
      const newItems = Array.from(items)
      const [removed] = newItems.splice(source.index, 1)
      newItems.splice(destination.index, 0, removed)

      onReorder(newItems)
    },
    [items, onReorder],
  )

  const handleDragStart = useCallback((result: any) => {
    setActiveId(result.draggableId)
  }, [])

  const handleRemove = useCallback(
    (id: string) => {
      if (onRemove) {
        onRemove(id)
      }
    },
    [onRemove],
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot: DroppableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'space-y-2',
              snapshot.isDraggingOver && 'bg-primary-50/50 dark:bg-primary-900/10 rounded-lg p-2',
              className,
            )}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isDragDisabled}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      'flex items-center p-3 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
                      snapshot.isDragging && 'shadow-lg border-primary-300 dark:border-primary-700',
                      activeId === item.id && 'border-primary-400 dark:border-primary-600',
                      itemClassName,
                    )}
                  >
                    {showDragHandle && (
                      <div
                        {...provided.dragHandleProps}
                        className='flex-shrink-0 mr-3 cursor-grab text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                      >
                        <GripVertical className='h-5 w-5' />
                      </div>
                    )}

                    <div className='flex-1'>{renderItem ? renderItem(item, index) : <div>{item.content}</div>}</div>

                    {showRemoveButton && onRemove && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='flex-shrink-0 ml-2 h-8 w-8 p-0 rounded-full text-neutral-400 hover:text-red-500'
                        onClick={() => handleRemove(item.id)}
                        aria-label='Kaldır'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

// Kullanım örneği
export function DragDropListExample() {
  const [items, setItems] = useState<DragDropItem[]>([
    { id: '1', content: 'Öğe 1' },
    { id: '2', content: 'Öğe 2' },
    { id: '3', content: 'Öğe 3' },
    { id: '4', content: 'Öğe 4' },
  ])

  const handleReorder = useCallback((newItems: DragDropItem[]) => {
    setItems(newItems)
  }, [])

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return (
    <div className='p-4 max-w-md mx-auto'>
      <h2 className='text-lg font-medium mb-4'>Sıralamayı Değiştir</h2>
      <DragDropList items={items} onReorder={handleReorder} onRemove={handleRemove} />
    </div>
  )
}
