## 2024-05-18 - Debounce Client-Side Search
**Learning:** In Next.js App Router applications, pushing to the router on every keystroke in a search input can cause excessive server-side data fetches and client-side navigations, significantly degrading performance.
**Action:** Always implement a debounce (e.g., using `setTimeout` and `useRef`) on input fields that trigger route changes or API calls. This batches rapid updates into a single execution after the user pauses typing.
## 2025-05-18 - Missing Database Indexes on Sorted Columns
**Learning:** The database schema for `presets` lacked indexes on fields heavily used for sorting (`downloads`, `created_at`) and filtering (`category`). Next.js SSR functions were querying these fields on every page load, causing full table scans and slower performance.
**Action:** Always add B-tree indexes for columns used in `ORDER BY` and `WHERE` clauses on high-traffic lists, especially for large datasets.

## 2025-05-19 - Missing Pagination on Large Data Sets
**Learning:** The `getPresets` API was fetching the entire `presets` table without any `LIMIT` or `OFFSET`. In a Next.js SSR application, this can crash the Node.js server with Out-Of-Memory errors as the dataset grows, and sending thousands of records to the client degrades React rendering performance severely.
**Action:** Always implement pagination on high-traffic lists or large datasets to ensure scalable backend memory usage and fast client-side rendering. Use URL parameters like `page` to track state and pass it down to SQL queries with `LIMIT` and `OFFSET`.
