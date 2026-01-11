'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { addExpense } from "../actions"
import { scanReceipt } from "../utils" // Import our new AI function
import { useState, ChangeEvent } from "react"
import { Loader2, ScanLine } from "lucide-react"

export function AddExpenseDialog() {
    const [open, setOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)

    // Form State
    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsScanning(true)

        const formData = new FormData()
        formData.append("file", file)

        // Call the AI
        const data = await scanReceipt(formData)

        if (data) {
            setTitle(data.title || "")
            setAmount(data.amount?.toString() || "")
            setCategory(data.category || "Other")
        }

        setIsScanning(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>+ Add Expense</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogDescription>
                        Upload a receipt to auto-fill, or type manually.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* AI Upload Section */}
                    <div className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg bg-slate-50">
                        <div className="flex-1">
                            <Label htmlFor="receipt" className="cursor-pointer block text-sm font-medium text-slate-700">
                                {isScanning ? "Scanning Receipt..." : "Upload Receipt for AI Scan"}
                            </Label>
                            <Input
                                id="receipt"
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={isScanning}
                                className="mt-2"
                            />
                        </div>
                        {isScanning ? (
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        ) : (
                            <ScanLine className="h-8 w-8 text-slate-400" />
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or enter details</span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <form
                        action={async (formData) => {
                            await addExpense(formData)
                            setOpen(false)
                            setTitle("")
                            setAmount("")
                            setCategory("")
                        }}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Starbucks"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                name="category"
                                value={category}
                                onValueChange={setCategory}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Transport">Transport</SelectItem>
                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                    <SelectItem value="Bills">Bills</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={isScanning}>
                            {isScanning ? "Scanning..." : "Save Expense"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}