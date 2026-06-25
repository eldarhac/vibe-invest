import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vibe Investing — Invest in what you believe",
  description:
    "Describe a trend or belief and get a clear investment research map. Educational purposes only.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
                Vibe Investing
              </a>
              <span className="text-xs text-slate-400 font-medium">
                Educational research only · Not financial advice
              </span>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-100 bg-white mt-16">
            <div className="max-w-5xl mx-auto px-4 py-8 text-center text-xs text-slate-400">
              <p>
                Vibe Investing is for educational and research purposes only. Nothing here is
                personalized financial advice. Always consult a qualified financial adviser.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
