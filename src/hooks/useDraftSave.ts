"use client"

import { useCallback, useState } from 'react'

export type DraftEntry<T> = {
    data: T
    savedAt: string // ISO timestamp
}

export function useDraftSave<T>(key: string) {
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

    const saveDraft = useCallback((data: T) => {
        try {
            const entry: DraftEntry<T> = { data, savedAt: new Date().toISOString() }
            localStorage.setItem(key, JSON.stringify(entry))
            setLastSavedAt(new Date())
        } catch {
            // localStorage unavailable or full — silently ignore
        }
    }, [key])

    const getDraft = useCallback((): DraftEntry<T> | null => {
        try {
            const raw = localStorage.getItem(key)
            return raw ? (JSON.parse(raw) as DraftEntry<T>) : null
        } catch {
            return null
        }
    }, [key])

    const clearDraft = useCallback(() => {
        try { localStorage.removeItem(key) } catch {}
        setLastSavedAt(null)
    }, [key])

    return { saveDraft, getDraft, clearDraft, lastSavedAt }
}

/** Human-readable relative time: "2 minutes ago", "just now" */
export function formatDraftAge(savedAt: string): string {
    const diffMs = Date.now() - new Date(savedAt).getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return 'just now'
    if (mins === 1) return '1 minute ago'
    if (mins < 60) return `${mins} minutes ago`
    const hrs = Math.floor(mins / 60)
    if (hrs === 1) return '1 hour ago'
    return `${hrs} hours ago`
}
