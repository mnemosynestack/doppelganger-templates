export function sanitizeUrl(url: string | null | undefined): string | undefined {
    if (!url) return undefined;
    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return url;
        }
    } catch (e) {
        // Invalid URL format
    }
    return undefined;
}
