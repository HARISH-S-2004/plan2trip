"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight, UserX, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useData } from "@/context/data-context"

export default function AdminLoginPage() {
    const router = useRouter()
    const { users } = useData()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // 1. Find user by email first to check existence
        const userByEmail = users.find(u => u.email === email)

        if (!userByEmail) {
            setTimeout(() => {
                toast.error("User not existing", {
                    description: "We couldn't find an account with that email.",
                    icon: <UserX className="h-4 w-4" />
                })
                setIsLoading(false)
            }, 800)
            return
        }

        // 2. Check if user is blocked
        if (userByEmail.blocked) {
            setTimeout(() => {
                toast.error("Blocked", {
                    description: "Your account has been suspended by the administrator.",
                    icon: <AlertCircle className="h-4 w-4" />
                })
                setIsLoading(false)
            }, 800)
            return
        }

        // 3. Verify password and role
        if (userByEmail.password === password) {
            // Only allow Admins to access the dashboard
            if (userByEmail.role !== "Admin") {
                setTimeout(() => {
                    toast.error("Access Denied", {
                        description: "You do not have permission to access the admin panel."
                    })
                    setIsLoading(false)
                }, 800)
                return
            }

            setTimeout(() => {
                sessionStorage.setItem("isAdminAuthenticated", "true")
                sessionStorage.setItem("adminName", userByEmail.name)
                toast.success(`Welcome back, ${userByEmail.name}!`)
                router.push("/admin")
                setIsLoading(false)
            }, 1000)
        } else {
            setTimeout(() => {
                toast.error("Invalid Credentials", {
                    description: "The password you entered is incorrect."
                })
                setIsLoading(false)
            }, 800)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
            {/* Animated Immersive Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-5xl px-4 grid lg:grid-cols-2 gap-8 items-center">

                {/* Brand Side */}
                <div className="hidden lg:flex flex-col gap-6 text-white pr-12">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center">
                            <img src="/logo.png" alt="P2T" className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Plan2Trip</h2>
                    </div>
                    <h1 className="text-5xl font-black font-playfair leading-tight">
                        Navigate the world with <span className="text-primary italic">Intelligence.</span>
                    </h1>
                    <p className="text-lg text-white/60 leading-relaxed font-light">
                        Log in to manage your premium travel destinations, bookings, and customer experiences from a single, powerful command center.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <h4 className="text-xl font-bold">100+</h4>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Destinations</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <h4 className="text-xl font-bold">Live</h4>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">System Status</p>
                        </div>
                    </div>
                </div>

                {/* Card Side */}
                <div className="w-full flex justify-center lg:justify-end">
                    <Card className="w-full max-w-md border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden bg-[#121212]/80 backdrop-blur-2xl border-t border-white/10">
                        <CardContent className="p-10 space-y-8">
                            <div className="space-y-2 text-center lg:text-left">
                                <div className="lg:hidden mx-auto h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <ShieldCheck className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold text-white font-playfair">Admin Access</h3>
                                <p className="text-sm text-gray-400">Please enter your authorized credentials.</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Work Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@plan2trip.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500">Security Key</Label>
                                        <button type="button" className="text-[10px] font-bold text-primary/80 hover:text-primary transition-colors">Recover Account</button>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-12 pr-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all bg-primary text-primary-foreground group"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authorizing...</>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Sign In
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            <div className="pt-4 flex flex-col items-center gap-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                                    <ShieldCheck className="h-3 w-3" />
                                    End-to-End Encrypted
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Subtle Footer */}
            <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest pointer-events-none">
                <span>© 2026 Plan2Trip</span>
                <span>Secure Console v2.0</span>
            </div>
        </div>
    )
}
