"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PresetCard } from "./PresetCard";
import type { PresetProps } from "./PresetCard";
import MaterialIcon from "@/components/MaterialIcon";

interface PresetGridProps {
    presets: PresetProps[];
}

export function PresetGrid({ presets }: PresetGridProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "popular";

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", newSort);
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">Showing <span className="text-foreground font-medium">{presets.length}</span> presets</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground relative">
                    <span>Sort by:</span>
                    <div className="relative flex items-center gap-1 group">
                        <select
                            value={currentSort}
                            onChange={handleSortChange}
                            className="appearance-none bg-transparent text-foreground font-medium pr-6 py-1 focus:outline-none cursor-pointer z-10"
                        >
                            <option value="newest" className="bg-[#121212] text-foreground">Newest</option>
                            <option value="popular" className="bg-[#121212] text-foreground">Popular</option>
                            <option value="oldest" className="bg-[#121212] text-foreground">Oldest</option>
                        </select>
                        <MaterialIcon name="expand_more" className="text-base absolute right-0 pointer-events-none group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {presets.map((preset) => (
                    <PresetCard key={preset.id} {...preset} />
                ))}
            </div>

            {/* Pagination Controls match original design */}
            <div className="flex justify-center items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#262626] text-muted-foreground hover:bg-[#121212] transition-colors disabled:opacity-50">
                    &lt;
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-black font-medium">
                    1
                </button>
                {/* ... other standard pagination buttons ... */}
            </div>
        </div>
    );
}
