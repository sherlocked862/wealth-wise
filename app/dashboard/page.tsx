import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/login/actions";
import { AddExpenseDialog } from "./components/AddExpenseDialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { deleteExpense } from "./actions"; // Import the delete action
import { Trash2 } from "lucide-react"; // Import the icon

export default async function Dashboard() {
    const supabase = await createClient();

    // 1. Check Authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // 2. Fetch Expenses (The "Read" Operation)
    // We order by 'created_at' descending so new items appear at top
    const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="flex min-h-screen flex-col p-10 gap-8 bg-gray-50">

            {/* Header Section */}
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-500">Welcome, {user.email}</p>
                </div>

                <div className="flex gap-4">
                    <AddExpenseDialog />
                    <form action={signout}>
                        <Button variant="destructive">Sign Out</Button>
                    </form>
                </div>
            </div>

            {/* Expenses Table Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

                {/* If no expenses, show the empty state. Otherwise, show table. */}
                {(!expenses || expenses.length === 0) ? (
                    <div className="h-32 flex items-center justify-center border-dashed border-2 border-gray-200 rounded-md">
                        <p className="text-gray-400">No expenses recorded yet.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell className="font-medium">{expense.title}</TableCell>
                                    <TableCell>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm">
                      {expense.category}
                    </span>
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {new Date(expense.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        ${expense.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {/* The Delete Button Form */}
                                        <form action={deleteExpense}>
                                            {/* Hidden input to pass the ID to the server */}
                                            <input type="hidden" name="id" value={expense.id} />
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}