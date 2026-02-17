"use client";

import { useState, useRef } from "react";
import MaterialIcon from "@/components/MaterialIcon";

interface DownloadButtonProps {
    presetId: string;
    presetTitle: string;
    configJson: string;
}

export default function DownloadButton({ presetId, presetTitle, configJson }: DownloadButtonProps) {
    const [copied, setCopied] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const downloadCooldown = useRef(false);
    const copyCooldown = useRef(false);

    const incrementDownloads = async () => {
        try {
            await fetch(`/api/presets/${presetId}/download`, { method: "POST" });
        } catch { }
    };

    const handleDownload = async () => {
        // Increment only if not in cooldown
        if (!downloadCooldown.current) {
            downloadCooldown.current = true;
            await incrementDownloads();
            setTimeout(() => { downloadCooldown.current = false; }, 30000);
        }

        // Always trigger the file download
        const blob = new Blob([configJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${presetTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'preset'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2000);
    };

    const handleCopy = async () => {
        // Increment only if not in cooldown
        if (!copyCooldown.current) {
            copyCooldown.current = true;
            await incrementDownloads();
            setTimeout(() => { copyCooldown.current = false; }, 30000);
        }

        await navigator.clipboard.writeText(configJson);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={handleDownload}
                className={`flex-1 flex items-center justify-center gap-2 font-medium py-2.5 rounded-lg transition-colors border cursor-pointer ${downloaded
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-[#171717] hover:bg-[#262626] text-foreground border-[#262626]"
                    }`}
            >
                <MaterialIcon name={downloaded ? "check" : "download"} className="text-lg" />
                {downloaded ? "Downloaded!" : "Download"}
            </button>
            <button
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-2 font-medium py-2.5 rounded-lg transition-colors border cursor-pointer ${copied
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-[#171717] hover:bg-[#262626] text-foreground border-[#262626]"
                    }`}
            >
                <MaterialIcon name={copied ? "check" : "content_copy"} className="text-lg" />
                {copied ? "Copied!" : "Copy JSON"}
            </button>
        </div>
    );
}
