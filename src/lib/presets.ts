import { query } from "@/lib/db";
import { unstable_noStore as noStore } from 'next/cache';

export async function getPresets(category?: string, sort?: string, search?: string) {
    noStore(); // Disable caching for now to see updates immediately

    try {
        // Query 1: Get counts for all categories
    // We group by the coalesced category to match the frontend display logic
    const countsPromise = query(`
        SELECT
            COALESCE(NULLIF(category, ''), 'QA Testing') as cat,
            COUNT(*) as count
        FROM presets
        GROUP BY COALESCE(NULLIF(category, ''), 'QA Testing')
    `);

    // Prepare Query 2: Get filtered data
    // We only select the columns we need, avoiding potentially large JSON blobs
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

    // Filter by category
    if (category && category !== "All Presets") {
        conditions.push(`COALESCE(NULLIF(category, ''), 'QA Testing') = $${paramIndex}`);
        params.push(category);
        paramIndex++;
    }

    // Filter by search
    if (search && search.trim()) {
        conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
        params.push(`%${search.trim()}%`);
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Select only necessary columns
    const dataQuery = `
        SELECT
            id,
            title,
            description,
            author_name,
            downloads,
            time_estimate,
            type,
            icon,
            target_url,
            category
        FROM presets
        ${whereClause}
        ORDER BY ${orderBy}
    `;

        // Execute queries in parallel
        const [countsResult, dataResult] = await Promise.all([
            countsPromise,
            query(dataQuery, params)
        ]);

        // Process counts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const totalPresets = countsResult.rows.reduce((sum: number, row: any) => sum + parseInt(row.count), 0);
        const counts: Record<string, number> = { "All Presets": totalPresets };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        countsResult.rows.forEach((row: any) => {
            counts[row.cat] = parseInt(row.count);
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
