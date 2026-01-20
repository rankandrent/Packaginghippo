"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save } from "lucide-react"

type GeneralSettings = {
    siteName: string
    tagline: string
    phone: string
    email: string
    address: string
    logoUrl: string
}

type SeoSettings = {
    defaultTitle: string
    defaultDescription: string
    defaultKeywords: string
    ogImage: string
}

export default function SettingsPage() {
    const [general, setGeneral] = useState<GeneralSettings>({
        siteName: '',
        tagline: '',
        phone: '',
        email: '',
        address: '',
        logoUrl: '',
    })
    const [seo, setSeo] = useState<SeoSettings>({
        defaultTitle: '',
        defaultDescription: '',
        defaultKeywords: '',
        ogImage: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/settings')
            const data = await res.json()

            data.settings?.forEach((s: any) => {
                if (s.key === 'general') setGeneral(s.value)
                if (s.key === 'seo') setSeo(s.value)
            })
        } catch (error) {
            console.error("Error fetching settings:", error)
        } finally {
            setLoading(false)
        }
    }

    async function saveSettings(key: string, value: any) {
        try {
            setSaving(key)
            const res = await fetch('/api/cms/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            })

            if (!res.ok) throw new Error('Failed to save')
            alert(`${key} settings saved!`)
        } catch (error) {
            console.error("Error saving settings:", error)
            alert("Error saving settings")
        } finally {
            setSaving(null)
        }
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
                    Manage global site configuration and SEO. Data stored in MongoDB.
                </p>
            </div>

            {/* General Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Site identity and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Site Name</Label>
                            <Input
                                value={general.siteName}
                                onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tagline</Label>
                            <Input
                                value={general.tagline}
                                onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                                value={general.phone}
                                onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={general.email}
                                onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Address</Label>
                            <Input
                                value={general.address}
                                onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Logo URL</Label>
                            <Input
                                value={general.logoUrl}
                                onChange={(e) => setGeneral({ ...general, logoUrl: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button
                        onClick={() => saveSettings('general', general)}
                        disabled={saving === 'general'}
                    >
                        {saving === 'general' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" /> Save General Settings
                    </Button>
                </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>Default meta tags for all pages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Default Meta Title</Label>
                        <Input
                            value={seo.defaultTitle}
                            onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Default Meta Description</Label>
                        <Textarea
                            value={seo.defaultDescription}
                            onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Default Keywords</Label>
                        <Input
                            value={seo.defaultKeywords}
                            onChange={(e) => setSeo({ ...seo, defaultKeywords: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>OG Image URL</Label>
                        <Input
                            value={seo.ogImage}
                            onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                        />
                    </div>
                    <Button
                        onClick={() => saveSettings('seo', seo)}
                        disabled={saving === 'seo'}
                    >
                        {saving === 'seo' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" /> Save SEO Settings
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
