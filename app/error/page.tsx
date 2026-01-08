import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-red-600">Something went wrong</h1>
            <p className="text-gray-500">Sorry, we couldn't create your account or log you in.</p>
            <Link href="/login">
                <Button>Try Again</Button>
            </Link>
        </div>
    );
}