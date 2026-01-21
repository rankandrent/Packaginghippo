"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, Trash2, Eye, MapPin, X, Phone, Mail, Clock, FileText, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type Inquiry = {
    id: string
    name: string
    email: string
    phone?: string
    message?: string
    type: string
    sourcePage: string
    sourceUrl: string
    status: string
    details?: any
    createdAt: string
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        fetchInquiries()
    }, [])

    async function fetchInquiries() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/inquiries')
            const data = await res.json()
            setInquiries(data || [])
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    async function deleteInquiry(id: string) {
        if (!confirm("Delete this inquiry?")) return
        await fetch(`/api/cms/inquiries?id=${id}`, { method: 'DELETE' })
        setInquiries(inquiries.filter(i => i.id !== id))
        if (selectedInquiry?.id === id) setSelectedInquiry(null)
    }

    async function updateStatus(id: string, newStatus: string) {
        setIsUpdating(true)
        try {
            const res = await fetch('/api/cms/inquiries', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            })
            if (res.ok) {
                const updated = await res.json()
                setInquiries(inquiries.map(i => i.id === id ? updated : i))
                if (selectedInquiry?.id === id) setSelectedInquiry(updated)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsUpdating(false)
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leads & Inquiries</h2>
                    <p className="text-muted-foreground">Track all form submissions across the website.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-muted-foreground">Total Leads</div>
                        <div className="text-2xl font-bold">{inquiries.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-muted-foreground">Recent (24h)</div>
                        <div className="text-2xl font-bold">
                            {inquiries.filter(i => new Date(i.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-muted-foreground">Pending Quote Requests</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {inquiries.filter(i => i.type === 'quote' && i.status === 'PENDING').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Source Page</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inquiries.map((iq) => (
                                <TableRow key={iq.id}>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(iq.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-sm">{iq.name}</div>
                                        <div className="text-[10px] text-muted-foreground">{iq.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                            iq.type === 'quote' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                                        )}>
                                            {iq.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 max-w-[150px]">
                                            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                                            <span className="text-xs truncate">{iq.sourcePage || 'Direct'}</span>
                                            {iq.sourceUrl && (
                                                <a href={iq.sourceUrl} target="_blank" className="text-blue-500 hover:text-blue-700 shrink-0">
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                            iq.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                                        )}>
                                            {iq.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => setSelectedInquiry(iq)}><Eye className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => deleteInquiry(iq.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {inquiries.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        No inquiries recorded yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Inquiry Detail Modal */}
            <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between pr-8">
                            <span className="text-xl font-bold uppercase tracking-tight">Inquiry Details</span>
                            <Badge className={cn(
                                "uppercase text-[10px]",
                                selectedInquiry?.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                            )}>
                                {selectedInquiry?.status}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedInquiry && (
                        <div className="space-y-8 pt-4">
                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                        <User className="w-3 h-3" /> Customer Name
                                    </p>
                                    <p className="font-semibold text-sm">{selectedInquiry.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </p>
                                    <p className="font-semibold text-sm text-blue-600 truncate">{selectedInquiry.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                        <Phone className="w-3 h-3" /> Phone Number
                                    </p>
                                    <p className="font-semibold text-sm">{selectedInquiry.phone || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                        <Clock className="w-3 h-3" /> Submitted On
                                    </p>
                                    <p className="font-semibold text-sm">
                                        {new Date(selectedInquiry.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Source Info */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Traffic Source</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Page Name</p>
                                        <p className="text-sm font-medium">{selectedInquiry.sourcePage}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Exact URL</p>
                                        <a href={selectedInquiry.sourceUrl} target="_blank" className="text-xs text-blue-500 flex items-center gap-1 hover:underline truncate">
                                            Visit Source <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Specification Info - The most important part for Quotes */}
                            {selectedInquiry.type === 'quote' && selectedInquiry.details && (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2 leading-none flex items-center gap-2">
                                        <Settings className="w-3 h-3" /> Project Specifications
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Dimensions</p>
                                            <p className="text-sm font-bold text-blue-900">{selectedInquiry.details.dimensions || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Quantity</p>
                                            <p className="text-sm font-bold text-blue-900">{selectedInquiry.details.quantity || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Material</p>
                                            <p className="text-sm font-bold text-blue-900 uppercase">{selectedInquiry.details.material || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Printing/Color</p>
                                            <p className="text-sm font-bold text-blue-900 uppercase">{selectedInquiry.details.color || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Turnaround</p>
                                            <p className="text-sm font-bold text-blue-900 uppercase">{selectedInquiry.details.turnaround || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Message */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 leading-none">
                                    <FileText className="w-3 h-3" /> Customer Message
                                </p>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm italic text-gray-700 min-h-[100px]">
                                    {selectedInquiry.message || "No message provided."}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="border-t pt-6 flex justify-between items-center gap-4">
                                <div className="flex gap-2">
                                    {selectedInquiry.status === 'PENDING' ? (
                                        <Button
                                            disabled={isUpdating}
                                            onClick={() => updateStatus(selectedInquiry.id, 'REPLIED')}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-xs rounded-lg"
                                        >
                                            {isUpdating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Mark as Replied"}
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled={isUpdating}
                                            variant="outline"
                                            onClick={() => updateStatus(selectedInquiry.id, 'PENDING')}
                                            className="font-bold uppercase text-xs rounded-lg"
                                        >
                                            {isUpdating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Set back to Pending"}
                                        </Button>
                                    )}
                                </div>
                                <Button variant="ghost" className="text-red-500 hover:text-red-700 font-bold uppercase text-xs" onClick={() => deleteInquiry(selectedInquiry.id)}>
                                    Delete Lead
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
