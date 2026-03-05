"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { replaceImage, uploadImage } from "@/lib/firestore-service"
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  MoreHorizontal,
  Search,
  ExternalLink,
  Upload,
  Layers,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useData } from "@/context/data-context"
import type { TourPackage, PackageCategory } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function AdminPackagesPage() {
  const { packages, updatePackage, addPackage, deletePackage, categories, updateCategory, addCategory, deleteCategory } = useData()
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [categoryAddOpen, setCategoryAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<TourPackage | null>(null)
  const [categoryEditTarget, setCategoryEditTarget] = useState<PackageCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TourPackage | null>(null)
  const [categoryDeleteTarget, setCategoryDeleteTarget] = useState<PackageCategory | null>(null)
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const categoryFileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  // Form state for add/edit
  const [form, setForm] = useState({
    title: "",
    destination: "",
    duration: "",
    price: "",
    description: "",
    image: "",
    highlights: "",
    inclusions: "",
    exclusions: "",
    category: "",
    isPopular: false,
    itinerary: [] as { day: number; title: string; description: string }[],
  })

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: "",
  })

  const filtered = packages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(search.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(search.toLowerCase())
  )

  function toggleStatus(pkg: TourPackage) {
    updatePackage({
      ...pkg,
      status: pkg.status === "Active" ? "Inactive" : "Active",
    })
    toast.success(`Package "${pkg.title}" status updated to ${pkg.status === "Active" ? "Inactive" : "Active"}`)
  }
  function handleDelete() {
    if (!deleteTarget) return
    deletePackage(deleteTarget.id)
    toast.success(`Package "${deleteTarget.title}" deleted successfully`)
    setDeleteTarget(null)
  }



  async function uploadFile(file: File, folder: string = "packages", customOldUrl?: string): Promise<string | null> {
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
      console.error("Upload error:", error)
      toast.error(`Upload failed: ${error.message || "Unknown error"}. Check if an adblocker is blocking Firebase.`)
      return null
    } finally {
      setUploading(false)
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const url = await uploadFile(file)
      if (url) {
        setForm(f => ({ ...f, image: url }))
        toast.success("Image uploaded successfully")
      }
    }
  }

  async function handleCategoryFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const oldUrl = categoryEditTarget?.image || categoryForm.image
      const url = await uploadFile(file, "categories", oldUrl)
      if (url) {
        setCategoryForm(f => ({ ...f, image: url }))
        toast.success("Category image uploaded successfully")
      }
    }
  }

  function openEdit(pkg: TourPackage) {
    setEditTarget(pkg)
    setForm({
      title: pkg.title,
      destination: pkg.destination,
      duration: pkg.duration,
      price: String(pkg.price),
      description: pkg.description,
      image: pkg.image,
      highlights: pkg.highlights.join(", "),
      inclusions: pkg.inclusions.join(", "),
      exclusions: pkg.exclusions.join(", "),
      category: pkg.category || "",
      isPopular: !!pkg.isPopular,
      itinerary: pkg.itinerary || [],
    })
  }

  function handleSaveEdit() {
    if (!editTarget) return
    updatePackage({
      ...editTarget,
      title: form.title,
      destination: form.destination,
      duration: form.duration,
      price: Number(form.price),
      description: form.description,
      image: form.image || editTarget.image,
      highlights: form.highlights.split(",").map(s => s.trim()).filter(Boolean),
      inclusions: form.inclusions.split(",").map(s => s.trim()).filter(Boolean),
      exclusions: form.exclusions.split(",").map(s => s.trim()).filter(Boolean),
      category: form.category,
      isPopular: form.isPopular,
      itinerary: form.itinerary,
    })
    toast.success(`Package "${form.title}" updated successfully`)
    setEditTarget(null)
  }

  function handleAddPackage() {
    const newPkg: TourPackage = {
      id: `pkg-${Date.now()}`,
      title: form.title,
      destination: form.destination,
      duration: form.duration,
      durationDays: parseInt(form.duration) || 5,
      price: Number(form.price),
      rating: 4.5,
      reviewCount: 0,
      image: form.image || "/images/package-bali.jpg",
      description: form.description,
      highlights: form.highlights.split(",").map(s => s.trim()).filter(Boolean),
      itinerary: form.itinerary,
      inclusions: form.inclusions.split(",").map(s => s.trim()).filter(Boolean),
      exclusions: form.exclusions.split(",").map(s => s.trim()).filter(Boolean),
      status: formStatus,
      bookingsCount: 0,
      category: form.category,
      isPopular: form.isPopular,
    }
    addPackage(newPkg)
    toast.success(`Package "${form.title}" added successfully`)
    setAddOpen(false)
    setForm({ title: "", destination: "", duration: "", price: "", description: "", image: "", highlights: "", inclusions: "", exclusions: "", category: "", isPopular: false, itinerary: [] })
  }

  function addItineraryDay() {
    setForm(f => ({
      ...f,
      itinerary: [
        ...f.itinerary,
        { day: f.itinerary.length + 1, title: "", description: "" }
      ]
    }))
  }

  function removeItineraryDay(index: number) {
    setForm(f => ({
      ...f,
      itinerary: f.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 }))
    }))
  }

  function updateItineraryDay(index: number, field: "title" | "description", value: string) {
    setForm(f => ({
      ...f,
      itinerary: f.itinerary.map((day, i) => i === index ? { ...day, [field]: value } : day)
    }))
  }

  // --- Category Handlers ---
  function openCategoryEdit(cat: PackageCategory) {
    setCategoryEditTarget(cat)
    setCategoryForm({
      name: cat.name,
      image: cat.image,
    })
  }

  function handleSaveCategoryEdit() {
    if (!categoryEditTarget) return
    updateCategory({
      ...categoryEditTarget,
      name: categoryForm.name,
      image: categoryForm.image,
    })
    toast.success(`Category "${categoryForm.name}" updated successfully`)
    setCategoryEditTarget(null)
  }

  function handleAddCategory() {
    if (!categoryForm.name) {
      toast.error("Please enter a category title.")
      return
    }
    const newCat: PackageCategory = {
      id: `cat-${Date.now()}`,
      name: categoryForm.name,
      image: categoryForm.image || "/images/package-kerala.jpg",
    }
    addCategory(newCat)
    toast.success(`Category "${categoryForm.name}" added successfully`)
    setCategoryAddOpen(false)
    setCategoryForm({ name: "", image: "" })
  }

  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: packages.filter(pkg => pkg.category === cat.name).length
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-playfair">
            Travel Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your tour packages and home page categories.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm("This will refresh your local view and attempt to re-sync with Firestore. Continue?")) {
              window.location.reload();
            }
          }}
          className="text-primary hover:bg-primary/10 border-primary/20 text-[10px] font-bold uppercase tracking-widest h-7"
        >
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl">
          <TabsTrigger value="packages">Tour Packages</TabsTrigger>
          <TabsTrigger value="categories">Popular Categories</TabsTrigger>
          <TabsTrigger value="popular-packages">Popular Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6 pt-6">
          <div className="flex justify-end">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setForm({
                  title: "",
                  destination: "",
                  duration: "",
                  price: "",
                  description: "",
                  image: "",
                  highlights: "",
                  inclusions: "",
                  exclusions: "",
                  category: "",
                  isPopular: false,
                  itinerary: [],
                })
                setFormStatus("Active")
                setAddOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </div>

          <Card className="gap-0 py-0">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search packages by title or destination..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                All Packages
                <Badge variant="secondary" className="ml-2 font-normal">
                  {filtered.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                A list of all travel packages with their status and details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead className="hidden md:table-cell">Destination</TableHead>
                    <TableHead className="hidden lg:table-cell">Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden sm:table-cell">Rating</TableHead>
                    <TableHead className="hidden sm:table-cell">Bookings</TableHead>
                    <TableHead className="text-center">Popular</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md font-bold">
                            <Image src={pkg.image} alt={pkg.title} fill unoptimized className="object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{pkg.title}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{pkg.category || "No Category"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell font-medium">{pkg.destination}</TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell font-medium">{pkg.duration}</TableCell>
                      <TableCell className="font-bold text-foreground">₹{pkg.price.toLocaleString()}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1 font-medium">
                          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                          <span className="text-sm text-muted-foreground">{pkg.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell font-medium">{pkg.bookingsCount}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch
                            checked={!!pkg.isPopular}
                            onCheckedChange={() => updatePackage({ ...pkg, isPopular: !pkg.isPopular })}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={pkg.status === "Active"}
                            onCheckedChange={() => toggleStatus(pkg)}
                          />
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold uppercase",
                              pkg.status === "Active"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-muted bg-muted text-muted-foreground"
                            )}
                          >
                            {pkg.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/packages/${pkg.id}`} target="_blank">
                            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary rounded-lg border-primary/20">
                              <ExternalLink className="h-3 w-3" />
                              View
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" onClick={() => openEdit(pkg)} className="h-8 gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary rounded-lg border-primary/20">
                            <Pencil className="h-3 w-3" />
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(pkg)} className="rounded-lg">
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
        </TabsContent>

        <TabsContent value="categories" className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold font-playfair">Popular Categories</h2>
                <p className="text-xs text-muted-foreground font-medium">Manage the category cards shown on the home page.</p>
              </div>
              <Dialog open={categoryAddOpen} onOpenChange={setCategoryAddOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Category Card</DialogTitle>
                    <DialogDescription>These appear on the home page "Popular Packages" section.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Category Title</Label>
                      <Input placeholder="e.g. South India Tour Packages" value={categoryForm.name} onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Category Image Selection</Label>
                      <div className="flex gap-2">
                        <Input placeholder="/images/package-kerala.jpg" value={categoryForm.image} onChange={e => setCategoryForm(f => ({ ...f, image: e.target.value }))} className="flex-1" />
                        <input type="file" ref={categoryFileInputRef} className="hidden" accept="image/*" onChange={handleCategoryFileChange} />
                        <Button type="button" variant="outline" onClick={() => categoryFileInputRef.current?.click()} className="gap-2 shrink-0" disabled={uploading}>
                          <Upload className="h-4 w-4" />
                          {uploading ? "Uploading..." : "Upload"}
                        </Button>
                      </div>
                      {categoryForm.image && (
                        <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border bg-slate-100">
                          <img src={categoryForm.image} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCategoryAddOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddCategory}>Add Category</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoriesWithCounts.map((cat) => (
                <Card key={cat.id} className="overflow-hidden group border-border/50 hover:border-primary/20 transition-all rounded-2xl shadow-sm flex flex-col">
                  <div className="relative aspect-video bg-slate-100">
                    <img src={cat.image} alt={cat.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-sm font-bold font-playfair">{cat.name}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <Badge className="bg-gold text-black hover:bg-gold/90 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                          {cat.count} Tours
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-0 flex-1">
                    <div className="p-3 bg-card/50 backdrop-blur-sm flex gap-2 justify-end border-b">
                      <Button variant="ghost" size="sm" onClick={() => openCategoryEdit(cat)} className="h-8 gap-1.5 text-xs font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Pencil className="h-3 w-3" />
                        Edit Card
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setCategoryDeleteTarget(cat)} className="h-8 gap-1.5 text-xs font-semibold rounded-lg text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="packages" className="border-none">
                        <AccordionTrigger className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:no-underline">
                          Included Packages
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-2">
                          <div className="space-y-1">
                            {packages
                              .filter(pkg => pkg.category === cat.name)
                              .map(pkg => (
                                <div key={pkg.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors group/item">
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="relative h-8 w-8 rounded overflow-hidden shrink-0 border">
                                      <Image src={pkg.image} alt={pkg.title} fill unoptimized className="object-cover" />
                                    </div>
                                    <span className="text-xs font-semibold truncate text-foreground">{pkg.title}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openEdit(pkg)}
                                      className="h-7 w-7 p-0 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updatePackage({ ...pkg, category: "" })}
                                      className="h-7 w-7 p-0 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            {packages.filter(pkg => pkg.category === cat.name).length === 0 && (
                              <p className="text-[10px] text-center text-muted-foreground py-2 italic font-medium">
                                No packages assigned to this category.
                              </p>
                            )}

                            <div className="mt-2 pt-2 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-[10px] uppercase tracking-wider font-bold h-7 gap-1 border-dashed hover:border-primary hover:text-primary transition-all rounded-lg"
                                onClick={() => {
                                  setForm({
                                    title: "",
                                    destination: "",
                                    duration: "",
                                    price: "",
                                    description: "",
                                    image: "",
                                    highlights: "",
                                    inclusions: "",
                                    exclusions: "",
                                    category: cat.name,
                                    isPopular: false,
                                    itinerary: [],
                                  })
                                  setAddOpen(true)
                                }}
                              >
                                <Plus className="h-2.5 w-2.5" />
                                Add Package to {cat.name}
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="popular-packages" className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold font-playfair">Manage Popular Packages</h2>
                <p className="text-xs text-muted-foreground font-medium">Quickly enable or disable packages for the "Popular" section.</p>
              </div>
            </div>

            <Card className="gap-0 py-0">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search all packages to feature..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((pkg) => (
                <Card key={`pop-mgmt-${pkg.id}`} className={cn(
                  "overflow-hidden transition-all rounded-xl border-border/50 shadow-sm",
                  pkg.isPopular ? "border-amber-500/50 bg-amber-50/10 ring-1 ring-amber-500/20" : ""
                )}>
                  <div className="flex p-3 gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                      <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-foreground">{pkg.title}</p>
                      <p className="text-[10px] text-muted-foreground font-medium truncate mb-2">{pkg.destination}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-bold uppercase",
                          pkg.isPopular ? "border-amber-500 text-amber-600 bg-amber-50" : "text-muted-foreground"
                        )}>
                          {pkg.isPopular ? "Popular" : "Standard"}
                        </Badge>
                        <Switch
                          checked={!!pkg.isPopular}
                          onCheckedChange={() => updatePackage({ ...pkg, isPopular: !pkg.isPopular })}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>Update the package details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Package Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Destination</Label>
                <Input value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Duration</Label>
                <Input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price per Person (₹)</Label>
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Package Image Selection</Label>
              <div className="flex gap-2">
                <Input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="flex-1" />
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2 shrink-0" disabled={uploading}>
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              {form.image && (
                <div className="mt-2 relative aspect-[16/9] rounded-lg overflow-hidden border">
                  <Image src={form.image} alt="Preview" fill unoptimized className="object-cover" />
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Popular Selection</Label>
                <p className="text-[11px] text-muted-foreground">Feature this package in the popular section.</p>
              </div>
              <Switch
                checked={form.isPopular}
                onCheckedChange={(checked) => setForm(f => ({ ...f, isPopular: checked }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Active Status</Label>
                <p className="text-[11px] text-muted-foreground">Make this package visible to customers.</p>
              </div>
              <Switch
                checked={editTarget?.status === "Active"}
                onCheckedChange={() => {
                  if (editTarget) {
                    setEditTarget({
                      ...editTarget,
                      status: editTarget.status === "Active" ? "Inactive" : "Active"
                    })
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Highlights (comma separated)</Label>
              <Input value={form.highlights} onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Inclusions (comma separated)</Label>
                <Input value={form.inclusions} onChange={e => setForm(f => ({ ...f, inclusions: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Exclusions (comma separated)</Label>
                <Input value={form.exclusions} onChange={e => setForm(f => ({ ...f, exclusions: e.target.value }))} />
              </div>
            </div>

            {/* Itinerary Management */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Itinerary Plan</Label>
                  <p className="text-xs text-muted-foreground">Update the day-by-day travel schedule.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Day
                </Button>
              </div>
              {form.itinerary.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                  <p className="text-sm text-muted-foreground">No itinerary days added yet.</p>
                  <Button type="button" variant="link" size="sm" onClick={addItineraryDay} className="mt-1">Click to add Day 1</Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {form.itinerary.map((day, index) => (
                    <div key={index} className="space-y-3 rounded-lg border bg-secondary/30 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">Day {day.day}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeItineraryDay(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs">Day Title</Label>
                        <Input placeholder="Day Title" value={day.title} onChange={e => updateItineraryDay(index, "title", e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs">Activities Description</Label>
                        <Textarea placeholder="What happens on this day?" className="min-h-[80px]" value={day.description} onChange={e => updateItineraryDay(index, "description", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Link href={`/packages/${editTarget?.id}`} target="_blank">
              <Button variant="link" size="sm" className="h-8 gap-1 p-0 text-xs text-muted-foreground hover:text-primary">
                <ExternalLink className="h-3 w-3" />
                Preview Public Page
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Category Edit Dialog */}
      < Dialog open={!!categoryEditTarget} onOpenChange={(open) => !open && setCategoryEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category Card</DialogTitle>
            <DialogDescription>Update the title and image for this home page category.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Category Title</Label>
              <Input value={categoryForm.name} onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label>Category Image Selection</Label>
              <div className="flex gap-2">
                <Input value={categoryForm.image} onChange={e => setCategoryForm(f => ({ ...f, image: e.target.value }))} className="flex-1" />
                <input type="file" ref={categoryFileInputRef} className="hidden" accept="image/*" onChange={handleCategoryFileChange} />
                <Button type="button" variant="outline" onClick={() => categoryFileInputRef.current?.click()} className="gap-2 shrink-0" disabled={uploading}>
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              {categoryForm.image && (
                <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border bg-slate-100">
                  <img src={categoryForm.image} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryEditTarget(null)}>Cancel</Button>
            <Button onClick={handleSaveCategoryEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Category Delete confirmation dialog */}
      < Dialog open={!!categoryDeleteTarget} onOpenChange={(open) => !open && setCategoryDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{categoryDeleteTarget?.name}&rdquo;? It will be removed from the home page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (categoryDeleteTarget) deleteCategory(categoryDeleteTarget.id); setCategoryDeleteTarget(null); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Delete confirmation dialog */}
      < Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >
      {/* Add New Package Dialog */}
      < Dialog open={addOpen} onOpenChange={setAddOpen} >
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Package</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new travel package.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pkg-title">Package Title</Label>
              <Input id="pkg-title" placeholder="e.g. Bali Paradise Getaway" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pkg-dest">Destination</Label>
                <Input id="pkg-dest" placeholder="e.g. Bali, Indonesia" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pkg-dur">Duration</Label>
                <Input id="pkg-dur" placeholder="e.g. 7 Days / 6 Nights" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pkg-price">Price per Person (₹)</Label>
                <Input id="pkg-price" type="number" placeholder="e.g. 1299" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pkg-cat">Category</Label>
                <Input id="pkg-cat" placeholder="e.g. Family Tour Packages" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pkg-image">Package Image Selection</Label>
              <div className="flex gap-2">
                <Input id="pkg-image" placeholder="/images/package-bali.jpg" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="flex-1" />
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2 shrink-0" disabled={uploading}>
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pkg-desc">Description</Label>
              <Textarea id="pkg-desc" placeholder="Describe the package..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Initial Status</Label>
                <p className="text-[11px] text-muted-foreground">Set package as Active or Inactive on creation.</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-[10px]", formStatus === "Active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground")}>
                  {formStatus}
                </Badge>
                <Switch
                  checked={formStatus === "Active"}
                  onCheckedChange={(checked) => setFormStatus(checked ? "Active" : "Inactive")}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pkg-highlights">Highlights (comma separated)</Label>
              <Input id="pkg-highlights" placeholder="e.g. Guided Trek, Scuba Diving, Luxury Resort" value={form.highlights} onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pkg-incl">Inclusions (comma separated)</Label>
                <Input id="pkg-incl" placeholder="e.g. Flights, Breakfast, Taxes" value={form.inclusions} onChange={e => setForm(f => ({ ...f, inclusions: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pkg-excl">Exclusions (comma separated)</Label>
                <Input id="pkg-excl" placeholder="e.g. Lunch, Insurance" value={form.exclusions} onChange={e => setForm(f => ({ ...f, exclusions: e.target.value }))} />
              </div>
            </div>

            {/* Itinerary Management */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Itinerary Plan</Label>
                  <p className="text-xs text-muted-foreground">Add day-by-day activities for this package.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Day
                </Button>
              </div>
              {form.itinerary.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                  <p className="text-sm text-muted-foreground">No itinerary days added yet.</p>
                  <Button type="button" variant="link" size="sm" onClick={addItineraryDay} className="mt-1">Click to add Day 1</Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {form.itinerary.map((day, index) => (
                    <div key={index} className="space-y-3 rounded-lg border bg-secondary/30 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">Day {day.day}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeItineraryDay(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs">Day Title</Label>
                        <Input placeholder="e.g. Arrival & Landmark Tour" value={day.title} onChange={e => updateItineraryDay(index, "title", e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs">Activities Description</Label>
                        <Textarea placeholder="What happens on this day?" className="min-h-[80px]" value={day.description} onChange={e => updateItineraryDay(index, "description", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddPackage}>
              Create Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >
    </div >
  )
}
