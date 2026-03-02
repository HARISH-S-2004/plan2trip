"use client"

import { usePathname } from "next/navigation"
import { useData } from "@/context/data-context"
import { MaintenanceView } from "./maintenance-view"

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { settings } = useData()

    const isMaintenanceMode = settings?.maintenanceMode === true
    const isAdminRoute = pathname?.startsWith("/admin")

    // If maintenance mode is ON and we're NOT on an admin route, show maintenance view
    if (isMaintenanceMode && !isAdminRoute) {
        return <MaintenanceView />
    }

    return <>{children}</>
}
