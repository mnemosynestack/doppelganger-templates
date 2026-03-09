## 2024-05-18 - Debounce Client-Side Search
**Learning:** In Next.js App Router applications, pushing to the router on every keystroke in a search input can cause excessive server-side data fetches and client-side navigations, significantly degrading performance.
**Action:** Always implement a debounce (e.g., using `setTimeout` and `useRef`) on input fields that trigger route changes or API calls. This batches rapid updates into a single execution after the user pauses typing.
## 2025-05-18 - Missing Database Indexes on Sorted Columns
**Learning:** The database schema for `presets` lacked indexes on fields heavily used for sorting (`downloads`, `created_at`) and filtering (`category`). Next.js SSR functions were querying these fields on every page load, causing full table scans and slower performance.
**Action:** Always add B-tree indexes for columns used in `ORDER BY` and `WHERE` clauses on high-traffic lists, especially for large datasets.

## $(date +%Y-%m-%d) - Expensive string parsing inside render loop
**Learning:** In Next.js client components using `useSearchParams()`, mapping over large arrays (like categories) and re-instantiating `URLSearchParams` on every item inside the map function causes unnecessary CPU overhead, particularly when local state changes (e.g. toggling UI elements) trigger re-renders.
**Action:** Use `useMemo` to pre-calculate objects and their respective derived properties (like `href` URLs) dependent on search params. Pre-evaluating `searchParams.toString()` and generating URLs inside the memo hook avoids redundant parsing during render.
