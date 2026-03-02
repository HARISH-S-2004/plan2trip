"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { AdminAuthGuard } from "@/components/admin/auth-guard"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isLoginPage = pathname === "/admin/login"

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated")
    sessionStorage.removeItem("adminName")
    toast.info("Logged out successfully.")
    router.push("/admin/login")
  }

  return (
    <AdminAuthGuard>
      {/* Hide public navbar and footer */}
      <style>{`
        header:not([data-admin]) { display: none !important; }
        footer { display: none !important; }
      `}</style>

      {isLoginPage ? (
        <div className="min-h-screen bg-background">{children}</div>
      ) : (
        <div className="relative flex min-h-screen bg-background">
          {/* Floating Logout Button */}
          <Button
            onClick={handleLogout}
            className="fixed bottom-6 right-6 z-[60] h-12 w-12 rounded-full shadow-2xl shadow-primary/40 bg-primary text-primary-foreground hover:scale-110 active:scale-90 transition-all group"
            size="icon"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            <span className="sr-only">Logout</span>
          </Button>
          {/* Mobile overlay */}
          {mobileOpen && (
            <div
              className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <AdminSidebar
              collapsed={collapsed}
              onToggle={() => setCollapsed(!collapsed)}
              className="fixed left-0 top-0 z-40"
            />
          </div>

          {/* Mobile sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:hidden",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </div>

          {/* Main content */}
          <div
            className={cn(
              "flex flex-1 flex-col transition-all duration-300",
              collapsed ? "lg:ml-[68px]" : "lg:ml-60"
            )}
          >
            <AdminTopbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
            <div className="flex-1 p-4 lg:p-6">{children}</div>
          </div>
        </div>
      )}
    </AdminAuthGuard>
  )
}
