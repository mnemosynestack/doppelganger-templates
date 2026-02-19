import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import MaterialIcon from "@/components/MaterialIcon";
import Link from "next/link";
import DownloadButton from "@/components/DownloadButton";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const { rows } = await query('SELECT title FROM presets WHERE id = $1', [id]);
    if (rows.length === 0) return { title: "Preset Not Found" };
    return { title: rows[0].title };
}
async function getPreset(id: string) {
    const { rows } = await query('SELECT * FROM presets WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    return rows[0];
}

export default async function ViewPresetPage({ params }: PageProps) {
    const { id } = await params;
    const preset = await getPreset(id);

    if (!preset) {
        notFound();
    }

    let config: any = {};
    try {
        if (typeof preset.configuration === 'string') {
            config = JSON.parse(preset.configuration);
        } else if (typeof preset.configuration === 'object') {
            config = preset.configuration;
        }
    } catch { }

    return (
        <div className="flex flex-col items-center py-12 px-4 md:px-6">
            <div className="w-full max-w-5xl space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[#262626]">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-[#121212] border border-[#262626] flex items-center justify-center overflow-hidden">
                                {preset.target_url ? (
                                    <img src={`https://www.google.com/s2/favicons?domain=${preset.target_url}&sz=64`} className="w-8 h-8" alt="Icon" />
                                ) : (
                                    <MaterialIcon name="extension" className="text-3xl text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{preset.title}</h1>
                                <p className="text-muted-foreground">By {preset.author_name || "Unknown"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded text-xs font-mono border border-[#262626] bg-[#121212] text-foreground">
                                {preset.type}
                            </span>
                            <span className="px-2.5 py-1 rounded text-xs border border-[#262626] bg-[#121212] text-muted-foreground">
                                {preset.category || "General"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-xl font-mono font-bold">{preset.downloads || 0}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Downloads</p>
                        </div>

                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Description & Steps */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <MaterialIcon name="description" className="text-muted-foreground" />
                                Description
                            </h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {preset.description}
                            </p>
                        </section>

                        {config.variables && Object.keys(config.variables).length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <MaterialIcon name="data_object" className="text-muted-foreground" />
                                    Variables
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(config.variables).map(([key, variable]: [string, any]) => (
                                        <div key={key} className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 relative group hover:border-zinc-700 transition-colors">
                                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500/50 group-hover:bg-blue-500 transition-colors" />
                                            <div className="pl-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono text-sm font-bold text-foreground">{key}</span>
                                                    <span className="text-xs bg-[#121212] border border-[#262626] px-2 py-0.5 rounded text-muted-foreground uppercase">{variable.type || "string"}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground break-all bg-[#121212] px-3 py-2 rounded border border-[#262626]">
                                                    {variable.value || "No default value"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {config.selector && (
                            <section>
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <MaterialIcon name="my_location" className="text-muted-foreground" />
                                    Target Selector
                                </h2>
                                <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 relative group hover:border-zinc-700 transition-colors">
                                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-pink-500/50 group-hover:bg-pink-500 transition-colors" />
                                    <div className="pl-2">
                                        <code className="text-sm text-pink-400 font-mono">
                                            {config.selector}
                                        </code>
                                    </div>
                                </div>
                            </section>
                        )}

                        <section>
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <MaterialIcon name="account_tree" className="text-muted-foreground" />
                                Automation Steps
                            </h2>
                            <div className="space-y-4">
                                {/* Visualize Steps */}
                                {config.actions && Array.isArray(config.actions) && config.actions.length > 0 ? (
                                    config.actions.map((action: any, i: number) => (
                                        <div key={i} className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 relative overflow-hidden group hover:border-zinc-700 transition-colors">
                                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-white transition-colors" />
                                            <div className="flex items-start gap-4 pl-2">
                                                <div className="w-6 h-6 rounded-full bg-[#171717] border border-[#262626] flex items-center justify-center text-xs font-mono text-muted-foreground shrink-0 mt-0.5">
                                                    {i + 1}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-medium text-foreground text-sm uppercase tracking-wide">
                                                        {action.type || "Unknown Action"}
                                                    </h3>
                                                    {action.selector && (
                                                        <code className="text-xs bg-[#121212] border border-[#262626] px-2 py-0.5 rounded text-blue-400 font-mono block w-fit mt-1">
                                                            {action.selector}
                                                        </code>
                                                    )}
                                                    {action.value && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Value: <span className="text-foreground">{action.value}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 border border-dashed border-[#262626] rounded-lg text-center text-muted-foreground">
                                        No explicit actions defined in configuration.
                                    </div>
                                )}
                            </div>
                        </section>
                        
                        {config.extractionScript && (
                            <section>
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <MaterialIcon name="code" className="text-muted-foreground" />
                                    Extraction Script
                                </h2>
                                <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 relative group hover:border-zinc-700 transition-colors overflow-x-auto">
                                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-green-500/50 group-hover:bg-green-500 transition-colors" />
                                    <div className="pl-2">
                                        <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                                            {config.extractionScript}
                                        </pre>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar: Metadata */}
                    <div className="space-y-6">
                        <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-6 space-y-4">
                            <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-2">Preset Details</h3>

                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Target URL</p>
                                <a href={preset.target_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline break-all block">
                                    {preset.target_url || "N/A"}
                                </a>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Time Estimate</p>
                                <p className="text-sm text-foreground">{preset.time_estimate || "Unknown"}</p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Created</p>
                                <p className="text-sm text-foreground">{new Date(preset.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-6">
                            <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-4">Configuration</h3>
                            <DownloadButton
                                presetId={id}
                                presetTitle={preset.title}
                                configJson={JSON.stringify(config, null, 2)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
