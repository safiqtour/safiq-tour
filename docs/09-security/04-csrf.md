# Security — CSRF Protection

## Strategy
- Auth.js built-in CSRF protection untuk credentials provider
- Double Submit Cookie pattern
- CSRF token di setiap form POST request

## Implementation
- Auth.js CSRF token otomatis untuk Server Actions
- Untuk API routes: validasi origin header
- SameSite cookie: "lax" atau "strict"

## When CSRF Matters
- Login form
- Admin CRUD actions
- File upload
- Payment actions
- Any state-changing request

## Best Practices
- Semua POST/PUT/DELETE dari browser wajib CSRF-protected
- API yang dikonsumsi third-party menggunakan API key
