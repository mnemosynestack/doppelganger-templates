import { Hero } from "@/components/Hero";
import { Sidebar } from "@/components/Sidebar";
import { PresetGrid } from "@/components/PresetGrid";
import { CTASection } from "@/components/CTASection";
import { query } from "@/lib/db";
import { unstable_noStore as noStore } from 'next/cache';

async function getPresets(category?: string, sort?: string, search?: string) {
  noStore(); // Disable caching for now to see updates immediately
  try {
    // Optimized: Fetch counts and filtered data in parallel using SQL
    // This replaces the previous implementation that fetched ALL rows and filtered in-memory

    // 1. Fetch category counts (for Sidebar)
    const countsPromise = query(`
      SELECT COALESCE(NULLIF(category, ''), 'QA Testing') as category, COUNT(*) as count
      FROM presets
      GROUP BY 1
    `);

    // 2. Fetch filtered presets (for Grid)
    let orderBy = 'downloads DESC';
    if (sort === 'newest') {
      orderBy = 'created_at DESC';
    } else if (sort === 'oldest') {
      orderBy = 'created_at ASC';
    }

    const conditions: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any[] = [];
    let paramIndex = 1;

    if (category && category !== "All Presets") {
      conditions.push(`COALESCE(NULLIF(category, ''), 'QA Testing') = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (search && search.trim()) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const dataPromise = query(`SELECT * FROM presets ${whereClause} ORDER BY ${orderBy}`, params);

    const [countsResult, dataResult] = await Promise.all([countsPromise, dataPromise]);

    // Process counts
    const counts: Record<string, number> = { "All Presets": 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    countsResult.rows.forEach((row: any) => {
      const count = Number(row.count);
      counts[row.category] = count;
      counts["All Presets"] += count;
    });

    // Process presets
    const presets = dataResult.rows.map((row: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = row as any;
      return {
        id: r.id,
        title: r.title,
        author: r.author_name || "Unknown",
        description: r.description,
        downloads: String(r.downloads || "0"),
        time: r.time_estimate || "—",
        type: r.type as "SCRAPE" | "AGENT",
        icon: r.icon || r.target_url || "public"
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
