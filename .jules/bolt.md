## 2024-05-18 - Debounce Client-Side Search
**Learning:** In Next.js App Router applications, pushing to the router on every keystroke in a search input can cause excessive server-side data fetches and client-side navigations, significantly degrading performance.
**Action:** Always implement a debounce (e.g., using `setTimeout` and `useRef`) on input fields that trigger route changes or API calls. This batches rapid updates into a single execution after the user pauses typing.
## 2025-05-18 - Missing Database Indexes on Sorted Columns
**Learning:** The database schema for `presets` lacked indexes on fields heavily used for sorting (`downloads`, `created_at`) and filtering (`category`). Next.js SSR functions were querying these fields on every page load, causing full table scans and slower performance.
**Action:** Always add B-tree indexes for columns used in `ORDER BY` and `WHERE` clauses on high-traffic lists, especially for large datasets.
