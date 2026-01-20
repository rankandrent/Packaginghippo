
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SEOSettingsProps {
    title: string | null
    description: string | null
    jsonSchema: string | null
    onChange: (key: string, value: string) => void
}

export function SEOSettings({ title, description, jsonSchema, onChange }: SEOSettingsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="seo-title">Meta Title</Label>
                <Input
                    id="seo-title"
                    value={title || ""}
                    onChange={(e) => onChange("seo_title", e.target.value)}
                    placeholder="Page title for search engines"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="seo-description">Meta Description</Label>
                <Textarea
                    id="seo-description"
                    value={description || ""}
                    onChange={(e) => onChange("meta_description", e.target.value)}
                    placeholder="Brief summary of the page content"
                    rows={4}
                />
            </div>
            {/* JSON Schema - Advanced */}
            {/* <div className="space-y-2">
                <Label htmlFor="seo-schema">Schema JSON (Structured Data)</Label>
                <Textarea
                    id="seo-schema"
                    value={jsonSchema || ""}
                    onChange={(e) => onChange("schema_json", e.target.value)}
                    placeholder="{ '@context': 'https://schema.org', ... }"
                    className="font-mono text-xs"
                    rows={6}
                />
            </div> */}
        </div>
    )
}
