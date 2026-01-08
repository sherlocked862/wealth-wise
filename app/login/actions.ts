'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // 1. Get data
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 2. Sign in
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/error')
    }

    // 3. Redirect to Dashboard (FIXED)
    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        console.log(error.message)
        redirect('/error')
    }

    // Redirect to Dashboard (FIXED)
    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}