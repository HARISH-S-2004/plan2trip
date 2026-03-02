"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import {
    Plus,
    Pencil,
    Trash2,
    MoreHorizontal,
    Search,
    Image as ImageIcon,
    ExternalLink,
    Megaphone,
    Upload,
} from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useData } from "@/context/data-context"
import type { Advertisement } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function AdminAdsPage() {
    const { ads, updateAd, addAd, deleteAd } = useData()
    const [search, setSearch] = useState("")
    const [addOpen, setAddOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Advertisement | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Advertisement | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        image: "",
        link: "",
        buttonText: "Learn More",
        position: "Hero" as "Hero" | "Banner",
    })

    const filtered = ads.filter(
        (ad) =>
            ad.title.toLowerCase().includes(search.toLowerCase()) ||
            ad.subtitle.toLowerCase().includes(search.toLowerCase())
    )

    function toggleStatus(ad: Advertisement) {
        updateAd({
            ...ad,
            status: ad.status === "Active" ? "Inactive" : "Active",
        })
    }

    function handleDelete() {
        if (!deleteTarget) return
        deleteAd(deleteTarget.id)
        toast.success(`Advertisement "${deleteTarget.title}" deleted successfully`)
        setDeleteTarget(null)
    }

    function compressImage(file: File, callback: (base64: string) => void) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new (window as any).Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height
                const max_size = 1920 // Ads can be bigger (hero section)

                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width
                        width = max_size
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height
                        height = max_size
                    }
                }
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx?.drawImage(img, 0, 0, width, height)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8) // Higher quality for hero banners
                callback(dataUrl)
            }
            img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            compressImage(file, (base64) => {
                setForm(f => ({ ...f, image: base64 }))
            })
        }
    }

    function openEdit(ad: Advertisement) {
        setEditTarget(ad)
        setForm({
            title: ad.title,
            subtitle: ad.subtitle,
            image: ad.image,
            link: ad.link,
            buttonText: ad.buttonText,
            position: ad.position,
        })
    }

    function handleSaveEdit() {
        if (!editTarget) return
        updateAd({
            ...editTarget,
            title: form.title,
            subtitle: form.subtitle,
            image: form.image,
            link: form.link,
            buttonText: form.buttonText,
            position: form.position,
        })
        toast.success(`Advertisement "${form.title}" updated successfully`)
        setEditTarget(null)
    }

    function handleAddAd() {
        const newAd: Advertisement = {
            id: `ad-${Date.now()}`,
            title: form.title,
            subtitle: form.subtitle,
            image: form.image || "/images/hero-travel.jpg",
            link: form.link || "/",
            buttonText: form.buttonText,
            position: form.position,
            status: "Active",
        }
        addAd(newAd)
        toast.success(`Advertisement "${form.title}" added successfully`)
        setAddOpen(false)
        setForm({ title: "", subtitle: "", image: "", link: "", buttonText: "Learn More", position: "Hero" })
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Advertisements
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage promotional banners and hero sections on the home page.
                    </p>
                </div>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Advertisement
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Advertisement</DialogTitle>
                            <DialogDescription>
                                Recommended Image Size: <span className="font-bold text-primary">1920x1080px</span> for Hero, <span className="font-bold text-primary">1200x400px</span> for Banners.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Title</Label>
                                <Input placeholder="Main Headline" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Subtitle/Description</Label>
                                <Input placeholder="Brief catchphrase" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Position</Label>
                                    <Select value={form.position} onValueChange={(val: "Hero" | "Banner") => setForm(f => ({ ...f, position: val }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Hero">Hero Section</SelectItem>
                                            <SelectItem value="Banner">Content Banner</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Button Text</Label>
                                    <Input value={form.buttonText} onChange={e => setForm(f => ({ ...f, buttonText: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Image Selection</Label>
                                <div className="flex gap-2">
                                    <Input placeholder="/images/promo.jpg" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="flex-1" />
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2 shrink-0">
                                        <Upload className="h-4 w-4" />
                                        Upload
                                    </Button>
                                </div>
                                {form.image && (
                                    <div className="mt-2 relative aspect-[16/6] rounded-lg overflow-hidden border">
                                        <Image src={form.image} alt="Preview" fill unoptimized className="object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label>Link URL</Label>
                                <Input placeholder="/packages/package-id" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddAd}>
                                Create Ad
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <Card className="gap-0 py-0">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search advertisements..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Active Campaigns
                        <Badge variant="secondary" className="ml-2">
                            {filtered.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Preview</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((ad) => (
                                <TableRow key={ad.id}>
                                    <TableCell>
                                        <div className="relative h-12 w-20 overflow-hidden rounded border bg-muted">
                                            {ad.image ? (
                                                <Image src={ad.image} alt={ad.title} fill unoptimized className="object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{ad.title}</span>
                                            <span className="text-xs text-muted-foreground line-clamp-1">{ad.subtitle}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {ad.position}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={ad.status === "Active"}
                                                onCheckedChange={() => toggleStatus(ad)}
                                            />
                                            <span className={cn(
                                                "text-xs font-medium",
                                                ad.status === "Active" ? "text-emerald-600" : "text-muted-foreground"
                                            )}>
                                                {ad.status}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEdit(ad)} className="h-8 gap-1 text-xs px-2">
                                                <Pencil className="h-3 w-3" />
                                                Edit
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(ad)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Advertisement</DialogTitle>
                        <DialogDescription>
                            Recommended Image Size: <span className="font-bold text-primary">1920x1080px</span> for Hero.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Title</Label>
                            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Subtitle</Label>
                            <Input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Position</Label>
                                <Select value={form.position} onValueChange={(val: "Hero" | "Banner") => setForm(f => ({ ...f, position: val }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hero">Hero Section</SelectItem>
                                        <SelectItem value="Banner">Content Banner</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Button Text</Label>
                                <Input value={form.buttonText} onChange={e => setForm(f => ({ ...f, buttonText: e.target.value }))} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Image Selection</Label>
                            <div className="flex gap-2">
                                <Input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="flex-1" />
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2 shrink-0">
                                    <Upload className="h-4 w-4" />
                                    Upload
                                </Button>
                            </div>
                            {form.image && (
                                <div className="mt-2 relative aspect-[16/6] rounded-lg overflow-hidden border">
                                    <Image src={form.image} alt="Preview" fill unoptimized className="object-cover" />
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Link URL</Label>
                            <Input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSaveEdit}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Advertisement</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this campaign?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
