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
import { scanReceipt } from "../utils"
import { useState, ChangeEvent, useRef } from "react"
import { Loader2, Camera, FileUp } from "lucide-react"
import imageCompression from "browser-image-compression";

export function AddExpenseDialog() {
    const [open, setOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)

    // Form State
    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")

    // Refs for file inputs
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsScanning(true)

        try {
            // Compression options
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            }

            const compressedFile = await imageCompression(file, options);

            const formData = new FormData()
            formData.append("file", compressedFile)

            const data = await scanReceipt(formData)

            if (data) {
                setTitle(data.title || "")
                setAmount(data.amount?.toString() || "")
                setCategory(data.category || "Other")
            }
        } catch (error) {
            console.error("Error during image compression or scanning:", error);
            // Optionally, show an error message to the user
        } finally {
            setIsScanning(false)
        }
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
                        Use your camera or upload a file to auto-fill.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* AI Upload Section */}
                    <div className="p-4 border-2 border-dashed rounded-lg bg-slate-50 text-center">
                        <Label className="block text-sm font-medium text-slate-700 mb-4">
                            {isScanning ? "Scanning Receipt..." : "Scan a receipt with AI"}
                        </Label>
                        {isScanning ? (
                            <div className="flex justify-center items-center h-24">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" onClick={() => cameraInputRef.current?.click()}>
                                    <Camera className="mr-2 h-4 w-4" /> Camera
                                </Button>
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    <FileUp className="mr-2 h-4 w-4" /> Upload
                                </Button>
                                <Input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>


                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or enter details manually</span>
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