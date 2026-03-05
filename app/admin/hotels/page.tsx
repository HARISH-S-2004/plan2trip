"use client"

import { useState } from "react"
import Link from "next/link"
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
    Upload,
    ExternalLink,
    Image as ImageIcon,
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
import { Textarea } from "@/components/ui/textarea"
import { useData } from "@/context/data-context"
import type { Hotel } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function AdminHotelsPage() {
    const { hotels, updateHotel, addHotel, deleteHotel } = useData()
    const [search, setSearch] = useState("")
    const [addOpen, setAddOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Hotel | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Hotel | null>(null)
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

    const filtered = hotels.filter(
        (hotel) =>
            hotel.name.toLowerCase().includes(search.toLowerCase()) ||
            hotel.destination.toLowerCase().includes(search.toLowerCase())
    )

    function toggleStatus(hotel: Hotel) {
        updateHotel({
            ...hotel,
            status: hotel.status === "Active" ? "Inactive" : "Active",
        })
    }

    function handleDelete() {
        if (!deleteTarget) return
        deleteHotel(deleteTarget.id)
        toast.success(`Hotel "${deleteTarget.name}" deleted successfully`)
        setDeleteTarget(null)
    }


    async function uploadFile(file: File, folder: string = "hotels", customOldUrl?: string): Promise<string | null> {
        setUploading(true)

        // Safety timeout: reset "uploading" state after 10 seconds if it hangs
        const timeoutId = setTimeout(() => {
            setUploading(false)
            console.warn("Upload timed out - resetting state.")
        }, 10000)

        try {
            const oldUrl = customOldUrl || editTarget?.image || form.image
            const url = oldUrl
                ? await replaceImage(file, folder, oldUrl)
                : await uploadImage(file, folder)

            clearTimeout(timeoutId)
            return url
        } catch (error: any) {
            clearTimeout(timeoutId)
            console.error("Hotel Upload error details:", error)

            let msg = error.message || "Unknown error"
            if (error.code === 'storage/unauthorized' || msg.includes('403')) {
                msg = "Permission Denied. Enable Firebase Storage in Console and set rules to public."
            } else if (error.code === 'storage/project-not-found' || msg.includes('404')) {
                msg = "Storage Not Enabled. Go to Firebase Console > Storage > Get Started."
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
            const url = await uploadFile(file, "hotels", oldUrl)
            if (url) {
                setForm(f => ({ ...f, image: url }))
                toast.success("Hotel image uploaded")
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

    function openEdit(hotel: Hotel) {
        setEditTarget(hotel)
        setForm({
            name: hotel.name,
            destination: hotel.destination,
            pricePerNight: String(hotel.pricePerNight),
            description: hotel.description,
            image: hotel.image,
            amenities: hotel.amenities ? hotel.amenities.join(", ") : "",
            rooms: hotel.rooms || [],
        })
    }

    function handleSaveEdit() {
        if (!editTarget) return

        const priceNum = Number(form.pricePerNight) || 0

        updateHotel({
            ...editTarget,
            name: form.name,
            destination: form.destination,
            pricePerNight: priceNum,
            description: form.description,
            image: form.image || editTarget.image,
            amenities: form.amenities.split(",").map(s => s.trim()).filter(Boolean),
            rooms: form.rooms,
        })

        toast.success(`Hotel "${form.name}" updated successfully`)
        setEditTarget(null)
        resetForm()
    }

    function handleAddHotel() {
        const priceNum = Number(form.pricePerNight) || 0

        const newHotel: Hotel = {
            id: `hotel-${Date.now()}`,
            name: form.name,
            destination: form.destination,
            pricePerNight: priceNum,
            rating: 4.5,
            reviewCount: 0,
            image: form.image || "/images/hotel-ritz.jpg",
            description: form.description,
            amenities: form.amenities.split(",").map(s => s.trim()).filter(Boolean),
            rooms: form.rooms,
            status: "Active",
            bookingsCount: 0,
        }
        addHotel(newHotel)
        toast.success(`Hotel "${form.name}" added successfully`)
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
                    <h1 className="text-2xl font-bold tracking-tight text-foreground font-playfair">
                        Hotel Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your hotel listings, rooms, and availability.
                    </p>
                </div>
                <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Hotel
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-10">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-bold font-playfair">Add New Hotel</DialogTitle>
                            <DialogDescription>
                                Fill in the details to create a new luxury hotel listing.
                            </DialogDescription>
                        </DialogHeader>
                        <HotelFormContent
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
                        <DialogFooter className="mt-8">
                            <Button variant="outline" onClick={() => setAddOpen(false)} className="rounded-xl px-8">Cancel</Button>
                            <Button className="bg-primary text-primary-foreground hover:bg-gold hover:text-gold-foreground rounded-xl px-8 font-bold" onClick={handleAddHotel}>
                                Create Hotel Listing
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <Card className="overflow-hidden border-none shadow-sm bg-secondary/20">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search hotels by name or destination..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-background border-none shadow-none h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold">All Hotels</CardTitle>
                            <CardDescription>A list of all your hotel properties.</CardDescription>
                        </div>
                        <Badge variant="secondary" className="px-3 py-1 rounded-lg">
                            {filtered.length} Properties
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-secondary/30">
                                <TableRow className="border-none">
                                    <TableHead className="font-bold py-4">Hotel</TableHead>
                                    <TableHead className="hidden md:table-cell font-bold py-4">Destination</TableHead>
                                    <TableHead className="font-bold py-4">Price/Night</TableHead>
                                    <TableHead className="hidden sm:table-cell font-bold py-4">Rating</TableHead>
                                    <TableHead className="hidden sm:table-cell font-bold py-4 text-center">Rooms</TableHead>
                                    <TableHead className="font-bold py-4">Status</TableHead>
                                    <TableHead className="w-12 py-4"><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((hotel) => (
                                    <TableRow key={hotel.id} className="group hover:bg-secondary/10 transition-colors">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl border bg-secondary/20 shadow-sm">
                                                    <Image src={hotel.image} alt={hotel.name} fill unoptimized className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground truncate max-w-[150px] sm:max-w-none">{hotel.name}</span>
                                                    <span className="text-[10px] sm:hidden text-muted-foreground">{hotel.destination}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden text-muted-foreground md:table-cell font-medium py-4">{hotel.destination}</TableCell>
                                        <TableCell className="font-bold text-foreground py-4">₹{hotel.pricePerNight.toLocaleString()}</TableCell>
                                        <TableCell className="hidden sm:table-cell py-4">
                                            <div className="flex items-center gap-1 bg-gold/10 text-gold-foreground w-fit px-2 py-0.5 rounded-lg border border-gold/20">
                                                <Star className="h-3 w-3 fill-gold text-gold" />
                                                <span className="text-xs font-bold">{hotel.rating}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-center py-4">
                                            <Badge variant="outline" className="font-bold text-[10px] rounded-md px-2 border-primary/20 text-primary">
                                                {hotel.rooms?.length || 0} Types
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={hotel.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(hotel)}
                                                    className="data-[state=checked]:bg-emerald-500"
                                                />
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[10px] font-bold uppercase",
                                                        hotel.status === "Active"
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                            : "border-muted bg-muted text-muted-foreground"
                                                    )}
                                                >
                                                    {hotel.status}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary/40">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl p-2 min-w-[160px]">
                                                    <Link href={`/hotels/${hotel.id}/rooms`} target="_blank">
                                                        <DropdownMenuItem className="rounded-lg gap-2 font-medium">
                                                            <ExternalLink className="h-4 w-4 text-primary" />
                                                            View on Site
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem onClick={() => openEdit(hotel)} className="rounded-lg gap-2 font-medium">
                                                        <Pencil className="h-4 w-4 text-blue-500" />
                                                        Edit Hotel
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(hotel)} className="rounded-lg gap-2 font-medium">
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete Property
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-48 text-center bg-secondary/5">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Search className="h-8 w-8 text-muted-foreground/30" />
                                                <p className="text-muted-foreground font-medium">No hotels found matching your search.</p>
                                                <Button variant="outline" size="sm" onClick={() => setSearch("")} className="mt-2 rounded-xl">Clear Search</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-10">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold font-playfair">Edit Hotel Details</DialogTitle>
                        <DialogDescription>Update the property information, amenities, and room types.</DialogDescription>
                    </DialogHeader>
                    <HotelFormContent
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
                    <DialogFooter className="mt-8">
                        <Button variant="outline" onClick={() => setEditTarget(null)} className="rounded-xl px-8">Cancel</Button>
                        <Button className="bg-primary text-primary-foreground hover:bg-gold hover:text-gold-foreground rounded-xl px-8 font-bold" onClick={handleSaveEdit}>
                            Save All Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="rounded-3xl border-none shadow-2xl p-8 max-w-sm">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <div className="text-center">
                            <DialogTitle className="text-xl font-bold">Delete Hotel?</DialogTitle>
                            <DialogDescription className="pt-2 text-muted-foreground">
                                You are about to permanentely delete <span className="font-bold text-foreground">"{deleteTarget?.name}"</span>. This will also remove all associated room data.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <div className="mt-8 flex flex-col gap-3">
                        <Button variant="destructive" onClick={handleDelete} className="w-full rounded-xl font-bold h-12">Confirm Delete</Button>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)} className="w-full rounded-xl h-12 border-muted hover:bg-secondary/10">Keep Property</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function HotelFormContent({
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
                        <Label className="text-xs font-bold font-playfair uppercase">Hotel Name</Label>
                        <Input
                            placeholder="e.g. Ayana Resort & Spa"
                            value={form.name}
                            onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
                            className="bg-background rounded-xl border-none shadow-sm h-11"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold font-playfair uppercase">Destination</Label>
                            <Input
                                placeholder="e.g. Bali, Indonesia"
                                value={form.destination}
                                onChange={e => setForm((f: any) => ({ ...f, destination: e.target.value }))}
                                className="bg-background rounded-xl border-none shadow-sm h-11"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold font-playfair uppercase">Base Price/Night (₹)</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 15000"
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
                        <Label className="text-xs font-bold font-playfair uppercase">Property Image Selection</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="/images/hotel-ritz.jpg"
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
                        <Label className="text-xs font-bold font-playfair uppercase">Property Description</Label>
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
                    placeholder="e.g. Free WiFi, Infinity Pool, Spa, Gym, Private Beach"
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
                                                placeholder="e.g. Garden Villa"
                                                value={room.type}
                                                onChange={e => updateRoom(index, 'type', e.target.value)}
                                                className="h-10 rounded-xl bg-background border-none shadow-sm font-semibold"
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">Price/Night (₹)</Label>
                                            <Input
                                                type="number"
                                                placeholder="12000"
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
                                                    placeholder="450"
                                                    value={room.taxesAndFees || ""}
                                                    onChange={e => updateRoom(index, 'taxesAndFees', Number(e.target.value))}
                                                    className="h-10 rounded-xl bg-background border-none shadow-sm pl-10 font-medium italic text-muted-foreground"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">Short Description</Label>
                                            <Input
                                                placeholder="e.g. Private balcony overlooking the tea gardens."
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
                            <p className="text-xs text-muted-foreground font-medium">No luxury room types added yet. Define them to show on the public page.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
