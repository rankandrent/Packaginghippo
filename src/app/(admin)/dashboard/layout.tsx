import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {/* Hide navbar and footer for admin pages */}
            <style>{`
                body > header, 
                body > footer,
                body > nav,
                .site-navbar,
                .site-footer {
                    display: none !important;
                }
            `}</style>
            <div className="min-h-screen bg-gray-50">
                <AdminSidebar />
                <main className="ml-64 p-8 min-h-screen">
                    {children}
                </main>
            </div>
        </>
    )
}
