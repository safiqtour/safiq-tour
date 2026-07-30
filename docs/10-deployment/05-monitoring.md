# Deployment — Monitoring

## Uptime Monitoring
- Vercel Analytics (built-in)
- External: Better Stack / Pingdom (future)

## Error Tracking
- Vercel Error Logs
- Console.log in development only
- Structured logging in production

## Performance Monitoring
- Vercel Speed Insights
- Web Vitals (LCP, FID, CLS)
- API response time tracking
- Database query performance

## Alerting
- Production error rate > threshold → Email/WA notification
- Uptime < 99.5% → Alert
- Database disk > 80% → Alert

## Logging Strategy
| Environment | Method | Detail |
|-------------|--------|--------|
| Development | Console | Full detail |
| Staging | Vercel Logs | Warnings + Errors |
| Production | Vercel Logs | Errors only (structured) |
