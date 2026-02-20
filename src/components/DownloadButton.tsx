"use client";

import { useState, useRef } from "react";
import MaterialIcon from "@/components/MaterialIcon";
import { useRouter } from "next/navigation";

interface DownloadButtonProps {
    presetId: string;
    presetTitle: string;
    configJson: string;
    isAuthenticated?: boolean;
}

export default function DownloadButton({ presetId, presetTitle, configJson, isAuthenticated = true }: DownloadButtonProps) {
    const [copied, setCopied] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const downloadCooldown = useRef(false);
    const copyCooldown = useRef(false);
    const router = useRouter();

    const incrementDownloads = async () => {
        try {
            await fetch(`/api/presets/${presetId}/download`, { method: "POST" });
        } catch { }
    };

    const handleAction = async (action: 'download' | 'copy') => {
        if (!isAuthenticated) {
            router.push("/auth/signin");
            return;
        }

        const isDownload = action === 'download';
        const cooldownRef = isDownload ? downloadCooldown : copyCooldown;

        if (!cooldownRef.current) {
            cooldownRef.current = true;
            incrementDownloads();
            setTimeout(() => { cooldownRef.current = false; }, 30000);
        }

        if (isDownload) {
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
        } else {
            await navigator.clipboard.writeText(configJson);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={() => handleAction('download')}
                aria-label={downloaded ? "Download complete" : `Download ${presetTitle} configuration`}
                className={`flex-1 flex items-center justify-center gap-2 font-medium py-2.5 rounded-lg transition-colors border cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${downloaded
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-[#171717] hover:bg-[#262626] text-foreground border-[#262626]"
                    }`}
            >
                <MaterialIcon name={downloaded ? "check" : "download"} className="text-lg" aria-hidden="true" />
                {downloaded ? "Downloaded!" : "Download"}
            </button>
            <button
                onClick={() => handleAction('copy')}
                aria-label={copied ? "Copied to clipboard" : `Copy ${presetTitle} configuration to clipboard`}
                className={`flex-1 flex items-center justify-center gap-2 font-medium py-2.5 rounded-lg transition-colors border cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${copied
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-[#171717] hover:bg-[#262626] text-foreground border-[#262626]"
                    }`}
            >
                <MaterialIcon name={copied ? "check" : "content_copy"} className="text-lg" aria-hidden="true" />
                {copied ? "Copied!" : "Copy JSON"}
            </button>
        </div>
    );
}
