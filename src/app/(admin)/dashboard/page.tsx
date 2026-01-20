import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, MessageSquare, Users, TrendingUp } from "lucide-react"

// Mock Data until DB is connected
const stats = [
    {
        title: "Total Products",
        value: "124",
        description: "+12 added this month",
        icon: Package,
    },
    {
        title: "New Inquiries",
        value: "15",
        description: "3 unread messages",
        icon: MessageSquare,
    },
    {
        title: "Site Visitors",
        value: "1.2k",
        description: "+18% from last month",
        icon: Users,
    },
    {
        title: "Conversion Rate",
        value: "3.4%",
        description: "Request Quote Click Rate",
        icon: TrendingUp,
    },
]

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Mock List */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Global Tech Solutions</p>
                                        <p className="text-sm text-muted-foreground">
                                            Looking for 500 Custom Mailer Boxes...
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">Just now</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <button className="bg-yellow-500 text-black px-4 py-2 rounded-md font-bold hover:bg-yellow-400 transition">
                                + Add New Product
                            </button>
                            <button className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition">
                                View Public Site
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
