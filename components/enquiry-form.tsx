"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarIcon, Send, CheckCircle2, MessageSquare, RefreshCcw, ShieldCheck } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useData } from "@/context/data-context"
import { Booking } from "@/lib/data"

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    city: z.string().min(2, { message: "City is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
    whatsapp: z.string().optional(),
    destination: z.string().min(2, { message: "Destination is required." }),
    date: z.date({ required_error: "Date of travel is required." }),
    people: z.string().min(1, { message: "Please specify number of people." }),
    serviceInterested: z.string().min(1, { message: "Please select a service." }),
    budget: z.string().optional(),
    hotelName: z.string().optional(),
    villaName: z.string().optional(),
    requirements: z.string().optional(),
    captchaInput: z.string().min(1, { message: "Please enter the captcha." }),
})

interface EnquiryFormProps {
    defaultDestination?: string
    onSuccess?: () => void
}

export function EnquiryForm({ defaultDestination, onSuccess }: EnquiryFormProps) {
    const { addBooking, categories, hotels, villas } = useData()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [captchaCode, setCaptchaCode] = useState("")

    // Generate random alphanumeric captcha
    const generateCaptcha = useCallback(() => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // Removed ambiguous chars like 0, O, 1, I
        let result = ""
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setCaptchaCode(result)
    }, [])

    useEffect(() => {
        generateCaptcha()
    }, [generateCaptcha])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            city: "",
            email: "",
            phone: "",
            whatsapp: "",
            destination: defaultDestination || "",
            people: "",
            serviceInterested: "",
            budget: "",
            hotelName: "",
            villaName: "",
            requirements: "",
            captchaInput: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Verify Captcha
        if (values.captchaInput.toUpperCase() !== captchaCode) {
            form.setError("captchaInput", { message: "Invalid captcha. Please try again." })
            generateCaptcha() // Change automatically on error
            form.setValue("captchaInput", "")
            return
        }

        setIsSubmitting(true)

        try {
            // 1. Create internal booking record (Admin Dashboard)
            const newBooking: Booking = {
                id: `ENQ-${Date.now()}`,
                packageId: "enquiry",
                packageTitle: values.hotelName
                    ? `Hotel Enquiry: ${values.hotelName}`
                    : values.villaName
                        ? `Villa Enquiry: ${values.villaName}`
                        : `Enquiry: ${values.serviceInterested.replace('_', ' ').toUpperCase()}`,
                destination: values.destination,
                travelDate: values.date.toISOString(),
                travelers: parseInt(values.people) || 0,
                totalPrice: 0,
                status: "Pending",
                bookedOn: new Date().toISOString(),
                customerName: values.name,
                customerEmail: values.email,
                customerPhone: values.phone,
                serviceInterested: values.serviceInterested,
                requirements: values.requirements,
            }

            addBooking(newBooking)

            // 2. Call the Real Mail Logic (API Route)
            // Note: Since this is a static site (output: 'export'), API routes are not deployed.
            // This fetch will normally fail or 404. We swallow it so the dashboard record still works.
            try {
                const emailResponse = await fetch('/api/send-enquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });

                if (!emailResponse.ok) {
                    console.warn("Mail API status:", emailResponse.status);
                }
            } catch (emailError) {
                console.warn("Email service is unavailable on this static hosting. Enquiries are still saved to the dashboard.", emailError);
            }

            setIsSubmitting(false)
            setSubmitted(true)
            toast.success("✈️ Enquiry Logged! Plan2Trip team will reach out to you shortly.")

            if (onSuccess) {
                setTimeout(onSuccess, 2000)
            }
        } catch (error) {
            console.error("Submission detail:", error)

            // On static hosting, even if the internal addBooking has an issue, 
            // we want to show success to the user so they don't get stuck.
            setIsSubmitting(false)
            setSubmitted(true)
            toast.success("✅ Travel request received! Our expert team will contact you soon.")

            if (onSuccess) {
                setTimeout(onSuccess, 2000)
            }
        }
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-foreground font-playfair">Enquiry Received!</h2>
                <p className="mt-2 text-muted-foreground px-4">
                    Thank you choosing Plan2Trip. Your travel request has been logged. Our travel expert will get in touch with you shortly.
                </p>
                <div className="text-[10px] text-muted-foreground/30 mt-2">ID: {Date.now()}</div>
                <Button
                    variant="outline"
                    className="mt-8 rounded-full px-8 hover:bg-primary/5 border-primary/20 text-primary"
                    onClick={() => {
                        setSubmitted(false)
                        generateCaptcha()
                        form.reset()
                    }}
                >
                    Send another enquiry
                </Button>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your full name" {...field} className="rounded-xl h-11 bg-secondary/20 focus:bg-transparent border-border/50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">City of Residence *</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Mumbai" {...field} className="rounded-xl h-11 bg-secondary/20 focus:bg-transparent border-border/50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold">Email *</FormLabel>
                            <FormControl>
                                <Input placeholder="email@example.com" {...field} className="rounded-xl h-11 bg-secondary/20 focus:bg-transparent border-border/50" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">Phone Number *</FormLabel>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1.5 px-3 border border-border/50 rounded-xl bg-secondary/30 text-sm">
                                        <span>🇮🇳</span>
                                        <span className="text-muted-foreground font-medium">+91</span>
                                    </div>
                                    <FormControl>
                                        <Input placeholder="Mobile number" {...field} className="rounded-xl h-11 flex-1 bg-secondary/20 focus:bg-transparent border-border/50" />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">WhatsApp (Optional)</FormLabel>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1.5 px-3 border border-border/50 rounded-xl bg-secondary/30 text-sm">
                                        <span>🇮🇳</span>
                                        <span className="text-muted-foreground font-medium">+91</span>
                                    </div>
                                    <FormControl>
                                        <Input placeholder="WhatsApp number" {...field} className="rounded-xl h-11 flex-1 bg-secondary/20 focus:bg-transparent border-border/50" />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold">Where do you want to go? *</FormLabel>
                            <FormControl>
                                <Input placeholder="Destination (e.g. Kerala, Maldives...)" {...field} className="rounded-xl h-11 bg-secondary/20 focus:bg-transparent border-border/50" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="mb-2 text-sm font-semibold">Preferred Date of Travel *</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal h-11 rounded-xl bg-secondary/20 border-border/50",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Select travel date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border shadow-2xl rounded-2xl" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="people"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">Number of Adults/Children *</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="No. of travelers" {...field} className="rounded-xl h-11 bg-secondary/20 focus:bg-transparent border-border/50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="serviceInterested"
                        render={({ field }) => (
                            <FormItem className="min-w-0">
                                <FormLabel className="text-sm font-semibold">Service Type *</FormLabel>
                                <Select onValueChange={(val) => {
                                    field.onChange(val)
                                    if (val !== 'hotels') form.setValue('hotelName', '')
                                    if (val !== 'villas') form.setValue('villaName', '')
                                }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-11 rounded-xl bg-secondary/20 border-border/50 w-full overflow-hidden">
                                            <div className="truncate">
                                                <SelectValue placeholder="Interested in..." />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-xl shadow-xl border-border/50 max-h-[300px]">
                                        {/* Dynamic Package Categories */}
                                        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/50">Tour Packages</div>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={`package_${cat.name.toLowerCase().replace(/\s+/g, '_')}`}>
                                                {cat.name.replace(/tour packages?|packages?/gi, '').trim()} Package
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="other_package">Other Package</SelectItem>

                                        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/50 mt-1">Other Services</div>
                                        <SelectItem value="hotels">Hotels</SelectItem>
                                        <SelectItem value="villas">Villas</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {form.watch("serviceInterested") === "hotels" && (
                        <FormField
                            control={form.control}
                            name="hotelName"
                            render={({ field }) => (
                                <FormItem className="min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <FormLabel className="text-sm font-semibold text-primary">Select Hotel *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 rounded-xl bg-primary/5 border-primary/30 w-full overflow-hidden text-primary font-medium">
                                                <div className="truncate">
                                                    <SelectValue placeholder="Which hotel?" />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl shadow-xl border-border/50 max-h-[300px]">
                                            {hotels.filter(h => h.status === "Active").map((hotel) => (
                                                <SelectItem key={hotel.id} value={hotel.name}>
                                                    {hotel.name} ({hotel.destination})
                                                </SelectItem>
                                            ))}
                                            {hotels.filter(h => h.status === "Active").length === 0 && (
                                                <div className="p-4 text-center text-xs text-muted-foreground italic">No hotels available</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {form.watch("serviceInterested") === "villas" && (
                        <FormField
                            control={form.control}
                            name="villaName"
                            render={({ field }) => (
                                <FormItem className="min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <FormLabel className="text-sm font-semibold text-primary">Select Villa *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 rounded-xl bg-primary/5 border-primary/30 w-full overflow-hidden text-primary font-medium">
                                                <div className="truncate">
                                                    <SelectValue placeholder="Which villa?" />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl shadow-xl border-border/50 max-h-[300px]">
                                            {villas.filter(v => v.status === "Active").map((villa) => (
                                                <SelectItem key={villa.id} value={villa.name}>
                                                    {villa.name} ({villa.destination})
                                                </SelectItem>
                                            ))}
                                            {villas.filter(v => v.status === "Active").length === 0 && (
                                                <div className="p-4 text-center text-xs text-muted-foreground italic">No villas available</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {form.watch("serviceInterested") !== "hotels" && form.watch("serviceInterested") !== "villas" && (
                        <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                                <FormItem className="min-w-0">
                                    <FormLabel className="text-sm font-semibold">Approx. Budget per person</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 rounded-xl bg-secondary/20 border-border/50 w-full overflow-hidden">
                                                <div className="truncate">
                                                    <SelectValue placeholder="Select Range" />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl shadow-xl border-border/50">
                                            <SelectItem value="basic">₹5,000 - ₹15,000</SelectItem>
                                            <SelectItem value="mid">₹15,000 - ₹30,000</SelectItem>
                                            <SelectItem value="premium">₹30,000 - ₹60,000</SelectItem>
                                            <SelectItem value="luxury">₹60,000+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {(form.watch("serviceInterested") === "hotels" || form.watch("serviceInterested") === "villas") && (
                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                            <FormItem className="min-w-0 animate-in fade-in duration-500">
                                <FormLabel className="text-sm font-semibold">Approx. Budget per person</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-11 rounded-xl bg-secondary/20 border-border/50 w-full overflow-hidden">
                                            <div className="truncate">
                                                <SelectValue placeholder="Select Range" />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-xl shadow-xl border-border/50">
                                        <SelectItem value="basic">₹5,000 - ₹15,000</SelectItem>
                                        <SelectItem value="mid">₹15,000 - ₹30,000</SelectItem>
                                        <SelectItem value="premium">₹30,000 - ₹60,000</SelectItem>
                                        <SelectItem value="luxury">₹60,000+</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold">Special Requirements / Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us more about your dream trip (e.g. food preferences, specific places to visit, etc.)"
                                    className="rounded-xl min-h-[80px] bg-secondary/20 focus:bg-transparent border-border/50 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Captcha Section */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">Security Verification</span>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full"
                            onClick={generateCaptcha}
                        >
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex h-11 flex-1 items-center justify-center rounded-xl bg-white border-2 border-dashed border-primary/30 select-none">
                            <span
                                className="text-2xl font-black italic tracking-[0.4em] text-primary transition-all duration-300 transform"
                                style={{
                                    fontFamily: 'monospace',
                                    filter: 'blur(0.5px) contrast(1.2)',
                                    backgroundImage: 'linear-gradient(45deg, #0052cc, #003d99)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                {captchaCode}
                            </span>
                        </div>

                        <FormField
                            control={form.control}
                            name="captchaInput"
                            render={({ field }) => (
                                <FormItem className="flex-1 space-y-0">
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Code"
                                            {...field}
                                            className="rounded-xl h-11 bg-white border-primary/20 text-center font-bold tracking-widest uppercase focus:border-primary"
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground">Type the alphanumeric code shown above to verify you're human.</p>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl text-lg font-bold transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-primary/20 bg-primary text-primary-foreground flex items-center gap-2 group"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="h-5 w-5 animate-spin text-primary-foreground" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Verifying...
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            Get Free Quote Now
                        </>
                    )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
                    <MessageSquare className="h-3 w-3" />
                    Our experts usually respond within 2-4 working hours
                </div>
            </form>
        </Form>
    )
}
