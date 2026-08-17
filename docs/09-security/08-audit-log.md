# Security — Audit Log

## Purpose
Mencatat setiap perubahan data penting untuk accountability.

## Events to Log
- Login / Logout
- Create / Update / Delete data master
- Booking status change
- Payment verification
- Document upload / verification
- User management
- Settings change

## Audit Log Structure
```
interface ActivityLog {
  id: string
  userId: string
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "VERIFY" | "REJECT"
  resource: string       // e.g., "package", "booking"
  resourceId: string     // ID of affected resource
  metadata: JSON         // Changes detail (before/after)
  ipAddress: string
  userAgent: string
  createdAt: DateTime
}
```

## Implementation
- Service layer mencatat log setelah action berhasil
- Admin dapat melihat log di halaman Activity Log
- Log tidak bisa dihapus (immutable)
- Log di-retention selama 1 tahun
