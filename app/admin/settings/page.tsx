"use client"

import { useState, useEffect } from "react"
import { Save, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useData } from "@/context/data-context"

const SETTINGS_KEY = "p2t_admin_settings"

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useData()
  const [saved, setSaved] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  function update<K extends keyof typeof settings>(key: K, value: any) {
    updateSettings({ ...settings, [key]: value })
    setIsDirty(true)
    setSaved(false)
  }

  function handleSave() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
      setSaved(true)
      setIsDirty(false)
      toast.success("Settings saved successfully!")
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast.error("Failed to save settings.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-playfair">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage platform preferences and configuration.
          </p>
        </div>
        {isDirty && (
          <span className="text-[10px] uppercase tracking-wider text-amber-600 font-black bg-amber-50 border border-amber-200 px-3 py-1 rounded-full w-fit">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg font-bold">General</CardTitle>
            <CardDescription className="text-xs">
              Basic platform configuration settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="site-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Site Name</Label>
              <Input
                id="site-name"
                value={settings.siteName}
                onChange={e => update("siteName", e.target.value)}
                className="h-11 rounded-xl border-none bg-secondary/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Email</Label>
              <Input
                id="contact-email"
                value={settings.contactEmail}
                type="email"
                onChange={e => update("contactEmail", e.target.value)}
                className="h-11 rounded-xl border-none bg-secondary/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Default Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={val => update("currency", val)}
              >
                <SelectTrigger id="currency" className="h-11 rounded-xl border-none bg-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={val => update("timezone", val)}
              >
                <SelectTrigger id="timezone" className="h-11 rounded-xl border-none bg-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern (EST)</SelectItem>
                  <SelectItem value="pst">Pacific (PST)</SelectItem>
                  <SelectItem value="ist">India (IST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg font-bold">Notifications</CardTitle>
            <CardDescription className="text-xs">
              Configure email and alert preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold">
                  Email Notifications
                </Label>
                <span className="text-[10px] text-muted-foreground">
                  Receive email updates for important events.
                </span>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={val => update("emailNotifications", val)}
              />
            </div>
            <Separator className="bg-secondary/50" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold">Booking Alerts</Label>
                <span className="text-[10px] text-muted-foreground">
                  Get notified when a new booking is made.
                </span>
              </div>
              <Switch
                checked={settings.bookingAlerts}
                onCheckedChange={val => update("bookingAlerts", val)}
              />
            </div>
            <Separator className="bg-secondary/50" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold">
                  Maintenance Mode
                </Label>
                <span className="text-[10px] text-muted-foreground">
                  Temporarily disable the public site for maintenance.
                </span>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={val => update("maintenanceMode", val)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-4">
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Settings saved successfully!
          </span>
        )}
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-xl shadow-lg shadow-primary/20 w-full sm:w-auto"
          onClick={handleSave}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
