"use client";

import Link from "next/link";
import MaterialIcon from "@/components/MaterialIcon";
import { useState, memo } from "react";

export interface PresetProps {
    id: string; // Added ID
    title: string;
    description: string;
    author: string;
    downloads: string;
    time: string;
    type: "SCRAPE" | "AGENT";
    icon: string;
}

function PresetIcon({ icon }: { icon: string }) {
    const [error, setError] = useState(false);

    const isDataUrl = icon && icon.startsWith("data:image/");
    const isDomain = icon && icon.includes(".") && !isDataUrl;

    if (isDataUrl) {
        return <img src={icon} alt="Icon" className="w-8 h-8 object-cover rounded" width="32" height="32" loading="lazy" onError={() => setError(true)} />
    }

    if (!isDomain) {
        return <MaterialIcon name={icon || "public"} className="text-3xl text-foreground" aria-hidden="true" />;
    }

    if (error || !icon) {
        return <MaterialIcon name="public" className="text-3xl text-foreground" aria-hidden="true" />;
    }

    return (
        <img
            src={`https://www.google.com/s2/favicons?domain=${icon}&sz=64`}
            alt="Favicon"
            className="w-8 h-8 object-contain"
            width="32"
            height="32"
            loading="lazy"
            onError={() => setError(true)}
        />
    );
}

export const PresetCard = memo(function PresetCard({ id, title, description, author, downloads, time, type, icon }: PresetProps) {
    return (
        <div className="group bg-[#0a0a0a] border border-[#262626] rounded-xl p-5 hover:border-zinc-700 transition-all flex flex-col h-full relative overflow-hidden">
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                        <PresetIcon icon={icon} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-base">{title}</h3>
                        <p className="text-xs text-muted-foreground">By {author}</p>
                    </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[#262626] text-muted-foreground bg-[#121212]">
                    {type}
                </span>
            </div>

            <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                {description}
            </p>

            <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <div className="flex items-center gap-1.5">
                        <MaterialIcon name="download" className="text-xs" aria-hidden="true" />
                        <span>{downloads}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MaterialIcon name="schedule" className="text-xs" aria-hidden="true" />
                        <span>{time}</span>
                    </div>
                </div>

                <Link
                    href={`/presets/${id}`}
                    className="text-xs font-semibold bg-[#171717] hover:bg-[#262626] text-foreground px-3 py-1.5 rounded-md transition-colors border border-[#262626] cursor-pointer inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    aria-label={`Use ${title} preset`}
                >
                    Use Preset
                </Link>
            </div>
        </div>
    );
});
