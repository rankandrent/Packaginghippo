"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Link as LinkIcon, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"

interface Redirect {
    id: string
    sourceUrl: string
    targetUrl: string
    type: number
    isActive: boolean
    createdAt: string
}

export default function RedirectsPage() {
    const [redirects, setRedirects] = useState<Redirect[]>([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        sourceUrl: "",
        targetUrl: "",
        type: "301"
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchRedirects()
    }, [])

    async function fetchRedirects() {
        try {
            const res = await fetch('/api/redirects')
            const data = await res.json()
            setRedirects(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch('/api/redirects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setFormData({ sourceUrl: "", targetUrl: "", type: "301" })
                fetchRedirects()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this redirect?")) return
        try {
            await fetch(`/api/redirects?id=${id}`, { method: 'DELETE' })
            setRedirects(prev => prev.filter(r => r.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-lg">
                    <LinkIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">URL Redirection Manager</h1>
                    <p className="text-gray-500">Manage 301 and 302 redirects for site migrations and SEO.</p>
                </div>
            </div>

            {/* Add New Redirect Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Add New Redirect
                </h2>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="text-sm font-medium mb-1 block">Old URL (Source)</label>
                        <Input
                            placeholder="/old-page"
                            value={formData.sourceUrl}
                            onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-center md:col-span-0.5 self-center pb-2">
                        <ArrowRight className="text-gray-400" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-sm font-medium mb-1 block">New URL (Target)</label>
                        <Input
                            placeholder="/new-page"
                            value={formData.targetUrl}
                            onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                            required
                        />
                    </div>
                    <div className="md:col-span-0.5">
                        <label className="text-sm font-medium mb-1 block">Type</label>
                        <Select
                            value={formData.type}
                            onValueChange={(val) => setFormData({ ...formData, type: val })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="301">301 (Permanent)</SelectItem>
                                <SelectItem value="302">302 ( Temporary)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-1">
                        <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700">
                            {submitting ? "Adding..." : "Add Redirect"}
                        </Button>
                    </div>
                </form>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Redirects propagate instantly. Make sure to use relative paths (e.g., /about-us).
                </p>
            </div>

            {/* List Redirects */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Source URL</TableHead>
                            <TableHead>Target URL</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Loading redirects...</TableCell>
                            </TableRow>
                        ) : redirects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">No redirects found.</TableCell>
                            </TableRow>
                        ) : (
                            redirects.map((redirect) => (
                                <TableRow key={redirect.id}>
                                    <TableCell className="font-medium text-red-600">{redirect.sourceUrl}</TableCell>
                                    <TableCell className="text-green-600 flex items-center gap-2">
                                        <ArrowRight className="w-4 h-4 text-gray-300" />
                                        {redirect.targetUrl}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${redirect.type === 301 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {redirect.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {new Date(redirect.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(redirect.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
