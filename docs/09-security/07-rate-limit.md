# Security — Rate Limiting

## Strategy
- Rate limiting pada endpoint kritis
- Implementasi di middleware level
- Token bucket or sliding window algorithm

## Endpoints with Rate Limiting
| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/auth/login | 5 attempts | 15 minutes |
| /api/booking | 10 requests | 1 hour (per IP) |
| /api/admin/media/upload | 20 uploads | 1 hour |
| /api/contact | 3 messages | 1 hour |

## Implementation (Future)
- Upstash Rate Limiter or similar
- Redis-based untuk production
- In-memory untuk development

## Response on Rate Limit
```
Status: 429 Too Many Requests
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": 900
}
```
