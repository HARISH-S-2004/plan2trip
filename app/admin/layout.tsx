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
        <div className="relative flex min-h-screen bg-background overflow-x-hidden">
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
              className="fixed inset-0 z-[45] bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Sidebar - Desktop and Mobile */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 transition-all duration-300 lg:block",
              mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
              collapsed ? "w-[68px]" : "w-60"
            )}
          >
            <AdminSidebar
              collapsed={collapsed}
              onToggle={() => setCollapsed(!collapsed)}
              onLinkClick={() => setMobileOpen(false)}
              className="h-full"
            />
          </div>

          {/* Main content */}
          <div
            className={cn(
              "flex flex-1 flex-col transition-all duration-300 min-w-0 w-full",
              collapsed ? "lg:ml-[68px]" : "lg:ml-60"
            )}
          >
            <AdminTopbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
              <div className="mx-auto w-full max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </AdminAuthGuard>
  )
}
