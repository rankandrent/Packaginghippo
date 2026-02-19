"use client"

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface LayoutSorterProps {
    items: string[]
    onChange: (items: string[]) => void
}

const SECTION_LABELS: Record<string, string> = {
    'content': 'Category Content (Description)',
    'related_categories': 'Related Categories',
    'quote_form': 'Quote Form',
    'testimonials': 'Testimonials',
    'faqs': 'FAQ Sections'
}

export function LayoutSorter({ items, onChange }: LayoutSorterProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = items.indexOf(active.id as string);
            const newIndex = items.indexOf(over?.id as string);
            onChange(arrayMove(items, oldIndex, newIndex));
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {items.map((id) => (
                        <SortableItem key={id} id={id} label={SECTION_LABELS[id] || id} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}

function SortableItem({ id, label }: { id: string, label: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="p-3 flex items-center gap-3 bg-white hover:border-blue-500 transition-colors cursor-grab active:cursor-grabbing border-l-4 border-l-gray-300">
                <div {...attributes} {...listeners} className="text-gray-400 hover:text-gray-600">
                    <GripVertical className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm text-gray-700">{label}</span>
            </Card>
        </div>
    )
}
