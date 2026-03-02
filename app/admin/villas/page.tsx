"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import {
    Plus,
    Pencil,
    Trash2,
    Star,
    MoreHorizontal,
    Search,
    Home,
    ExternalLink,
    Upload,
    Image as ImageIcon,
} from "lucide-react"
import { useRef } from "react"
import Link from "next/link"
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
import { Textarea } from "@/components/ui/textarea"
import { useData } from "@/context/data-context"
import type { Villa } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function AdminVillasPage() {
    const { villas, updateVilla, addVilla, deleteVilla } = useData()
    const [search, setSearch] = useState("")
    const [addOpen, setAddOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Villa | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Villa | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [form, setForm] = useState({
        name: "",
        destination: "",
        pricePerNight: "",
        description: "",
        image: "",
        amenities: "",
        rooms: [] as { type: string; price: number; description: string; image?: string; taxesAndFees?: number }[],
    })

    const filtered = villas.filter(
        (villa) =>
            villa.name.toLowerCase().includes(search.toLowerCase()) ||
            villa.destination.toLowerCase().includes(search.toLowerCase())
    )

    function toggleStatus(villa: Villa) {
        updateVilla({
            ...villa,
            status: villa.status === "Active" ? "Inactive" : "Active",
        })
    }

    function handleDelete() {
        if (!deleteTarget) return
        deleteVilla(deleteTarget.id)
        toast.success(`Villa "${deleteTarget.name}" deleted successfully`)
        setDeleteTarget(null)
    }

    const [isUploading, setIsUploading] = useState(false)

    async function handleFileUpload(file: File, type: "villa" | "room", index?: number) {
        setIsUploading(true)
        const toastId = toast.loading(`Uploading ${type} image...`)
        try {
            const response = await fetch(`/api/upload?filename=${Date.now()}-${file.name}`, {
                method: "POST",
                body: file,
            })

            if (!response.ok) throw new Error("Upload failed")

            const blob = await response.json()

            if (type === "villa") {
                setForm(f => ({ ...f, image: blob.url }))
            } else if (type === "room" && index !== undefined) {
                updateRoom(index, 'image', blob.url)
            }

            toast.success("Image uploaded successfully", { id: toastId })
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload image", { id: toastId })
        } finally {
            setIsUploading(false)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) handleFileUpload(file, "villa")
    }

    function handleRoomFileChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) handleFileUpload(file, "room", index)
    }

    function openEdit(villa: Villa) {
        setEditTarget(villa)
        setForm({
            name: villa.name,
            destination: villa.destination,
            pricePerNight: String(villa.pricePerNight),
            description: villa.description,
            image: villa.image,
            amenities: villa.amenities.join(", "),
            rooms: villa.rooms || [],
        })
    }

    function handleSaveEdit() {
        if (!editTarget) return

        const priceNum = Number(form.pricePerNight) || 0

        updateVilla({
            ...editTarget,
            name: form.name,
            destination: form.destination,
            pricePerNight: priceNum,
            description: form.description,
            image: form.image || editTarget.image,
            amenities: form.amenities.split(",").map(s => s.trim()).filter(Boolean),
            rooms: form.rooms,
        })

        toast.success(`Villa "${form.name}" updated successfully`)
        setEditTarget(null)
        resetForm()
    }

    function handleAddVilla() {
        const priceNum = Number(form.pricePerNight) || 0

        const newVilla: Villa = {
            id: `villa-${Date.now()}`,
            name: form.name,
            destination: form.destination,
            pricePerNight: priceNum,
            rating: 4.5,
            reviewCount: 0,
            image: form.image || "/images/package-bali.jpg",
            description: form.description,
            amenities: form.amenities.split(",").map(s => s.trim()).filter(Boolean),
            rooms: form.rooms,
            status: "Active",
            bookingsCount: 0,
        }
        addVilla(newVilla)
        toast.success(`Villa "${form.name}" added successfully`)
        setAddOpen(false)
        resetForm()
    }

    function resetForm() {
        setForm({
            name: "",
            destination: "",
            pricePerNight: "",
            description: "",
            image: "",
            amenities: "",
            rooms: [],
        })
    }

    function addRoom() {
        setForm(f => ({
            ...f,
            rooms: [...f.rooms, { type: "", price: 0, description: "", taxesAndFees: 0 }]
        }))
    }

    function updateRoom(index: number, field: keyof typeof form.rooms[0], value: any) {
        setForm(f => ({
            ...f,
            rooms: f.rooms.map((room, i) => i === index ? { ...room, [field]: value } : room)
        }))
    }

    function removeRoom(index: number) {
        setForm(f => ({
            ...f,
            rooms: f.rooms.filter((_, i) => i !== index)
        }))
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Villas & Homestays
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your vacation rentals and homestays.
                    </p>
                </div>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Villa
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Villa/Homestay</DialogTitle>
                            <DialogDescription>
                                Fill in the details to create a new rental listing.
                            </DialogDescription>
                        </DialogHeader>
                        <VillaFormContent
                            form={form}
                            setForm={setForm}
                            isUploading={isUploading}
                            fileInputRef={fileInputRef}
                            handleFileChange={handleFileChange}
                            handleRoomFileChange={handleRoomFileChange}
                            addRoom={addRoom}
                            updateRoom={updateRoom}
                            removeRoom={removeRoom}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={isUploading}>Cancel</Button>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddVilla} disabled={isUploading}>
                                {isUploading ? "Uploading..." : "Create Villa"}
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
                            placeholder="Search properties by name or destination..."
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
                        All Properties
                        <Badge variant="secondary" className="ml-2">
                            {filtered.length}
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        A list of all vacation rentals with their status and details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead className="hidden md:table-cell">Destination</TableHead>
                                <TableHead>Price/Night</TableHead>
                                <TableHead className="hidden sm:table-cell">Rating</TableHead>
                                <TableHead className="hidden sm:table-cell">Bookings</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((villa) => (
                                <TableRow key={villa.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                                                {villa.image ? (
                                                    <Image src={villa.image} alt={villa.name} fill unoptimized className="object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Home className="h-5 w-5 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-foreground">{villa.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden text-muted-foreground md:table-cell">{villa.destination}</TableCell>
                                    <TableCell className="font-medium text-foreground">₹{villa.pricePerNight.toLocaleString()}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                                            <span className="text-sm text-muted-foreground">{villa.rating}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden text-muted-foreground sm:table-cell">{villa.bookingsCount}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={villa.status === "Active"}
                                                onCheckedChange={() => toggleStatus(villa)}
                                                aria-label={`Toggle ${villa.name} status`}
                                            />
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[11px]",
                                                    villa.status === "Active"
                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                        : "border-muted bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {villa.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/villas/${villa.id}`} target="_blank">
                                                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs font-medium text-muted-foreground hover:text-primary">
                                                    <ExternalLink className="h-3 w-3" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="sm" onClick={() => openEdit(villa)} className="h-8 gap-1 text-xs font-medium text-muted-foreground hover:text-primary">
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
                                                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(villa)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        No properties found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Property</DialogTitle>
                        <DialogDescription>Update the villa/homestay details below.</DialogDescription>
                    </DialogHeader>
                    <VillaFormContent
                        form={form}
                        setForm={setForm}
                        isUploading={isUploading}
                        fileInputRef={fileInputRef}
                        handleFileChange={handleFileChange}
                        handleRoomFileChange={handleRoomFileChange}
                        addRoom={addRoom}
                        updateRoom={updateRoom}
                        removeRoom={removeRoom}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditTarget(null)} disabled={isUploading}>Cancel</Button>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSaveEdit} disabled={isUploading}>
                            {isUploading ? "Uploading..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Property</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This action cannot be undone.
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
function VillaFormContent({
    form,
    setForm,
    isUploading,
    fileInputRef,
    handleFileChange,
    handleRoomFileChange,
    addRoom,
    updateRoom,
    removeRoom
}: {
    form: any,
    setForm: any,
    isUploading: boolean,
    fileInputRef: any,
    handleFileChange: any,
    handleRoomFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void,
    addRoom: any,
    updateRoom: any,
    removeRoom: any
}) {
    return (
        <div className="grid gap-6">
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70">General Information</h3>
                <div className="grid gap-4 bg-secondary/10 p-4 rounded-2xl border border-secondary/20">
                    <div className="grid gap-2">
                        <Label>Property Name</Label>
                        <Input
                            placeholder="e.g. Luxury Ubud Villa"
                            value={form.name}
                            onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
                            className="bg-background rounded-xl border-none shadow-sm h-11"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Destination</Label>
                            <Input
                                placeholder="e.g. Bali, Indonesia"
                                value={form.destination}
                                onChange={e => setForm((f: any) => ({ ...f, destination: e.target.value }))}
                                className="bg-background rounded-xl border-none shadow-sm h-11"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Base Price/Night (₹)</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 5000"
                                value={form.pricePerNight}
                                onChange={e => setForm((f: any) => ({ ...f, pricePerNight: e.target.value }))}
                                className="bg-background rounded-xl border-none shadow-sm h-11"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70">Visuals & Story</h3>
                <div className="grid gap-4 bg-secondary/10 p-4 rounded-2xl border border-secondary/20">
                    <div className="grid gap-2">
                        <Label>Property Image Selection</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="/images/villa.jpg"
                                value={form.image}
                                onChange={e => setForm((f: any) => ({ ...f, image: e.target.value }))}
                                className="bg-background rounded-xl border-none shadow-sm h-11 flex-1"
                            />
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="h-11 rounded-xl px-4 gap-2 border-primary/20 hover:border-primary transition-all" disabled={isUploading}>
                                <Upload className="h-4 w-4" />
                                <span className="hidden sm:inline">{isUploading ? "Uploading..." : "Upload"}</span>
                            </Button>
                        </div>
                        {form.image && (
                            <div className="mt-2 relative aspect-[21/9] rounded-xl overflow-hidden border bg-background shadow-inner">
                                <Image src={form.image} alt="Preview" fill unoptimized className="object-cover" />
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label>Property Description</Label>
                        <Textarea
                            placeholder="Tell visitors about the unique features of this property..."
                            value={form.description}
                            onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                            className="bg-background rounded-xl border-none shadow-sm min-h-[100px] py-3 px-4 focus-visible:ring-1 focus-visible:ring-primary/20"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70">Amenities (comma separated)</h3>
                <Input
                    placeholder="e.g. WiFi, Private Pool, Kitchen, Daily Cleaning, Garden"
                    value={form.amenities}
                    onChange={e => setForm((f: any) => ({ ...f, amenities: e.target.value }))}
                    className="bg-secondary/10 rounded-xl border-secondary/20 h-11 px-4"
                />
            </div>

            <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70">Available Room Types</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addRoom} className="rounded-lg h-8 gap-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        <Plus className="h-4 w-4" />
                        Add Room
                    </Button>
                </div>

                <div className="space-y-6">
                    {form.rooms.map((room: any, index: number) => (
                        <div key={index} className="grid gap-4 bg-secondary/5 p-5 rounded-3xl border border-secondary/20 relative group transition-all hover:bg-secondary/10">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full absolute -top-3 -right-3 bg-red-50 text-red-500 border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                onClick={() => removeRoom(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Room Image Upload */}
                                <div className="w-full md:w-48 shrink-0">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground mb-1.5 block">Room Photo</Label>
                                    <div
                                        className="relative aspect-video md:aspect-square rounded-2xl border-2 border-dashed border-secondary/30 bg-background overflow-hidden group/img cursor-pointer hover:border-primary/50 transition-colors"
                                        onClick={() => document.getElementById(`room-file-${index}`)?.click()}
                                    >
                                        {room.image ? (
                                            <>
                                                <Image src={room.image} alt={room.type} fill className="object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload className="h-6 w-6 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/60">
                                                <ImageIcon className="h-8 w-8" />
                                                <span className="text-[10px] font-bold uppercase">{isUploading ? "Uploading..." : "Click to Upload"}</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id={`room-file-${index}`}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleRoomFileChange(index, e)}
                                        />
                                    </div>
                                </div>

                                {/* Room Details */}
                                <div className="flex-1 grid gap-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="grid gap-1.5">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">Room Title</Label>
                                            <Input
                                                placeholder="e.g. Deluxe Suite"
                                                value={room.type}
                                                onChange={e => updateRoom(index, 'type', e.target.value)}
                                                className="h-10 rounded-xl bg-background border-none shadow-sm font-semibold"
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">Price/Night (₹)</Label>
                                            <Input
                                                type="number"
                                                placeholder="2500"
                                                value={room.price}
                                                onChange={e => updateRoom(index, 'price', Number(e.target.value))}
                                                className="h-10 rounded-xl bg-background border-none shadow-sm font-bold text-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="grid gap-1.5">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">Taxes & Fees (₹)</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">+ ₹</span>
                                                <Input
                                                    type="number"
                                                    placeholder="150"
                                                    value={room.taxesAndFees || ""}
                                                    onChange={e => updateRoom(index, 'taxesAndFees', Number(e.target.value))}
                                                    className="h-10 rounded-xl bg-background border-none shadow-sm pl-10 font-medium italic text-muted-foreground"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">Short Description</Label>
                                            <Input
                                                placeholder="e.g. Private balcony with garden view."
                                                value={room.description}
                                                onChange={e => updateRoom(index, 'description', e.target.value)}
                                                className="h-10 rounded-xl bg-background border-none shadow-sm text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {form.rooms.length === 0 && (
                        <div className="text-center py-10 rounded-3xl border border-dashed border-muted bg-secondary/5">
                            <p className="text-xs text-muted-foreground font-medium">No room types added yet. Define them to show on the public page.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
