"use client"

import { useState } from "react"
import {
  Search,
  ShieldCheck,
  Ban,
  MoreHorizontal,
  UserCheck,
  Trash2,
  Plus,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useData } from "@/context/data-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function AdminUsersPage() {
  const { users, deleteUser, updateUserRole, toggleUserBlock, addUser } = useData()
  const [search, setSearch] = useState("")
  const [promoteTarget, setPromoteTarget] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  // Add User State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "User" as "User" | "Admin"
  })

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
  )

  function handlePromote() {
    if (!promoteTarget) return
    updateUserRole(promoteTarget.id, "Admin")
    setPromoteTarget(null)
    toast.success(`${promoteTarget.name} has been promoted to Admin.`)
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteUser(deleteTarget.id)
    setDeleteTarget(null)
    toast.success("User has been deleted.")
  }

  function handleAddUser() {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill in all required fields.")
      return
    }

    const id = `USR-${Math.floor(100 + Math.random() * 900)}`
    addUser({
      ...newUser,
      id,
      joinedDate: new Date().toISOString().split('T')[0],
      bookingsCount: 0,
      blocked: false
    })

    setIsAddOpen(false)
    setNewUser({ name: "", email: "", password: "", role: "User" })
    toast.success("New user added successfully! They can now log in with these credentials.")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Users
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage roles and access control.
          </p>
        </div>
        <Button
          className="rounded-xl shadow-lg shadow-primary/20 bg-primary text-primary-foreground h-11"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Search */}
      <Card className="gap-0 py-0 border-none shadow-sm bg-secondary/5">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-xl bg-background border-none shadow-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="gap-0 py-0 border-none shadow-sm bg-card/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Total Users</p>
              <p className="text-lg font-black text-foreground">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0 py-0 border-none shadow-sm bg-card/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
              <ShieldCheck className="h-5 w-5 text-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Admins</p>
              <p className="text-lg font-black text-foreground">
                {users.filter((u) => u.role === "Admin").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0 py-0 border-none shadow-sm bg-card/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <Ban className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Blocked</p>
              <p className="text-lg font-black text-foreground">
                {users.filter((u) => u.blocked).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-lg sm:text-xl font-bold">
            All Accounts
            <Badge variant="secondary" className="ml-2 font-black rounded-full px-2">
              {filtered.length}
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Manage dashboard access and user permissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-muted/30">
                  <TableHead className="px-4 py-3 font-bold text-foreground">User</TableHead>
                  <TableHead className="hidden lg:table-cell py-3 font-bold text-foreground">ID</TableHead>
                  <TableHead className="py-3 font-bold text-foreground">Role</TableHead>
                  <TableHead className="hidden md:table-cell py-3 font-bold text-foreground">Joined</TableHead>
                  <TableHead className="hidden sm:table-cell py-3 font-bold text-foreground text-center">Bookings</TableHead>
                  <TableHead className="py-3 font-bold text-foreground">Status</TableHead>
                  <TableHead className="w-12 py-3 font-bold text-foreground text-right px-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow
                    key={user.id}
                    className={cn(user.blocked && "opacity-60")}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback
                            className={cn(
                              "text-xs font-semibold",
                              user.role === "Admin"
                                ? "bg-gold/20 text-gold"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground/70 text-xs">
                      {user.id}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-black uppercase tracking-tight px-2 py-0.5",
                          user.role === "Admin"
                            ? "border-gold/30 bg-gold/10 text-gold"
                            : "border-primary/20 bg-primary/5 text-primary"
                        )}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-medium">
                      {new Date(user.joinedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center font-bold text-foreground/80">
                      {user.bookingsCount}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.blocked}
                          onCheckedChange={() => toggleUserBlock(user.id)}
                          aria-label={`Block ${user.name}`}
                          className="scale-75 sm:scale-90"
                        />
                        {user.blocked && (
                          <span className="text-[10px] font-bold text-red-500 hidden sm:inline">Blocked</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="User actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.role === "User" && (
                            <DropdownMenuItem
                              onClick={() => setPromoteTarget(user)}
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Promote to Admin
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => toggleUserBlock(user.id)}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            {user.blocked ? "Unblock User" : "Block User"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:bg-red-50 focus:text-red-700"
                            onClick={() => setDeleteTarget(user)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Promote confirmation */}
      <Dialog
        open={!!promoteTarget}
        onOpenChange={(open) => !open && setPromoteTarget(null)}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Promote to Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to promote{" "}
              <span className="font-medium text-foreground">
                {promoteTarget?.name}
              </span>{" "}
              to Admin? They will have full access to the admin dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromoteTarget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handlePromote}
            >
              Promote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation (existing code) */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete user{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>? This action cannot be undone and will remove all their data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-playfair">Add New User</DialogTitle>
            <DialogDescription>
              Create a new account for travel agents or admins.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Login Password</Label>
              <Input
                id="password"
                type="text"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="rounded-xl"
              />
              <p className="text-[10px] text-muted-foreground ml-1">This password will be used for dashboard access.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Account Role</Label>
              <Select
                defaultValue="User"
                onValueChange={(val: any) => setNewUser({ ...newUser, role: val })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User / Agent</SelectItem>
                  <SelectItem value="Admin">Full Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="rounded-xl bg-primary shadow-lg shadow-primary/20">
              Create User account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
