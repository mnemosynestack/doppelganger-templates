"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PresetCard } from "./PresetCard";
import type { PresetProps } from "./PresetCard";
import MaterialIcon from "@/components/MaterialIcon";

interface PresetGridProps {
    presets: PresetProps[];
}

function EmptyState() {
    const router = useRouter();

    return (
        <div
            className="w-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-[#262626] rounded-xl bg-[#0a0a0a]/50"
            role="status"
            aria-live="polite"
        >
            <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center mb-4 border border-[#262626]">
                <MaterialIcon name="search_off" className="text-2xl text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No presets found</h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
                We couldn&apos;t find any presets matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-[#171717] hover:bg-[#262626] text-foreground rounded-lg border border-[#262626] text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none cursor-pointer"
            >
                Clear all filters
            </button>
        </div>
    );
}

export function PresetGrid({ presets }: PresetGridProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "popular";
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", newSort);
        router.push(`/?${params.toString()}`, { scroll: false });
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
                            aria-label="Sort presets"
                        >
                            <option value="newest" className="bg-[#121212] text-foreground">Newest</option>
                            <option value="popular" className="bg-[#121212] text-foreground">Popular</option>
                            <option value="oldest" className="bg-[#121212] text-foreground">Oldest</option>
                        </select>
                        <MaterialIcon name="expand_more" className="text-base absolute right-0 pointer-events-none group-hover:text-white transition-colors" aria-hidden="true" />
                    </div>
                </div>
            </div>

            {presets.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {presets.map((preset) => (
                            <PresetCard key={preset.id} {...preset} />
                        ))}
                    </div>

                    {/* Pagination Controls match original design */}
                    <div className="flex justify-center items-center gap-2">
                        {currentPage > 1 && (
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#262626] text-muted-foreground hover:bg-[#121212] transition-colors disabled:opacity-50" aria-label="Previous page">
                                &lt;
                            </button>
                        )}
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-black font-medium" aria-current="page">
                            {currentPage}
                        </button>
                        {/* ... other standard pagination buttons ... */}
                    </div>
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
}
