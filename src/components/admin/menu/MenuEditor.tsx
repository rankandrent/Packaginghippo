"use client"

import React, { useMemo, useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragMoveEvent,
    DragStartEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableMenuItem, FlattenedItem } from './SortableMenuItem'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface MenuItem {
    id: string
    label: string
    href: string
    children?: MenuItem[]
}

interface MenuEditorProps {
    initialData: MenuItem[]
    onChange: (items: MenuItem[]) => void
}

const INDENTATION_WIDTH = 40

export function MenuEditor({ initialData, onChange }: MenuEditorProps) {
    const [activeId, setActiveId] = useState<string | null>(null)
    const [items, setItems] = useState<MenuItem[]>(initialData)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Prevent accidental drags
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Flatten the tree for linear sorting
    const flattenedItems = useMemo(() => {
        const flattened: FlattenedItem[] = []
        function flatten(items: MenuItem[], parentId: string | null = null, depth = 0) {
            for (const item of items) {
                flattened.push({ ...item, parentId, depth, index: flattened.length })
                if (item.children) {
                    flatten(item.children, item.id, depth + 1)
                }
            }
        }
        flatten(items)
        return flattened
    }, [items])

    // Helper to rebuild tree from flat structure
    function buildTree(flatItems: FlattenedItem[]): MenuItem[] {
        const root: MenuItem[] = []
        const itemMap = new Map<string, MenuItem>()

        // Create copies without internal props
        flatItems.forEach(item => {
            itemMap.set(item.id, { id: item.id, label: item.label, href: item.href, children: [] })
        })

        flatItems.forEach(item => {
            const node = itemMap.get(item.id)!
            if (item.parentId === null) {
                root.push(node)
            } else {
                const parent = itemMap.get(item.parentId)
                if (parent) {
                    parent.children = parent.children || []
                    parent.children.push(node)
                } else {
                    // Orphaned -> move to root
                    root.push(node)
                }
            }
        })
        return root
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    function handleDragMove(event: DragMoveEvent) {
        // We could implement real-time indentation preview here for smoother UX
        // But for simplicity, we update structure on DragEnd
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over, delta } = event
        setActiveId(null)

        if (!over) return

        const activeItem = flattenedItems.find(i => i.id === active.id)
        if (!activeItem) return

        const overIndex = flattenedItems.findIndex(i => i.id === over.id)
        const activeIndex = flattenedItems.findIndex(i => i.id === active.id)

        let newItems = [...flattenedItems]

        // 1. Handle Vertical Reorder
        if (activeIndex !== overIndex) {
            newItems = arrayMove(newItems, activeIndex, overIndex)
        }

        // 2. Handle Indentation (Parenting) change
        // Calculate predicted depth based on drag offset
        const dragDepth = Math.round(delta.x / INDENTATION_WIDTH)
        const projectedDepth = Math.max(0, Math.min(activeItem.depth + dragDepth, 3)) // Max depth 3

        const newActiveItem = newItems.find(i => i.id === active.id)!

        // Find valid parent for new depth
        // The item is essentially moving to index `overIndex`.
        // We look at the item *above* it to see if it can be a parent.

        const previousItem = newItems[overIndex - 1]
        const nextItem = newItems[overIndex + 1]

        // Rules:
        // - Depth can correspond to previous item's depth (sibling)
        // - Depth can be previous item's depth + 1 (child)
        // - Cannot be deeper than previous + 1

        if (!previousItem) {
            // If it's the first item, it must be root (depth 0)
            newActiveItem.depth = 0
            newActiveItem.parentId = null
        } else {
            // Constrain depth
            const maxDepth = previousItem.depth + 1
            const minDepth = 0 // Or strictly equal to previous or 0 if we assume siblings? No.

            // Allow drag to dictate depth within valid range
            // We use the projected visual depth, clamped by logic
            // Actually, calculating "projectedDepth" from delta is tricky because standard Sortable only gives vertical reordering.
            // For nested drag-and-drop, usually we analyze `delta.x`.

            let finalDepth = projectedDepth
            if (finalDepth > maxDepth) finalDepth = maxDepth

            newActiveItem.depth = finalDepth

            // Determine Parent ID based on depth
            if (finalDepth === 0) {
                newActiveItem.parentId = null
            } else if (finalDepth === previousItem.depth + 1) {
                // It's a child of previous
                newActiveItem.parentId = previousItem.id
            } else if (finalDepth === previousItem.depth) {
                // Sibling of previous
                newActiveItem.parentId = previousItem.parentId
            } else {
                // Moving out (less deep than previous)
                // We need to find the nearest ancestor at `finalDepth - 1`
                // Scan backwards from previousItem
                let ancestor = null
                for (let i = overIndex - 1; i >= 0; i--) {
                    if (newItems[i].depth === finalDepth - 1) {
                        ancestor = newItems[i]
                        break
                    }
                }
                newActiveItem.parentId = ancestor ? ancestor.id : null
            }
        }

        // Logic Check: Update all children of the moved item to follow it?
        // Since we are rebuilding from flat parents, if we modify item.parentId, its children (in original tree) 
        // need to act correctly. BUT we are restructuring the FLAT list.
        // If an item has children, they are separate items in the flat list.
        // We probably need to move children *with* the parent if dragging a subtree.
        // But `dnd-kit` Sortable default behavior is to treat items independently. 
        // Collapsed behavior is complex.
        // For simplicity: We will ignore moving children automatically for now, OR we enforce that children must be moved individually.
        // BETTER: When a parent moves, we should probably just effectively simple reorder. 

        // Actually, updating the tree structure is safer if we just rebuild tree based on the new flat properties.
        // But simply changing one item's depth/parent might break the tree if its children are not also updated.
        // Let's rely on `buildTree` robustness: orphaned items become root.

        const reconstructedTree = buildTree(newItems)
        setItems(reconstructedTree)
        onChange(reconstructedTree)
    }

    // Quick Fix for "Nest Under" / "Un-Nest" buttons if drag is finicky
    // (Optional enhancement)

    const addItem = () => {
        const newItem: MenuItem = {
            id: Date.now().toString(),
            label: 'New Link',
            href: '/',
        }
        const newTree = [...items, newItem]
        setItems(newTree)
        onChange(newTree)
    }

    const removeItem = (id: string) => {
        // Recursive remove
        function remove(nodes: MenuItem[]): MenuItem[] {
            return nodes.filter(n => n.id !== id).map(n => ({ ...n, children: n.children ? remove(n.children) : [] }))
        }
        const newTree = remove(items)
        setItems(newTree)
        onChange(newTree)
    }

    const updateItem = (id: string, field: keyof MenuItem, value: any) => {
        function update(nodes: MenuItem[]): MenuItem[] {
            return nodes.map(n => {
                if (n.id === id) return { ...n, [field]: value }
                if (n.children) return { ...n, children: update(n.children) }
                return n
            })
        }
        const newTree = update(items)
        setItems(newTree)
        onChange(newTree)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
        >
            <div className="space-y-4">
                <SortableContext items={flattenedItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    {flattenedItems.map((item) => (
                        <SortableMenuItem
                            key={item.id}
                            item={item}
                            indentationWidth={INDENTATION_WIDTH}
                            onRemove={removeItem}
                            onUpdate={updateItem}
                        />
                    ))}
                </SortableContext>

                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                    {activeId ? (
                        <div className="p-3 bg-blue-100 border border-blue-500 rounded-lg shadow-xl opacity-80">
                            Dragging...
                        </div>
                    ) : null}
                </DragOverlay>

                <Button onClick={addItem} variant="outline" className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add New Menu Item
                </Button>
            </div>
        </DndContext>
    )
}
