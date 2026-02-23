## 2024-05-22 - Next.js 16 `revalidateTag` Signature Change
**Learning:** In this environment (Next.js 16.1.6), `revalidateTag` requires a second argument (e.g., `{ expire: 0 }`). Calling it with a single argument causes a build failure.
**Action:** Always provide `{ expire: 0 }` (or appropriate config) when using `revalidateTag` in this project.
