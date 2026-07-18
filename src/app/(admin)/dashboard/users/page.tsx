"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Users as UsersIcon, AlertCircle, CheckCircle2, ShieldCheck, ShieldAlert } from "lucide-react"

interface AdminUserRow {
    id: string
    email: string
    name: string | null
    role: "ADMIN" | "STAFF"
    isApproved: boolean
    createdAt: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUserRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({ email: "", password: "", name: "", role: "STAFF" })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        try {
            const res = await fetch('/api/cms/users')
            const data = await res.json()
            setUsers(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        setError("")
        try {
            const res = await fetch('/api/cms/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setFormData({ email: "", password: "", name: "", role: "STAFF" })
                fetchUsers()
            } else {
                const data = await res.json()
                setError(data.error || "Failed to create user")
            }
        } catch (error) {
            console.error(error)
            setError("Failed to create user")
        } finally {
            setSubmitting(false)
        }
    }

    async function handleRoleChange(id: string, role: string) {
        try {
            const res = await fetch('/api/cms/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, role })
            })
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, role: role as "ADMIN" | "STAFF" } : u))
            } else {
                const data = await res.json()
                alert(data.error || "Failed to update role")
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function handleToggleApproved(id: string, current: boolean) {
        try {
            const res = await fetch('/api/cms/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isApproved: !current })
            })
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, isApproved: !current } : u))
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to remove this user?")) return
        try {
            const res = await fetch(`/api/cms/users?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== id))
            } else {
                const data = await res.json()
                alert(data.error || "Failed to remove user")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-lg">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Create team accounts and control who can see Live Chat and Inquiries.</p>
                </div>
            </div>

            {/* Add New User */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Add New User
                </h2>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="text-sm font-medium mb-1 block">Name</label>
                        <Input
                            placeholder="Jane Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-sm font-medium mb-1 block">Email</label>
                        <Input
                            type="email"
                            placeholder="jane@packaginghippo.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-sm font-medium mb-1 block">Password</label>
                        <Input
                            type="password"
                            placeholder="Min 8 characters"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-sm font-medium mb-1 block">Role</label>
                        <Select
                            value={formData.role}
                            onValueChange={(val) => setFormData({ ...formData, role: val })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="STAFF">Staff (limited)</SelectItem>
                                <SelectItem value="ADMIN">Admin (full access)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-1">
                        <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700">
                            {submitting ? "Adding..." : "Add User"}
                        </Button>
                    </div>
                </form>
                {error && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                    </p>
                )}
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Staff accounts can access the dashboard but cannot see Live Chat or Inquiries (leads).
                </p>
            </div>

            {/* List Users */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Loading users...</TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">No users found.</TableCell>
                            </TableRow>
                        ) : (
                            users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>
                                        <div className="font-medium text-gray-900">{u.name || "—"}</div>
                                        <div className="text-xs text-gray-500">{u.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Select value={u.role} onValueChange={(val) => handleRoleChange(u.id, val)}>
                                            <SelectTrigger className="w-[160px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="STAFF">
                                                    <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Staff (limited)</span>
                                                </SelectItem>
                                                <SelectItem value="ADMIN">
                                                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Admin (full)</span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => handleToggleApproved(u.id, u.isApproved)}
                                            className={`px-2 py-1 rounded-full text-xs font-bold transition-colors ${
                                                u.isApproved
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            }`}
                                        >
                                            {u.isApproved ? 'Approved' : 'Pending approval'}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(u.id)}
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
