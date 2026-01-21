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
                // Default menu items if none exist
                setMenu([
                    { id: '1', label: 'Home', href: '/' },
                    { id: '2', label: 'Custom Packaging', href: '/products' },
                    { id: '3', label: 'Box By Style', href: '/box-styles' },
                    { id: '4', label: 'Packaging Material', href: '/materials' },
                    { id: '5', label: 'Custom Printing', href: '/printing' },
                    { id: '6', label: 'Contact Us', href: '/contact' },
                ])
            }
        } catch (error) {
            console.error("Error fetching menu:", error)
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
            console.error("Error saving menu:", error)
            alert("Error saving settings")
        } finally {
            setSaving(false)
        }
    }

    const addMenuItem = () => {
        const newItem: MenuItem = {
            id: Date.now().toString(),
            label: 'New Link',
            href: '/',
        }
        setMenu([...menu, newItem])
    }

    const removeMenuItem = (id: string) => {
        setMenu(menu.filter(item => item.id !== id))
    }

    const updateMenuItem = (id: string, field: keyof MenuItem, value: any) => {
        setMenu(menu.map(item => item.id === id ? { ...item, [field]: value } : item))
    }

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
                    <p className="text-muted-foreground">
                        Manage the links shown in your website's main navigation.
                    </p>
                </div>
                <Button onClick={saveMenu} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Save Menu
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Main Navigation Links</CardTitle>
                    <CardDescription>Add or remove links from the navbar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        {menu.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border group">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Label</Label>
                                        <Input
                                            value={item.label}
                                            onChange={(e) => updateMenuItem(item.id, 'label', e.target.value)}
                                            placeholder="e.g. Products"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Link (URL)</Label>
                                        <Input
                                            value={item.href}
                                            onChange={(e) => updateMenuItem(item.id, 'href', e.target.value)}
                                            placeholder="e.g. /products"
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeMenuItem(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <Button onClick={addMenuItem} variant="outline" className="w-full border-dashed">
                        <Plus className="mr-2 h-4 w-4" /> Add New Menu Item
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
