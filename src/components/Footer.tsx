import Link from "next/link";
import { load } from "cheerio";

interface BlogPost {
    title: string;
    href: string;
}

const getBlogPosts = async (): Promise<BlogPost[]> => {
    try {
        const res = await fetch('https://figranium.dev/blog', { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error('Failed to fetch blog');

        const html = await res.text();
        const $ = load(html);
        const posts: BlogPost[] = [];

        // Attempt to find blog post links. 
        // Strategy: Look for links that contain 'docs' or 'blog' in href and have an H2 within their container or nearby.
        // A common pattern is article > h2 > a OR article > a > h2

        // Let's try to extract from H2s directly as they likely contain the title link
        $('h2').each((_, el) => {
            if (posts.length >= 4) return;

            const title = $(el).text().trim();
            // Try to find the link. Usually the title itself is a link or inside one.
            let href = $(el).find('a').attr('href') || $(el).closest('a').attr('href');

            // If not found, look for a "Read more" link in the same container/parent
            if (!href) {
                // Assuming common wrapper like article or div
                const parent = $(el).parent();
                href = parent.find('a:contains("Read more"), a:contains("Read More")').attr('href');
            }

            // If still no href, try next sibling
            if (!href) {
                let sibling = $(el).next();
                while (sibling.length && !href && sibling.index() < $(el).index() + 5) { // search few siblings
                    href = sibling.find('a').attr('href') || (sibling.is('a') ? sibling.attr('href') : undefined);
                    sibling = sibling.next();
                }
            }

            if (title && href) {
                // Ensure absolute URL if needed, though Next Link handles relative
                if (href.startsWith('/')) {
                    href = `https://figranium.dev${href}`;
                }
                posts.push({ title, href });
            }
        });

        // Fallback if scraping fails to find structured data (e.g. if class names changed or structure is wildly different)
        if (posts.length === 0) {
            return [
                { title: "We Switched Our License (Again): Why Figranium is Now Under GPLv3", href: "https://figranium.dev/docs/we-switched-our-license-again" },
                { title: "We Chose Safety. Then We Chose Growth (Introducing the Notice & Attribution License)", href: "https://figranium.dev/docs/introducing-the-notice-attribution-license" },
                { title: "Figranium vs Skyvern: Which Browser Automation Tool Should You Use?", href: "https://figranium.dev/docs/doppelganger-vs-skyvern" },
                { title: "Top 10 Self‑Hosted Browser Automation Tools (2026)", href: "https://figranium.dev/docs/top-10-self-hosted-browser-automation-tools-2026" },
            ];
        }

        return posts.slice(0, 4);
    } catch (e) {
        console.error("Failed to fetch blog posts", e);
        // Return fallback data on error
        return [
            { title: "We Switched Our License (Again): Why Figranium is Now Under GPLv3", href: "https://figranium.dev/docs/we-switched-our-license-again" },
            { title: "We Chose Safety. Then We Chose Growth (Introducing the Notice & Attribution License)", href: "https://figranium.dev/docs/introducing-the-notice-attribution-license" },
            { title: "Figranium vs Skyvern: Which Browser Automation Tool Should You Use?", href: "https://figranium.dev/docs/doppelganger-vs-skyvern" },
            { title: "Top 10 Self‑Hosted Browser Automation Tools (2026)", href: "https://figranium.dev/docs/top-10-self-hosted-browser-automation-tools-2026" },
        ];
    }
};

export async function Footer() {
    const posts = await getBlogPosts();

    return (
        <footer className="border-t border-border py-12 px-6 mt-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-2 space-y-4">
                    <h3 className="font-bold text-sm tracking-wider uppercase text-muted-foreground">Figranium</h3>
                    <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                        Self-hosted automation that keeps your data local, with secure API access when you need it.
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-8">
                        © 2026 Mnemosyne
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-sm tracking-wider uppercase text-muted-foreground">Blog</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        {posts.map((post, i) => (
                            <li key={i}>
                                <Link href={post.href} className="hover:text-foreground transition-colors line-clamp-1" title={post.title}>
                                    {post.title}
                                </Link>
                            </li>
                        ))}
                        <li><Link href="https://figranium.dev/blog" className="hover:text-foreground transition-colors text-white underline decoration-white/30 underline-offset-4">View all posts</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-sm tracking-wider uppercase text-muted-foreground">Navigate</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="https://figranium.dev" className="hover:text-foreground transition-colors">Home</Link></li>
                        <li><Link href="https://figranium.dev/docs" className="hover:text-foreground transition-colors">Docs</Link></li>
                        <li><Link href="https://figranium.dev/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                        <li><Link href="https://github.com/figranium/figranium" className="hover:text-foreground transition-colors">GitHub</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
