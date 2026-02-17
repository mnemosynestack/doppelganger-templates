"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import MaterialIcon from "@/components/MaterialIcon";

function SigninContent() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const verified = searchParams.get("verified");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Invalid credentials");
            }

            router.push("/");
            router.refresh(); // Refresh to update Navbar
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-[#0a0a0a] border border-[#262626] rounded-xl">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                    Sign in to your Doppelganger account
                </p>
            </div>

            {verified && (
                <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-lg flex items-center gap-2">
                    <MaterialIcon name="check_circle" className="text-sm" />
                    Email verified! You can now sign in.
                </div>
            )}

            {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg flex items-center gap-2">
                    <MaterialIcon name="error" className="text-sm" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        className="w-full bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-zinc-700 transition-colors"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                        Password
                    </label>
                    <input
                        type="password"
                        required
                        className="w-full bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-zinc-700 transition-colors"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 mt-6"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-foreground hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}

export default function SigninPage() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
                <SigninContent />
            </Suspense>
        </div>
    );
}
