"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import MaterialIcon from "@/components/MaterialIcon";
import clsx from "clsx";

const categoryIcons: Record<string, string> = {
    "All Presets": "grid_view",
    "QA Testing": "science",
    "Lead Gen": "group",
    "Social Media": "share",
    "Shopping": "shopping_cart",
    "Monitoring": "insights",
    "AI": "smart_toy",
    "Jobs": "work",
    "News": "article",
    "Videos": "play_circle",
    "Reviews": "rate_review",
    "Developer Tools": "code",
    "SEO": "search",
    "Real Estate": "real_estate_agent",
    "Travel": "flight",
    "Other": "more_horiz"
};



interface SidebarProps {
    counts: Record<string, number>;
}

export function Sidebar({ counts }: SidebarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentCategory = searchParams.get("category") || "All Presets";
    const [showAllCategories, setShowAllCategories] = useState(false);

    const handleCategoryClick = (categoryName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryName === "All Presets") {
            params.delete("category");
        } else {
            params.set("category", categoryName);
        }
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const categories = [
        { name: "All Presets", count: counts["All Presets"] || 0, icon: categoryIcons["All Presets"] },
        { name: "QA Testing", count: counts["QA Testing"] || 0, icon: categoryIcons["QA Testing"] },
        { name: "Lead Gen", count: counts["Lead Gen"] || 0, icon: categoryIcons["Lead Gen"] },
        { name: "Social Media", count: counts["Social Media"] || 0, icon: categoryIcons["Social Media"] },
        { name: "Shopping", count: counts["Shopping"] || 0, icon: categoryIcons["Shopping"] },
        { name: "Monitoring", count: counts["Monitoring"] || 0, icon: categoryIcons["Monitoring"] },
        { name: "AI", count: counts["AI"] || 0, icon: categoryIcons["AI"] },
        { name: "Jobs", count: counts["Jobs"] || 0, icon: categoryIcons["Jobs"] },
        { name: "News", count: counts["News"] || 0, icon: categoryIcons["News"] },
        { name: "Videos", count: counts["Videos"] || 0, icon: categoryIcons["Videos"] },
        { name: "Reviews", count: counts["Reviews"] || 0, icon: categoryIcons["Reviews"] },
        { name: "Developer Tools", count: counts["Developer Tools"] || 0, icon: categoryIcons["Developer Tools"] },
        { name: "SEO", count: counts["SEO"] || 0, icon: categoryIcons["SEO"] },
        { name: "Real Estate", count: counts["Real Estate"] || 0, icon: categoryIcons["Real Estate"] },
        { name: "Travel", count: counts["Travel"] || 0, icon: categoryIcons["Travel"] },
        { name: "Other", count: counts["Other"] || 0, icon: categoryIcons["Other"] },
    ];

    const displayedCategories = showAllCategories ? categories : categories.slice(0, 6);

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
                    {displayedCategories.map((category) => {
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
                    {categories.length > 6 && (
                        <button
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            className="w-full flex items-center justify-center px-3 py-2 mt-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            {showAllCategories ? "Show Less" : "Show More"}
                            <MaterialIcon name={showAllCategories ? "expand_less" : "expand_more"} className="text-base ml-1" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
