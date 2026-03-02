"use client"

import { Construction, Loader2, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function MaintenanceView() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px] animate-pulse duration-75" />

            <div className="relative z-10 max-w-2xl px-6 text-center">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                        <div className="relative h-24 w-24 flex items-center justify-center rounded-3xl bg-card border border-border/50 shadow-2xl">
                            <Construction className="h-12 w-12 text-primary" />
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground font-playfair mb-6 leading-tight">
                    Under <span className="text-primary italic">Enhancement</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg mx-auto">
                    Plan2Trip is currently undergoing a scheduled upgrade to bring you an even better travel planning experience. We'll be back shortly!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <div className="flex items-center gap-2 text-sm font-medium bg-secondary/50 px-4 py-2 rounded-full border border-border/40">
                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        Refining Destinantions...
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50 shadow-xl">
                    <div className="text-left space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Need urgent help?</h3>
                        <div className="space-y-3">
                            <a href="mailto:support@plan2trip.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Mail className="h-4 w-4" />
                                </div>
                                plan2trip89@gmail.com
                            </a>
                            <a href="tel:+911234567890" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Phone className="h-4 w-4" />
                                </div>
                                +91 (Live Support)
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-6 text-center md:text-left">
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                            <MapPin className="h-5 w-5 text-primary shrink-0" />
                            <p>Crafting new itineraries from our headquarters in India.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-bold">
                        Follow us for travel updates
                    </p>
                    <div className="mt-4 flex justify-center gap-4">
                        {/* Placeholder for social icons if needed */}
                        <div className="h-1.5 w-12 bg-primary rounded-full" />
                        <div className="h-1.5 w-6 bg-border rounded-full" />
                        <div className="h-1.5 w-6 bg-border rounded-full" />
                    </div>
                </div>
            </div>

            {/* Logo Watermark */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 opacity-20 filter grayscale">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                    <span className="text-xl font-bold">Plan2Trip</span>
                </div>
            </div>
        </div>
    )
}
