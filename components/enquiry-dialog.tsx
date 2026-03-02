"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EnquiryForm } from "./enquiry-form"
import { ReactNode, useState } from "react"

interface EnquiryDialogProps {
    children: ReactNode
    defaultDestination?: string
}

export function EnquiryDialog({ children, defaultDestination }: EnquiryDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-10 border-none shadow-2xl">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-3xl font-bold font-playfair tracking-tight text-center">Plan Your Perfect Trip</DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground mt-2">
                        Share your travel details and our experts will craft a personalized itinerary for you.
                    </DialogDescription>
                </DialogHeader>
                <EnquiryForm
                    defaultDestination={defaultDestination}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
