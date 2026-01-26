"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2, GripVertical, Save } from "lucide-react"

export const dynamic = 'force-dynamic';

type MenuItem = {
    id: string
    label: string
    href: string
    isNewTab?: boolean
}

import { MenuEditor } from "@/components/admin/menu/MenuEditor"

// ... imports remain ... // remove GripVertical, Input, Label usage if not needed inside Page directly

export default function MenuSettingsPage() {
    const [menu, setMenu] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchMenu()
    }, [])

    async function fetchMenu() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/settings?key=menu')
            const data = await res.json()
            if (data.setting?.value) {
                setMenu(data.setting.value)
            } else {
                setMenu([
                    { id: '1', label: 'Home', href: '/' },
                    { id: '2', label: 'Custom Packaging', href: '/products' },
                    { id: '3', label: 'Contact Us', href: '/contact' },
                ])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function saveMenu() {
        try {
            setSaving(true)
            const res = await fetch('/api/cms/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'menu', value: menu }),
            })

            if (!res.ok) throw new Error('Failed to save')
            alert("Menu settings saved!")
        } catch (error) {
            console.error(error)
            alert("Error saving settings")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
                    <p className="text-muted-foreground">Manage navigation links. Drag to reorder, drag right to nest.</p>
                </div>
                <Button onClick={saveMenu} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Save Menu
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Main Navigation Links</CardTitle>
                    <CardDescription>Drag items to reorder. Drag item to the right to make it a sub-menu of the item above.</CardDescription>
                </CardHeader>
                <CardContent>
                    <MenuEditor initialData={menu} onChange={setMenu} />
                </CardContent>
            </Card>
        </div>
    )
}
