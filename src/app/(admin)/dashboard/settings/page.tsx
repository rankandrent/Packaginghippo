
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

type Settings = {
    site_name: string
    contact_email: string
    contact_phone?: string
    address?: string
    default_meta_title?: string
    default_meta_description?: string
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        site_name: "",
        contact_email: ""
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("cms_settings")
                .select("value")
                .eq("key", "general")
                .single()

            if (error && error.code !== 'PGRST116') throw error // Ignore not found

            if (data) {
                setSettings(data.value)
            }
        } catch (error) {
            console.error("Error fetching settings:", error)
        } finally {
            setLoading(false)
        }
    }

    async function saveSettings(e: React.FormEvent) {
        e.preventDefault()
        try {
            setSaving(true)
            const { error } = await supabase
                .from("cms_settings")
                .upsert({
                    key: "general",
                    value: settings,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'key' })

            if (error) throw error
            alert("Settings saved!")
        } catch (error) {
            console.error("Error saving settings:", error)
            alert("Error saving settings")
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (key: keyof Settings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
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
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage global site configuration and default SEO settings.
                </p>
            </div>

            <form onSubmit={saveSettings}>
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>Contact info displayed in footer/header.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="site_name">Site Name</Label>
                                    <Input
                                        id="site_name"
                                        value={settings.site_name}
                                        onChange={(e) => handleChange("site_name", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_email">Contact Email</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={settings.contact_email}
                                        onChange={(e) => handleChange("contact_email", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_phone">Phone Number</Label>
                                    <Input
                                        id="contact_phone"
                                        value={settings.contact_phone || ""}
                                        onChange={(e) => handleChange("contact_phone", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={settings.address || ""}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Default SEO</CardTitle>
                            <CardDescription>Fallback meta tags when not defined on specific pages.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="default_meta_title">Default Meta Title</Label>
                                <Input
                                    id="default_meta_title"
                                    value={settings.default_meta_title || ""}
                                    onChange={(e) => handleChange("default_meta_title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="default_meta_description">Default Meta Description</Label>
                                <Input
                                    id="default_meta_description"
                                    value={settings.default_meta_description || ""}
                                    onChange={(e) => handleChange("default_meta_description", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Settings
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
