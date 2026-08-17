# Security — Backup

## Database Backup
- PostgreSQL: pg_dump via cron job
- Frequency: Daily
- Retention: 30 days (daily), 12 months (monthly)
- Storage: Separate cloud storage (not same as app)
- Encrypted backup files

## File/Media Backup
- Cloudinary provides built-in backup
- R2/S3 versioning enabled
- Media files backed up weekly

## Backup Verification
- Weekly restore test to staging
- Verify data integrity
- Document restore procedure

## Disaster Recovery
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 24 hours
- Documented runbook for full recovery
