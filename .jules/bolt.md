## 2025-02-26 - Missing Pagination

**Learning:** This codebase had UI components for pagination but the actual fetch logic requested the entire database table on every page load, and the UI displayed all of them without limiting the view. This is a severe backend N+1 query and frontend memory issue disguised as a functional page.
**Action:** Always check the backend query and the slice applied in the UI when seeing pagination components. Don't assume pagination actually limits the SQL query just because the UI exists.
