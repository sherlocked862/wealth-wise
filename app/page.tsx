import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-6 bg-slate-50">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">WealthWise</h1>
                <p className="text-xl text-slate-500">Your AI-Powered Finance Companion</p>
            </div>

            {/* This uses the component you just installed */}
            <div className="flex gap-4">
                <Button size="lg">Login</Button>
                <Button variant="outline" size="lg">Sign Up</Button>
            </div>
        </main>
    );
}