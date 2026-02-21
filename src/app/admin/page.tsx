"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MaterialIcon from "@/components/MaterialIcon";

interface Preset {
    id: string;
    title: string;
    type: string;
    created_at: string;
    downloads: number;
    author_username?: string;
    target_url?: string;
    icon?: string;
}

export default function AdminDashboardPage() {
    const [presets, setPresets] = useState<Preset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchPresets();
    }, []);

    const fetchPresets = async () => {
        try {
            const res = await fetch("/api/admin/presets");
            if (res.status === 401 || res.status === 403) {
                router.push("/");
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch presets");
            const data = await res.json();
            setPresets(data);
        } catch (err) {
            setError("Could not load presets.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this preset globally? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/presets/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setPresets(presets.filter(p => p.id !== id));
        } catch (err) {
            alert("Error deleting preset");
        }
    };

    if (loading) return <div className="flex justify-center p-12 text-muted-foreground">Loading admin dashboard...</div>;

    return (
        <div className="p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-wide text-red-500 flex items-center gap-3">
                        <MaterialIcon name="admin_panel_settings" className="text-4xl" />
                        Admin Dashboard
                    </h1>
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#121212] border-b border-[#262626] text-xs uppercase text-muted-foreground">
                                <th className="p-4 font-medium">Author</th>
                                <th className="p-4 font-medium">Title & Icon</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Stats</th>
                                <th className="p-4 font-medium">Created</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {presets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No presets found on the entire platform.
                                    </td>
                                </tr>
                            ) : (
                                presets.map(preset => (
                                    <tr key={preset.id} className="border-b border-[#262626] last:border-0 hover:bg-[#0f0f0f] transition-colors group">
                                        <td className="p-4">
                                            <span className="text-sm font-medium text-blue-400">@{preset.author_username || "Unknown"}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-[#171717] flex items-center justify-center overflow-hidden border border-[#262626]">
                                                    {preset.icon?.startsWith("data:image/") ? (
                                                        <img src={preset.icon} className="w-8 h-8 object-cover" alt="" />
                                                    ) : preset.icon && preset.icon.includes(".") ? (
                                                        <img src={`https://www.google.com/s2/favicons?domain=${preset.icon}&sz=32`} className="w-5 h-5 object-contain" alt="" />
                                                    ) : preset.icon ? (
                                                        <MaterialIcon name={preset.icon} className="text-lg text-foreground" />
                                                    ) : preset.target_url ? (
                                                        <img src={`https://www.google.com/s2/favicons?domain=${preset.target_url}&sz=32`} className="w-5 h-5 object-contain" alt="" />
                                                    ) : (
                                                        <MaterialIcon name="extension" className="text-lg text-muted-foreground" />
                                                    )}
                                                </div>
                                                <span className="font-medium truncate max-w-[200px]" title={preset.title}>{preset.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs px-2 py-1 rounded bg-[#171717] border border-[#262626] font-mono">
                                                {preset.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {preset.downloads || 0}
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(preset.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/presets/${preset.id}/edit`}>
                                                    <button className="p-2 hover:bg-[#262626] rounded text-muted-foreground hover:text-foreground transition-colors" title="Edit globally">
                                                        <MaterialIcon name="edit" className="text-lg" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(preset.id)}
                                                    className="p-2 hover:bg-red-900/20 rounded text-muted-foreground hover:text-red-500 transition-colors"
                                                    title="Delete globally"
                                                >
                                                    <MaterialIcon name="delete" className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
