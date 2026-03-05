"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  CreditCard,
  Users,
  Settings,
  Plane,
  Building,
  Home,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Layout,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/hotels", label: "Hotels", icon: Building },
  { href: "/admin/villas", label: "Villas", icon: Home },
  { href: "/admin/ads", label: "Ads & Banners", icon: Megaphone },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/footer", label: "Footer Settings", icon: Layout },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
  className?: string
}

export function AdminSidebar({ collapsed, onToggle, className, onLinkClick }: AdminSidebarProps & { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-border bg-card transition-all duration-300",
          collapsed ? "w-[68px]" : "w-60",
          className
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-4">
          <Link href="/admin" onClick={onLinkClick} className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg">
              <img src="/logo.png" alt="Plan2Trip" className="h-full w-full object-cover" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  Plan2Trip
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Admin
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href))

              const linkContent = (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <link.icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              )

              if (collapsed) {
                return (
                  <li key={link.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        {link.label}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                )
              }

              return <li key={link.href}>{linkContent}</li>
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex flex-col gap-1 border-t border-border p-3">


          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hidden lg:flex w-full justify-center"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Collapse Sidebar</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
