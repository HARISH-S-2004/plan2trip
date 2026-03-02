"use client"

import { useState } from "react"
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    User,
    Star,
    Save,
    Upload,
    ImageIcon
} from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { Label } from "@/components/ui/label"
import { useData } from "@/context/data-context"
import { cn } from "@/lib/utils"
import type { Testimonial } from "@/lib/data"

export default function AdminTestimonialsPage() {
    const { testimonials, updateTestimonial, addTestimonial, deleteTestimonial } = useData()
    const [search, setSearch] = useState("")
    const [addOpen, setAddOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Testimonial | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)

    const [form, setForm] = useState({
        name: "",
        location: "",
        text: "",
        rating: 5,
        avatar: "",
    })

    const filtered = testimonials.filter(
        (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.location.toLowerCase().includes(search.toLowerCase()) ||
            t.text.toLowerCase().includes(search.toLowerCase())
    )

    function handleDelete() {
        if (!deleteTarget) return
        deleteTestimonial(deleteTarget.id)
        setDeleteTarget(null)
    }

    function openEdit(t: Testimonial) {
        setEditTarget(t)
        setForm({
            name: t.name,
            location: t.location,
            text: t.text,
            rating: t.rating,
            avatar: t.avatar,
        })
    }

    function handleSaveEdit() {
        if (!editTarget) return
        updateTestimonial({
            ...editTarget,
            name: form.name,
            location: form.location,
            text: form.text,
            rating: form.rating,
            avatar: form.avatar || form.name.substring(0, 2).toUpperCase(),
        })
        setEditTarget(null)
    }

    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function handleFileUpload(file: File) {
        setIsUploading(true)
        const toastId = toast.loading("Uploading avatar...")
        try {
            const response = await fetch(`/api/upload?filename=${Date.now()}-${file.name}`, {
                method: "POST",
                body: file,
            })

            if (!response.ok) throw new Error("Upload failed")

            const blob = await response.json()
            setForm(f => ({ ...f, avatar: blob.url }))

            toast.success("Avatar uploaded successfully", { id: toastId })
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload avatar", { id: toastId })
        } finally {
            setIsUploading(false)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) handleFileUpload(file)
    }

    function handleAdd() {
        const newT: Testimonial = {
            id: `t-${Date.now()}`,
            name: form.name,
            location: form.location,
            text: form.text,
            rating: form.rating,
            avatar: form.avatar || form.name.substring(0, 2).toUpperCase(),
        }
        addTestimonial(newT)
        setAddOpen(false)
        setForm({ name: "", location: "", text: "", rating: 5, avatar: "" })
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Testimonials (What Our Travelers Say)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage customer reviews and feedback displayed on the home page.
                    </p>
                </div>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Testimonial
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Testimonial</DialogTitle>
                            <DialogDescription>
                                Create a new customer review to display on the website.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Customer Name</Label>
                                    <Input placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Location</Label>
                                    <Input placeholder="New York, USA" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Review Text</Label>
                                <Textarea
                                    placeholder="Share their experience..."
                                    className="min-h-[100px]"
                                    value={form.text}
                                    onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Rating (1-5)</Label>
                                    <Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) }))} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Customer Avatar (Image or Initials)</Label>
                                    <div className="flex gap-2">
                                        <Input placeholder="JD or Image URL" value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className="flex-1" />
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2 shrink-0" disabled={isUploading}>
                                            <Upload className="h-4 w-4" />
                                            {isUploading ? "Uploading..." : "Upload"}
                                        </Button>
                                    </div>
                                    {form.avatar && form.avatar.startsWith('http') && (
                                        <div className="mt-2 relative h-12 w-12 rounded-full overflow-hidden border">
                                            <img src={form.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={isUploading}>Cancel</Button>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAdd} disabled={isUploading}>
                                {isUploading ? "Saving..." : "Save Testimonial"}
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
                            placeholder="Search testimonials..."
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
                        Customer Reviews
                        <Badge variant="secondary" className="ml-2">
                            {filtered.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Review</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No testimonials found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary overflow-hidden">
                                                        {t.avatar && t.avatar.startsWith('http') ? (
                                                            <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            t.avatar || t.name.substring(0, 2).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">{t.name}</span>
                                                        <span className="text-xs text-muted-foreground">{t.location}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <p className="line-clamp-2 text-xs text-muted-foreground">
                                                    {t.text}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "h-3 w-3",
                                                                i < t.rating ? "fill-gold text-gold" : "fill-muted text-muted"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => openEdit(t)} className="h-8 px-2">
                                                        <Pencil className="mr-1 h-3 w-3" />
                                                        Edit
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => setDeleteTarget(t)} className="h-8 px-2 text-red-500 hover:text-red-600">
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Testimonial</DialogTitle>
                        <DialogDescription>
                            Update the customer's feedback.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Customer Name</Label>
                                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Location</Label>
                                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Review Text</Label>
                            <Textarea
                                className="min-h-[100px]"
                                value={form.text}
                                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Rating (1-5)</Label>
                                <Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) }))} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Customer Avatar (Image or Initials)</Label>
                                <div className="flex gap-2">
                                    <Input placeholder="JD or Image URL" value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className="flex-1" />
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2 shrink-0" disabled={isUploading}>
                                        <Upload className="h-4 w-4" />
                                        {isUploading ? "Uploading..." : "Upload"}
                                    </Button>
                                </div>
                                {form.avatar && form.avatar.startsWith('http') && (
                                    <div className="mt-2 relative h-12 w-12 rounded-full overflow-hidden border">
                                        <img src={form.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditTarget(null)} disabled={isUploading}>Cancel</Button>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSaveEdit} disabled={isUploading}>
                            {isUploading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Testimonial</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this testimonial? This action cannot be undone.
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
