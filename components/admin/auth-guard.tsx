"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        // If we're on the login page, we don't need to check auth for the child content
        // But we might want to redirect if already logged in
        const authenticated = sessionStorage.getItem("isAdminAuthenticated") === "true"

        if (pathname === "/admin/login") {
            if (authenticated) {
                router.push("/admin")
            } else {
                setIsAuthorized(true) // Show the login page itself
            }
            return
        }

        if (!authenticated) {
            router.push("/admin/login")
            setIsAuthorized(false)
        } else {
            setIsAuthorized(true)
        }
    }, [pathname, router])

    if (isAuthorized === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing Secure Session...</p>
            </div>
        )
    }

    if (!isAuthorized && pathname !== "/admin/login") {
        return null // Will redirect via useEffect
    }

    return <>{children}</>
}
