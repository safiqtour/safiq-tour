# Payment API

## Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | /api/admin/payments | payment:read | List payments |
| GET | /api/admin/payments/:id | payment:read | Payment detail |
| POST | /api/admin/payments/:id/verify | payment:verify | Verify payment |
| POST | /api/admin/payments/:id/reject | payment:verify | Reject payment |
| GET | /api/admin/invoices | payment:read | List invoices |
| GET | /api/admin/invoices/:id | payment:read | Invoice detail |

## POST /api/admin/payments/:id/verify
Permission: payment:verify
Request: { "notes": "Pembayaran terverifikasi" }
Success: { "success": true, "data": { "status": "PAID", "verifiedAt": "..." } }

## Payment Status Flow
UNPAID → WAITING_VERIFICATION → PARTIAL / PAID
UNPAID → CANCELLED
PAID → REFUNDED
