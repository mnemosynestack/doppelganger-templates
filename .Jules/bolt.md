## 2026-02-21 - [Inefficient Server-Side Filtering]
**Learning:** The application was fetching the entire `presets` table and performing filtering, sorting, and aggregation in-memory within the Next.js server component. This causes O(N) memory usage and latency as the dataset grows.
**Action:** Always push filtering, sorting, and aggregation (e.g., `COUNT`, `GROUP BY`) to the database layer using SQL `WHERE` and `GROUP BY` clauses, especially for core lists like the main dashboard.
