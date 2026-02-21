"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import MaterialIcon from "@/components/MaterialIcon";

const ICONS = ["extension", "search", "public", "table_chart", "monitor", "webhook", "smart_toy", "bug_report"];
const CATEGORIES = ["QA Testing", "Lead Gen", "Social Media", "Shopping", "Monitoring", "AI", "Jobs", "News", "Videos", "Reviews", "Developer Tools", "SEO", "Real Estate", "Travel", "Other"];

function getDomainFromUrl(url: string) {
    try {
        return new URL(url).hostname;
    } catch {
        return null;
    }
}

export default function EditPresetPage() {
    const params = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "SCRAPE",
        category: "QA Testing",
        icon: "",
        time_estimate: "5s",
        configuration: "",
        expected_output: "",
    });
    const [loading, setLoading] = useState(true); // Start loading to fetch data
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [jsonError, setJsonError] = useState("");
    const [iconType, setIconType] = useState<"favicon" | "upload">("upload");

    const presetId = params?.id as string;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = 96;
                canvas.height = 96;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    const size = Math.min(img.width, img.height);
                    const sx = (img.width - size) / 2;
                    const sy = (img.height - size) / 2;
                    ctx.drawImage(img, sx, sy, size, size, 0, 0, 96, 96);
                    const dataUrl = canvas.toDataURL("image/webp", 0.9);
                    setFormData(prev => ({ ...prev, icon: dataUrl }));
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (!presetId) return;

        // Fetch preset details
        const fetchPreset = async () => {
            try {
                const res = await fetch(`/api/presets/${presetId}`);
                if (!res.ok) throw new Error("Failed to load preset");
                const data = await res.json();

                setFormData({
                    title: data.title,
                    description: data.description,
                    type: data.type,
                    category: data.category || "QA Testing",
                    icon: data.icon || "",
                    time_estimate: data.time_estimate || "5s",
                    expected_output: data.expected_output || "",
                    configuration: typeof data.configuration === 'object'
                        ? JSON.stringify(data.configuration, null, 2)
                        : (data.configuration || ""),
                });
                if (data.icon && data.icon.startsWith("data:image/")) {
                    setIconType("upload");
                } else if (data.icon && data.icon.includes(".")) {
                    setIconType("favicon");
                }
            } catch (err) {
                setError("Could not load preset details.");
            } finally {
                setLoading(false);
            }
        };
        fetchPreset();
    }, [presetId]);

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, configuration: value });
        setJsonError("");

        try {
            if (!value.trim()) return;
            const json = JSON.parse(value);

            // Auto-fill logic (optional, maybe we don't want to overwrite title on edit unless valid)
            if (json.name) {
                setFormData(prev => ({ ...prev, title: json.name }));
            }
            if (json.mode) {
                setFormData(prev => ({ ...prev, type: json.mode === "agent" ? "AGENT" : "SCRAPE" }));
            }

        } catch (err: unknown) {
            if (err instanceof Error) setJsonError(err.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        if (jsonError) {
            setError("Please fix JSON errors.");
            setSubmitting(false);
            return;
        }

        try {
            JSON.parse(formData.configuration); // Validate JSON

            const res = await fetch(`/api/presets/${presetId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update preset");
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("An unknown error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 md:py-12">
            <div className="w-full max-w-6xl p-6 md:p-10 bg-[#0a0a0a] border border-[#262626] rounded-xl">
                <h1 className="text-2xl font-bold mb-6">Edit Preset</h1>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg flex items-center gap-2">
                        <MaterialIcon name="error" className="text-sm" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Configuration */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                    Task Configuration (JSON)
                                </label>
                                <textarea
                                    required
                                    rows={20}
                                    className={`w-full bg-[#121212] border rounded-lg px-3 py-2 text-foreground font-mono text-xs focus:outline-none transition-colors resize-none ${jsonError ? 'border-red-500/50' : 'border-[#262626] focus:border-zinc-700'}`}
                                    value={formData.configuration}
                                    onChange={handleJsonChange}
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
                                    >
                                        <option value="SCRAPE">Scrape</option>
                                        <option value="AGENT">Agent</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                    Icon
                                </label>
                                <div className="space-y-3">
                                    <div className="flex bg-[#121212] p-1 rounded-lg border border-[#262626]">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIconType("upload");
                                                setFormData({ ...formData, icon: "" });
                                            }}
                                            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${iconType === "upload" ? "bg-[#262626] text-white" : "text-muted-foreground hover:text-white"}`}
                                        >
                                            Upload Image
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIconType("favicon");
                                                try {
                                                    if (formData.configuration) {
                                                        const json = JSON.parse(formData.configuration);
                                                        if (json.url) {
                                                            const domain = getDomainFromUrl(json.url);
                                                            if (domain) setFormData({ ...formData, icon: domain });
                                                        }
                                                    }
                                                } catch { }
                                            }}
                                            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${iconType === "favicon" ? "bg-[#262626] text-white" : "text-muted-foreground hover:text-white"}`}
                                        >
                                            Site Favicon
                                        </button>
                                    </div>

                                    {iconType === "upload" ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#121212] border border-[#262626] flex items-center justify-center overflow-hidden shrink-0">
                                                    {formData.icon && formData.icon.startsWith("data:image/") ? (
                                                        <img src={formData.icon} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <MaterialIcon name="image" className="text-muted-foreground" />
                                                    )}
                                                </div>
                                                <label className="flex-1 cursor-pointer bg-[#171717] border border-[#262626] border-dashed hover:bg-[#262626] rounded-lg px-3 py-2 text-xs font-medium text-center transition-colors text-muted-foreground hover:text-foreground">
                                                    Choose Image...
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                                </label>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">Image will be cropped to 96x96 pixels</p>
                                        </div>
                                    ) : (
                                        <div className="bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-foreground focus-within:border-zinc-700 transition-colors flex items-center gap-2">
                                            {formData.icon && formData.icon.includes(".") ? (
                                                <img src={`https://www.google.com/s2/favicons?domain=${formData.icon}&sz=32`} className="w-5 h-5 object-contain" alt="" />
                                            ) : (
                                                <MaterialIcon name="language" className="text-xl text-muted-foreground" />
                                            )}
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-none focus:outline-none text-sm placeholder:text-muted-foreground"
                                                placeholder="example.com"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            />
                                        </div>
                                    )}
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

                            <div>
                                <label className="flex text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide justify-between">
                                    <span>Expected Output</span>
                                    <span className="text-zinc-500 font-normal normal-case">Optional</span>
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Paste expected JSON, HTML, or CSV output here..."
                                    className="w-full bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-foreground font-mono text-xs focus:outline-none focus:border-zinc-700 transition-colors resize-none"
                                    value={formData.expected_output}
                                    onChange={(e) => setFormData({ ...formData, expected_output: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                    Time Estimate
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        required
                                        disabled={formData.time_estimate === "Highly variable"}
                                        className="w-full bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50"
                                        value={formData.time_estimate}
                                        onChange={(e) => setFormData({ ...formData, time_estimate: e.target.value })}
                                        onBlur={(e) => {
                                            const val = e.target.value.trim();
                                            if (/^\d+$/.test(val) && val !== "") {
                                                setFormData({ ...formData, time_estimate: `${val}s` });
                                            }
                                        }}
                                        placeholder="e.g. 5s, 1m"
                                    />
                                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                                        <input
                                            type="checkbox"
                                            checked={formData.time_estimate === "Highly variable"}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData({ ...formData, time_estimate: "Highly variable" });
                                                } else {
                                                    setFormData({ ...formData, time_estimate: "" });
                                                }
                                            }}
                                            className="rounded border-[#262626] bg-[#121212] accent-white cursor-pointer"
                                        />
                                        <span className="text-xs text-muted-foreground">Highly variable</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="w-full bg-transparent border border-[#262626] text-muted-foreground font-medium py-2.5 rounded-lg hover:bg-[#171717] hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
