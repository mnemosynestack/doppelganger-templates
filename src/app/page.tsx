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

    // Parallel queries: one for counts (grouped by category), one for data (filtered and sorted)
    const countsQuery = `
      SELECT COALESCE(NULLIF(category, ''), 'QA Testing') as cat, COUNT(*) as count
      FROM presets
      GROUP BY COALESCE(NULLIF(category, ''), 'QA Testing')
    `;

    let dataQuery = `
      SELECT id, title, author_name, description, downloads, time_estimate, type, icon, target_url, category, created_at
      FROM presets
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any[] = [];
    const conditions: string[] = [];

    // Filter by category
    if (category && category !== "All Presets") {
      conditions.push(`(COALESCE(NULLIF(category, ''), 'QA Testing') = $${params.length + 1})`);
      params.push(category);
    }

    // Filter by search
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`);
      params.push(q);
    }

    if (conditions.length > 0) {
      dataQuery += " WHERE " + conditions.join(" AND ");
    }

    dataQuery += ` ORDER BY ${orderBy}`;

    // Execute queries in parallel
    const [countsResult, dataResult] = await Promise.all([
      query(countsQuery),
      query(dataQuery, params)
    ]);

    // Process counts
    const counts: Record<string, number> = { "All Presets": 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    countsResult.rows.forEach((row: any) => {
      const count = parseInt(row.count, 10);
      counts[row.cat] = count;
      counts["All Presets"] += count;
    });

    // Process presets
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const presets = dataResult.rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      author: r.author_name || "Unknown",
      description: r.description,
      downloads: String(r.downloads || "0"),
      time: r.time_estimate || "—",
      type: r.type as "SCRAPE" | "AGENT",
      icon: r.icon || r.target_url || "public"
    }));

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
