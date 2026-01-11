# WealthWise 💰

A smart, AI-powered personal finance tracker that simplifies expense logging. Users can manually track spending or upload photos of receipts to have **Google Gemini AI** automatically extract transaction details.


## 🚀 Key Features
- **AI Receipt Scanning:** Uses Google Gemini (Multimodal AI) to read receipt images and extract Merchant, Total, and Category.
- **Smart Dashboard:** Real-time overview of recent transactions.
- **Secure Authentication:** Complete email/password login system via Supabase Auth.
- **Row Level Security (RLS):** Ensures users can only access their own financial data.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI.
- **Backend:** Supabase (PostgreSQL, Auth, Storage).
- **AI Integration:** Google Gemini API (`gemini-1.5-flash`).
- **Deployment:** Vercel.

## 🏃‍♂️ How to Run Locally
1. Clone the repo: `git clone https://github.com/yourusername/wealth-wise.git`
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   GEMINI_API_KEY=...