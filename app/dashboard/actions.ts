'use server'

import { createClient } from "@/app/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function addExpense(formData: FormData) {
    const supabase = await createClient()

    // 1. Get the current user so we know who owns this expense
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        console.error("User not found")
        return
    }

    // 2. Extract data from the form
    const title = formData.get('title')
    const amount = formData.get('amount')
    const category = formData.get('category')

    // 3. Insert into Supabase
    const { error } = await supabase.from('expenses').insert({
        title,
        amount,
        category,
        user_id: user.id // IMPORTANT: Link expense to user
    })

    if (error) {
        console.error("Error inserting expense:", error)
        return
    }

    // 4. Refresh the dashboard to show the new data instantly
    revalidatePath('/dashboard')
}


export async function deleteExpense(formData: FormData) {
    const supabase = await createClient()

    // 1. Get the ID of the item to delete
    const id = formData.get('id') as string

    // 2. Delete it from Supabase
    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

    if (error) {
        console.error("Error deleting:", error)
        return
    }

    // 3. Refresh the page
    revalidatePath('/dashboard')
}