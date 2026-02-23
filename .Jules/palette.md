## 2025-05-22 - Optimistic UI for Stats
**Learning:** Users perceive "Download" actions as slow if we await analytics/stats calls.
**Action:** Always fire-and-forget stats increments (or handle errors silently) for immediate user feedback.

## 2025-05-22 - Nested Links
**Learning:** Next.js `Link` renders an `<a>` tag. Nesting `<button>` inside causes invalid HTML and breaks screen reader navigation.
**Action:** Style the `<Link>` directly as a button instead of wrapping a `<button>`.

## 2025-06-18 - Clipboard Interaction Feedback
**Learning:** Users lack confidence when copying code snippets without immediate visual confirmation. Relying on default browser behavior is insufficient.
**Action:** Always provide a temporary visual state (e.g., "Copied!" or checkmark icon) and update the `aria-label` dynamically to confirm the action to all users.
