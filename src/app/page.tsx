import { Hero } from "@/components/Hero";
import { Sidebar } from "@/components/Sidebar";
import { PresetGrid } from "@/components/PresetGrid";
import { CTASection } from "@/components/CTASection";
import { query } from "@/lib/db";
import { unstable_noStore as noStore } from 'next/cache';

async function getPresets(category?: string, sort?: string, search?: string) {
  noStore(); // Disable caching for now to see updates immediately
  try {
    let orderBy = 'downloads DESC';
    if (sort === 'newest') {
      orderBy = 'created_at DESC';
    } else if (sort === 'oldest') {
      orderBy = 'created_at ASC';
    }

    const { rows } = await query(`SELECT * FROM presets ORDER BY ${orderBy}`);

    // Calculate counts (always based on full dataset)
    const counts: Record<string, number> = { "All Presets": rows.length };
    rows.forEach((row: any) => {
      const cat = row.category || "QA Testing"; // Default for legacy data
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Filter rows if category is provided
    let filteredRows = category && category !== "All Presets"
      ? rows.filter((r: any) => (r.category || "QA Testing") === category)
      : rows;

    // Search filter
    if (search && search.trim()) {
      const q = search.toLowerCase();
      filteredRows = filteredRows.filter((r: any) =>
        (r.title || "").toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q)
      );
    }

    const presets = filteredRows.map((row: unknown) => {
      const r = row as any;
      return {
        id: r.id,
        title: r.title,
        author: r.author_name || "Unknown",
        description: r.description,
        downloads: String(r.downloads || "0"),
        time: r.time_estimate || "—",
        type: r.type as "SCRAPE" | "AGENT",
        icon: r.target_url || "google.com" // Fallback to google so we get a generic icon or we should handle empty string in Card.
      };
    });

    return { presets, counts };
  } catch (error) {
    console.error("Failed to fetch presets:", error);
    return { presets: [], counts: {} };
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string, sort?: string, search?: string }> }) {
  const { category, sort, search } = await searchParams;
  const { presets, counts } = await getPresets(category, sort, search);

  return (
    <div className="text-foreground font-sans selection:bg-green-500/30 selection:text-green-200">
      <main className="max-w-[1400px] mx-auto">
        <Hero />

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 px-4 md:px-6 py-6 md:py-8">
          <Sidebar counts={counts} />
          <PresetGrid presets={presets} />
        </div>

        <CTASection />
      </main>
    </div>
  );
}
