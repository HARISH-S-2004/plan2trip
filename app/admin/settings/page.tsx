"use client"

import { useState, useEffect } from "react"
import { Save, CheckCircle2 } from "lucide-react"
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
      // Reset the success indicator after 3 seconds
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // handle error
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage platform preferences and configuration.
          </p>
        </div>
        {isDirty && (
          <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">General</CardTitle>
            <CardDescription>
              Basic platform configuration settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                value={settings.siteName}
                onChange={e => update("siteName", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                value={settings.contactEmail}
                type="email"
                onChange={e => update("contactEmail", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={val => update("currency", val)}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={val => update("timezone", val)}
              >
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>
              Configure email and alert preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-medium">
                  Email Notifications
                </Label>
                <span className="text-xs text-muted-foreground">
                  Receive email updates for important events.
                </span>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={val => update("emailNotifications", val)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-medium">Booking Alerts</Label>
                <span className="text-xs text-muted-foreground">
                  Get notified when a new booking is made.
                </span>
              </div>
              <Switch
                checked={settings.bookingAlerts}
                onCheckedChange={val => update("bookingAlerts", val)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-medium">
                  Maintenance Mode
                </Label>
                <span className="text-xs text-muted-foreground">
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
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Settings saved successfully!
          </span>
        )}
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleSave}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
