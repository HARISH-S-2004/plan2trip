"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { replaceImage, uploadImage } from "@/lib/firestore-service"
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
    const [uploading, setUploading] = useState(false)

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


    async function uploadFile(file: File, folder: string = "villas", customOldUrl?: string): Promise<string | null> {
        setUploading(true)

        // Safety timeout: reset "uploading" state after 30 seconds if it hangs (slow connections)
        const timeoutId = setTimeout(() => {
            setUploading(false)
            console.warn("Upload timed out - resetting state.")
        }, 30000)

        try {
            const oldUrl = customOldUrl || editTarget?.image || form.image
            const url = oldUrl
                ? await replaceImage(file, folder, oldUrl)
                : await uploadImage(file, folder)

            clearTimeout(timeoutId)
            return url
        } catch (error: any) {
            clearTimeout(timeoutId)
            console.error("Villa Upload error details:", error)

            let msg = error.message || "Unknown error"
            if (error.code === 'storage/unauthorized' || msg.includes('403')) {
                msg = "Permission Denied. Please check your Supabase Storage policies."
            } else if (msg.includes('404')) {
                msg = "Supabase Storage bucket 'uploads' not found."
            }

            toast.error(`Upload Failed: ${msg}`)
            return null
        } finally {
            setUploading(false)
        }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            const oldUrl = editTarget?.image || form.image
            const url = await uploadFile(file, "villas", oldUrl)
            if (url) {
                setForm(f => ({ ...f, image: url }))
                toast.success("Villa image uploaded")
            }
        }
    }

    async function handleRoomFileChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            const oldUrl = form.rooms[index]?.image
            const url = await uploadFile(file, "rooms", oldUrl)
            if (url) {
                updateRoom(index, 'image', url)
                toast.success("Room image uploaded")
            }
        }
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
                        Manage your vacation rentals and listings.
                    </p>
                </div>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary text-primary-foreground h-11">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Property
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
                            fileInputRef={fileInputRef}
                            handleFileChange={handleFileChange}
                            handleRoomFileChange={handleRoomFileChange}
                            addRoom={addRoom}
                            updateRoom={updateRoom}
                            removeRoom={removeRoom}
                            uploading={uploading}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddVilla}>
                                Create Villa
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
                            placeholder="Search properties by name or destination..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-11 rounded-xl bg-background border-none shadow-sm"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="p-4 sm:p-6 pb-2">
                    <CardTitle className="text-lg sm:text-xl font-bold">
                        All Properties
                        <Badge variant="secondary" className="ml-2 font-black rounded-full px-2">
                            {filtered.length}
                        </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                        A list of all vacation rentals with their status and details.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none bg-muted/30">
                                    <TableHead className="px-4 py-3 font-bold text-foreground">Property</TableHead>
                                    <TableHead className="hidden lg:table-cell py-3 font-bold text-foreground">Destination</TableHead>
                                    <TableHead className="py-3 font-bold text-foreground">Price/Night</TableHead>
                                    <TableHead className="hidden md:table-cell py-3 font-bold text-foreground text-center">Rating</TableHead>
                                    <TableHead className="hidden sm:table-cell py-3 font-bold text-foreground text-center">Bookings</TableHead>
                                    <TableHead className="py-3 font-bold text-foreground">Status</TableHead>
                                    <TableHead className="w-12 py-3 font-bold text-foreground text-right px-4">Actions</TableHead>
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
                                        <TableCell className="hidden lg:table-cell text-muted-foreground/70 text-xs font-medium">{villa.destination}</TableCell>
                                        <TableCell className="font-bold text-foreground text-sm">₹{villa.pricePerNight.toLocaleString()}</TableCell>
                                        <TableCell className="hidden md:table-cell text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Star className="h-3 w-3 fill-gold text-gold" />
                                                <span className="text-xs font-bold text-foreground/80">{villa.rating}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-center text-muted-foreground font-bold">{villa.bookingsCount}</TableCell>
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
                                        <TableCell className="px-4">
                                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                <Link href={`/villas/${villa.id}`} target="_blank" className="hidden sm:inline">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(villa)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl">
                                                        <DropdownMenuItem onClick={() => setDeleteTarget(villa)} className="text-red-500 focus:text-red-500 focus:bg-red-50">
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
                    </div>
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
                        fileInputRef={fileInputRef}
                        handleFileChange={handleFileChange}
                        handleRoomFileChange={handleRoomFileChange}
                        addRoom={addRoom}
                        updateRoom={updateRoom}
                        removeRoom={removeRoom}
                        uploading={uploading}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSaveEdit}>
                            Save Changes
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
    fileInputRef,
    handleFileChange,
    handleRoomFileChange,
    addRoom,
    updateRoom,
    removeRoom,
    uploading
}: {
    form: any,
    setForm: any,
    fileInputRef: any,
    handleFileChange: any,
    handleRoomFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void,
    addRoom: any,
    updateRoom: any,
    removeRoom: any,
    uploading?: boolean
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
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="h-11 rounded-xl px-4 gap-2 border-primary/20 hover:border-primary transition-all" disabled={uploading}>
                                <Upload className="h-4 w-4" />
                                <span className="hidden sm:inline">{uploading ? "Uploading..." : "Upload"}</span>
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
                                                {uploading ? (
                                                    <span className="text-[10px] font-bold animate-pulse">Uploading...</span>
                                                ) : (
                                                    <>
                                                        <ImageIcon className="h-8 w-8" />
                                                        <span className="text-[10px] font-bold uppercase">Click to Upload</span>
                                                    </>
                                                )}
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
