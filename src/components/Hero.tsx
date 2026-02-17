"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import MaterialIcon from "@/components/MaterialIcon";

export function Hero() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") || "");

    useEffect(() => {
        setQuery(searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (value: string) => {
        setQuery(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex flex-col items-center text-center py-20 px-4 relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="z-10 flex flex-col items-center">
                <div className="mb-8 p-0.5 rounded-full bg-linear-to-r from-green-500/20 to-green-500/0">
                    <div className="bg-[#0a0a0a] px-3 py-1 rounded-full border border-green-900/30 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/80">Community Powered</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    Doppelganger <span className="text-muted-foreground">Templates</span>
                </h1>

                <p className="text-muted-foreground max-w-xl text-lg mb-10 leading-relaxed">
                    Jumpstart your automation with pre-built workflows from the community. Scrape data, test flows, or automate repetitive tasks in seconds.
                </p>

                <div className="relative w-full max-w-lg group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                        <MaterialIcon name="search" className="text-base" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-[#121212] border border-[#262626] text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all placeholder:text-muted-foreground/50 text-foreground"
                        placeholder="Search presets (e.g., 'LinkedIn Scraper', 'SEO Audit')..."
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
