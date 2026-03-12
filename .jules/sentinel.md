## 2024-05-24 - Prevent Admin Username Registration
**Vulnerability:** The signup endpoint allowed any user to register the username specified in `process.env.ADMIN_USERNAME`. If an attacker registered this username before the legitimate admin, they could gain unauthorized access to admin-only endpoints.
**Learning:** Hardcoded or environment-based admin username checks must be accompanied by explicit reservation of that username during the public registration process to prevent privilege escalation or impersonation.
**Prevention:** Always validate requested usernames during registration against reserved or administrative usernames, ensuring case-insensitive comparison.

## 2024-05-24 - Set SameSite Attribute on JWT Cookies
**Vulnerability:** The JWT authentication cookie set during login lacked the `SameSite` attribute, potentially exposing the application to Cross-Site Request Forgery (CSRF) attacks if other mitigations failed.
**Learning:** While `SameSite=Lax` is often the default in modern browsers, explicitly setting `SameSite: 'strict'` for sensitive authentication cookies provides a stronger defense-in-depth layer against CSRF.
**Prevention:** Always explicitly configure security attributes (`HttpOnly`, `Secure`, `SameSite`) when setting authentication or session cookies.
