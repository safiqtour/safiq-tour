# Security — Authentication

## Implementation
- Auth.js v5 with Prisma adapter
- Credentials provider (email + password)
- JWT session strategy (production)
- Password hashing with bcryptjs (salt rounds: 12)

## Session Security
- httpOnly cookies
- secure flag in production
- sameSite: "lax"
- CSRF token via Auth.js built-in

## Password Policy
- Minimum 8 characters
- Combination of letters and numbers (future)
- No plaintext storage
- Rate limiting on login attempts

## Session Expiry
- Session: 30 days
- Remember me: 30 days
- No remember me: 24 hours

## Route Protection
- Middleware protects /admin/*
- API routes validate session
- Service layer checks permissions
