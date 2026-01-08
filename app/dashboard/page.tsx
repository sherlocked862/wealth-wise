import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/login/actions"; // Import the action

export default async function Dashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen flex-col p-10 gap-8 bg-gray-50">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-500">Welcome, {user.email}</p>
                </div>

                {/* Logout Button Form */}
                <form action={signout}>
                    <Button variant="destructive">Sign Out</Button>
                </form>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm h-64 flex items-center justify-center border-dashed border-2 border-gray-200">
                <p className="text-gray-400">No expenses recorded yet.</p>
            </div>
        </div>
    );
}