"use client"

import { useState } from "react"
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
            alert("Footer settings updated successfully!")
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
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Footer Settings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage global site information, contact details, and footer navigation.
                    </p>
                </div>
                <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* General Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Company Information</CardTitle>
                        <CardDescription>Main description and company details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Site Description</Label>
                            <Textarea
                                className="min-h-[120px]"
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Contact Details</CardTitle>
                        <CardDescription>Contact information displayed in the footer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-primary" />
                                Email Address
                            </Label>
                            <Input
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-primary" />
                                Phone Number
                            </Label>
                            <Input
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                Office Address
                            </Label>
                            <Input
                                value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Destinations */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Footer Destinations</CardTitle>
                        <CardDescription>The links displayed in the "Destinations" column of the footer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {form.destinations.map((dest) => (
                                <div key={dest} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground">
                                    {dest}
                                    <button onClick={() => removeDest(dest)} className="ml-1 text-muted-foreground hover:text-red-500">
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
                                className="max-w-[300px]"
                            />
                            <Button variant="outline" size="sm" onClick={addDest}>
                                <Plus className="mr-1 h-4 w-4" />
                                Add
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
