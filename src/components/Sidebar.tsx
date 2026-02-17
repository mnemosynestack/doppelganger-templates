"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // Changed import
import MaterialIcon from "@/components/MaterialIcon";
import clsx from "clsx";

const categoryIcons: Record<string, string> = {
    "All Presets": "grid_view",
    "QA Testing": "science",
    "Lead Gen": "group",
    "Social Media": "share",
    "Shopping": "shopping_cart",
    "Monitoring": "insights"
};



interface SidebarProps {
    counts: Record<string, number>;
}

export function Sidebar({ counts }: SidebarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentCategory = searchParams.get("category") || "All Presets";

    const handleCategoryClick = (categoryName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryName === "All Presets") {
            params.delete("category");
        } else {
            params.set("category", categoryName);
        }
        router.push(`/?${params.toString()}`);
    };

    const categories = [
        { name: "All Presets", count: counts["All Presets"] || 0, icon: categoryIcons["All Presets"] },
        { name: "QA Testing", count: counts["QA Testing"] || 0, icon: categoryIcons["QA Testing"] },
        { name: "Lead Gen", count: counts["Lead Gen"] || 0, icon: categoryIcons["Lead Gen"] },
        { name: "Social Media", count: counts["Social Media"] || 0, icon: categoryIcons["Social Media"] },
        { name: "Shopping", count: counts["Shopping"] || 0, icon: categoryIcons["Shopping"] },
        { name: "Monitoring", count: counts["Monitoring"] || 0, icon: categoryIcons["Monitoring"] },
    ];

    return (
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div>
                <Link href="/presets/new">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#0a0a0a] border border-[#262626] hover:border-zinc-700 text-foreground py-2.5 rounded-lg transition-all mb-8 cursor-pointer">
                        <span className="text-xl font-thin">+</span>
                        <span className="text-sm font-medium">Submit Preset</span>
                    </button>
                </Link>

                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Categories</h3>
                <div className="space-y-1">
                    {categories.map((category) => {
                        const isActive = category.name === currentCategory;
                        return (
                            <button
                                key={category.name}
                                onClick={() => handleCategoryClick(category.name)}
                                className={clsx(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                                    isActive
                                        ? "bg-[#171717] text-foreground font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:bg-[#121212]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <MaterialIcon name={category.icon} className="text-base" />
                                    <span>{category.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground/60">{category.count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
