# Deployment — Backup Strategy

## Database Backup

### Automated (Cron Job)
- Frequency: Daily at 02:00 UTC
- Command: pg_dump
- Retention: 30 daily, 12 monthly
- Encryption: AES-256

### Manual
- Before major migration
- Before deployment to production

### Restore Procedure
```
# Download latest backup
# Restore to PostgreSQL
pg_restore -d stms_production latest_backup.dump
# Verify data integrity
```

## File/Media Backup
- Cloudinary provides automatic backup
- S3/R2 versioning enabled
- Weekly export to backup bucket

## Backup Monitoring
- Daily backup success/failure alert
- Weekly restore test to staging
- Monthly backup size report
