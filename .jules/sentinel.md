## 2024-05-19 - Hardcoded Admin Username

**Vulnerability:** The application had a hardcoded admin username (`asermnasr`) across multiple files (routes and components) for role-based access control (RBAC).
**Learning:** Hardcoding usernames or secrets for privileged access leads to serious security issues. If a user registers with this specific username or the username string gets compromised, they would get complete administrative rights across the system (deleting files, etc.).
**Prevention:** Always use environment variables (e.g., `process.env.ADMIN_USERNAME`) or proper database-backed role checks (`users.role === 'admin'`) for authorization and privileged access control to avoid giving away admin permissions via hardcoded values.
