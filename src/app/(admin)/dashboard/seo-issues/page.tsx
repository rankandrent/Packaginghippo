"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, Loader2, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function SeoIssuesPage() {
    const [issues, setIssues] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchIssues()
    }, [])

    async function fetchIssues() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/seo-audit')
            const data = await res.json()
            setIssues(data.issues || [])
        } catch (error) {
            console.error("Error fetching SEO issues:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tight">SEO Health Auditor</h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Manage and fix metadata issues across your live site
                    </p>
                </div>
                <Badge variant="outline" className="text-blue-900 border-blue-900 font-bold uppercase py-1 px-4">
                    {issues.length} Issues Found
                </Badge>
            </div>

            {loading ? (
                <div className="flex justify-center py-20 bg-white rounded-3xl border border-dashed">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-900" />
                </div>
            ) : issues.length === 0 ? (
                <Card className="border-2 border-green-100 bg-green-50/30 overflow-hidden text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                        <div>
                            <h3 className="text-2xl font-black text-green-900 uppercase tracking-tight">SEO Health is Perfect!</h3>
                            <p className="text-sm font-medium text-green-700 mt-2">All your live pages have optimized metadata titles and descriptions.</p>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.map((issue, idx) => (
                        <Card key={idx} className="group hover:shadow-2xl hover:-translate-y-1 transition-all border-none shadow-sm overflow-hidden bg-white">
                            <div className="h-1.5 bg-red-500 w-full" />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge className="bg-red-100 text-red-700 border-none font-bold uppercase text-[10px]">
                                        {issue.type}
                                    </Badge>
                                    <Link href={issue.editUrl} className="text-blue-900 hover:text-blue-700">
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                <CardTitle className="text-lg font-black text-blue-900 truncate uppercase mt-2">
                                    {issue.name}
                                </CardTitle>
                                <p className="text-xs font-bold text-gray-400 truncate tracking-tight lowercase mt-1">
                                    slug: /{issue.slug}
                                </p>
                            </CardHeader>
                            <CardContent className="pt-4 mt-auto">
                                <div className="space-y-4">
                                    <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                                        <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <AlertTriangle className="h-3 w-3" /> Missing Fields
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {issue.missing.map((field: string) => (
                                                <span key={field} className="text-[9px] font-black bg-white text-red-600 px-2 py-1 rounded-md border border-red-200 uppercase">
                                                    {field}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <Link
                                        href={issue.editUrl}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 bg-blue-900 text-white rounded-xl text-xs font-black uppercase hover:bg-blue-800 transition-colors"
                                    >
                                        Fix SEO Issue <FileText className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Educational Section */}
            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 mt-12">
                <div className="flex gap-6 items-start">
                    <div className="p-3 bg-blue-900 text-white rounded-2xl">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-blue-900 uppercase">Why is this important?</h3>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-3xl">
                            Meta Titles and Descriptions are the first thing users see on Google. Missing metadata causes Google to "guess" your content, which often leads to lower click-through rates and poor search rankings. Fixing these alerts ensures your brand looks professional and ranks higher.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
