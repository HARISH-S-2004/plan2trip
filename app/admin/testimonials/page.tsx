"use client"

import { useState } from "react"
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    User,
    Star,
} from "lucide-react"
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
                    <h1 className="text-2xl font-bold tracking-tight text-foreground font-playfair">
                        Testimonials (Social Proof)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage customer reviews and feedback displayed on the home page.
                    </p>
                </div>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 rounded-xl shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Add Testimonial</span>
                            <span className="sm:hidden text-xs">New Review</span>
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
                                    <Label>Avatar Initials (Optional)</Label>
                                    <Input placeholder="JD" maxLength={2} value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAdd}>
                                Save Testimonial
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <Card className="gap-0 py-0 border-none shadow-sm bg-secondary/5">
                <CardContent className="p-3 sm:p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search testimonials..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-11 rounded-xl bg-background border-none shadow-sm"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
                <CardHeader className="p-4 sm:p-6 pb-2">
                    <CardTitle className="text-lg sm:text-xl font-bold">
                        Customer Reviews
                        <Badge variant="secondary" className="ml-2 font-black rounded-full px-2">
                            {filtered.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none bg-muted/30">
                                    <TableHead className="px-4 py-3 font-bold text-foreground">Customer</TableHead>
                                    <TableHead className="hidden md:table-cell py-3 font-bold text-foreground">Review</TableHead>
                                    <TableHead className="py-3 font-bold text-foreground">Rating</TableHead>
                                    <TableHead className="py-3 font-bold text-foreground text-right px-4">Actions</TableHead>
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
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                        {t.avatar}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">{t.name}</span>
                                                        <span className="text-xs text-muted-foreground">{t.location}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell max-w-[300px]">
                                                <p className="line-clamp-2 text-xs text-muted-foreground italic">
                                                    "{t.text}"
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
                                            <TableCell className="text-right px-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)} className="h-8 w-8 text-muted-foreground hover:text-primary rounded-xl">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(t)} className="h-8 w-8 text-muted-foreground hover:text-red-600 rounded-xl">
                                                        <Trash2 className="h-4 w-4" />
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
                                <Label>Avatar Initials</Label>
                                <Input maxLength={2} value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} />
                            </div>
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
        </div >
    )
}
