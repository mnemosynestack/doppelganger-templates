"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MaterialIcon from "@/components/MaterialIcon";

const ICONS = ["extension", "search", "public", "table_chart", "monitor", "webhook", "smart_toy", "bug_report"];
const CATEGORIES = ["QA Testing", "Lead Gen", "Social Media", "Shopping", "Monitoring"];

export default function NewPresetPage() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "SCRAPE",
        category: "QA Testing",
        icon: "extension",
        time_estimate: "5s",
        configuration: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [jsonError, setJsonError] = useState("");
    const router = useRouter();

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, configuration: value });
        setJsonError("");

        try {
            if (!value.trim()) return;
            const json = JSON.parse(value);

            // Basic Schema Validation
            if (!json.name || typeof json.name !== "string") throw new Error("Missing 'name' field");
            if (!json.url || typeof json.url !== "string") throw new Error("Missing 'url' field");
            if (!json.mode || (json.mode !== "agent" && json.mode !== "scrape")) throw new Error("Invalid 'mode' (must be 'agent' or 'scrape')");

            // Auto-fill fields
            setFormData(prev => ({
                ...prev,
                title: json.name || prev.title,
                type: json.mode === "agent" ? "AGENT" : "SCRAPE",
                configuration: value // Ensure config is kept
            }));

        } catch (err: unknown) {
            if (err instanceof Error) {
                setJsonError(err.message);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (jsonError) {
            setError("Please fix JSON errors before submitting.");
            setLoading(false);
            return;
        }

        try {
            // Final JSON validation before submit
            if (!formData.configuration.trim()) {
                setError("Configuration JSON is required");
                setLoading(false);
                return;
            }
            JSON.parse(formData.configuration);

            const res = await fetch("/api/presets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                if (res.status === 401) {
                    router.push("/auth/signin");
                    return;
                }
                const data = await res.json();
                throw new Error(data.error || "Failed to create preset");
            }

            router.push("/");
            router.refresh();
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
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-full max-w-4xl p-8 bg-[#0a0a0a] border border-[#262626] rounded-xl">
                <h1 className="text-2xl font-bold mb-6">Submit a new Preset</h1>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg flex items-center gap-2">
                        <MaterialIcon name="error" className="text-sm" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Configuration */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                    Task Configuration (JSON)
                                </label>
                                <p className="text-xs text-muted-foreground mb-2">Paste your task JSON here. Title and Type will be auto-filled.</p>
                                <textarea
                                    required
                                    rows={20}
                                    className={`w-full bg-[#121212] border rounded-lg px-3 py-2 text-foreground font-mono text-xs focus:outline-none transition-colors resize-none ${jsonError ? 'border-red-500/50' : 'border-[#262626] focus:border-zinc-700'}`}
                                    value={formData.configuration}
                                    onChange={handleJsonChange}
                                    placeholder='{ "name": "My Task", "url": "...", "mode": "agent", ... }'
                                />
                                {jsonError && (
                                    <p className="text-red-500 text-xs mt-1">{jsonError}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Metadata */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-zinc-700 transition-colors"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                        Type
                                    </label>
                                    <select
                                        className="w-full bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-zinc-700 transition-colors opacity-50 cursor-not-allowed"
                                        value={formData.type}
                                        disabled
                                        title="Derived from configuration"
                                    >
                                        <option value="SCRAPE">Scrape</option>
                                        <option value="AGENT">Agent</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                    Category
                                </label>
                                <select
                                    className="w-full bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-zinc-700 transition-colors"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                    Description
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-zinc-700 transition-colors resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 mt-6"
                            >
                                {loading ? "Creating..." : "Create Preset"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
