"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic';

export default function SignupPage() {

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <Lock className="h-12 w-12 text-yellow-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Registration Disabled</CardTitle>
                    <CardDescription className="text-center">
                        Public signup is disabled for security reasons
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertDescription>
                            Only administrators can create new admin accounts. If you need access, please contact an existing administrator.
                        </AlertDescription>
                    </Alert>

                    <Link href="/dashboard/login" className="block">
                        <Button className="w-full">
                            Go to Login
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
