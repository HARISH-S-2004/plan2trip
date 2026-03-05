"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
    Save,
    Mail,
    Phone,
    MapPin,
    Plus,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useData } from "@/context/data-context"

export default function AdminFooterPage() {
    const { footerData, updateFooter } = useData()
    const [form, setForm] = useState({ ...footerData })
    const [isSaving, setIsSaving] = useState(false)
    const [newDest, setNewDest] = useState("")

    function handleSave() {
        setIsSaving(true)
        updateFooter(form)
        setTimeout(() => {
            setIsSaving(false)
            toast.success("Footer settings updated successfully!")
        }, 500)
    }

    function addDest() {
        if (!newDest) return
        setForm(f => ({
            ...f,
            destinations: [...f.destinations, newDest]
        }))
        setNewDest("")
    }

    function removeDest(dest: string) {
        setForm(f => ({
            ...f,
            destinations: f.destinations.filter(d => d !== dest)
        }))
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground font-playfair">
                        Footer Settings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage global site information, contact details, and footer navigation.
                    </p>
                </div>
                <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-xl shadow-lg shadow-primary/20 w-fit"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* General Info */}
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg font-bold">Company Information</CardTitle>
                        <CardDescription className="text-xs">Main description and company details.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Site Description</Label>
                            <Textarea
                                className="min-h-[120px] rounded-xl border-none bg-secondary/30 focus-visible:ring-primary/20"
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg font-bold">Contact Details</CardTitle>
                        <CardDescription className="text-xs">Contact information displayed in the footer.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <Mail className="h-3.5 w-3.5 text-primary" />
                                Email Address
                            </Label>
                            <Input
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                className="h-11 rounded-xl border-none bg-secondary/30"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <Phone className="h-3.5 w-3.5 text-primary" />
                                Phone Number
                            </Label>
                            <Input
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                className="h-11 rounded-xl border-none bg-secondary/30"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                Office Address
                            </Label>
                            <Input
                                value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                className="h-11 rounded-xl border-none bg-secondary/30"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Destinations */}
                <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg font-bold">Footer Destinations</CardTitle>
                        <CardDescription className="text-xs">The links displayed in the "Destinations" column of the footer.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {form.destinations.map((dest) => (
                                <div key={dest} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-[11px] font-bold text-foreground">
                                    {dest}
                                    <button onClick={() => removeDest(dest)} className="ml-1 text-muted-foreground hover:text-red-500 transition-colors">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a destination (e.g., Goa, Kerala)"
                                value={newDest}
                                onChange={e => setNewDest(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addDest()}
                                className="flex-1 sm:max-w-[400px] h-11 rounded-xl border-none bg-secondary/30"
                            />
                            <Button variant="outline" size="sm" onClick={addDest} className="h-11 rounded-xl px-6 border-primary/20 text-primary hover:bg-primary/5">
                                <Plus className="mr-1 h-4 w-4" />
                                <span className="hidden sm:inline">Add</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
