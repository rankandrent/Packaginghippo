"use client"

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface MenuItem {
    id: string
    label: string
    href: string
    children?: MenuItem[]
}

// Flattened item for the sortable list
export interface FlattenedItem extends MenuItem {
    parentId: string | null
    depth: number
    index: number
}

interface SortableMenuItemProps {
    item: FlattenedItem
    onRemove: (id: string) => void
    onUpdate: (id: string, field: keyof MenuItem, value: any) => void
    indentationWidth: number
}

export function SortableMenuItem({
    item,
    onRemove,
    onUpdate,
    indentationWidth,
}: SortableMenuItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        marginLeft: `${item.depth * indentationWidth}px`,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-2 mb-2 p-3 bg-white border rounded-lg shadow-sm group",
                isDragging && "opacity-50 z-50 shadow-xl border-blue-500 bg-blue-50"
            )}
        >
            <div {...attributes} {...listeners} className="cursor-move p-1 text-gray-400 hover:text-gray-600">
                <GripVertical className="h-5 w-5" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Label</Label>
                    <Input
                        value={item.label}
                        onChange={(e) => onUpdate(item.id, 'label', e.target.value)}
                        className="h-8"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">URL</Label>
                    <Input
                        value={item.href}
                        onChange={(e) => onUpdate(item.id, 'href', e.target.value)}
                        className="h-8"
                    />
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}
