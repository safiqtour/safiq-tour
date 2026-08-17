# Booking API

## Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | /api/booking | — | Create booking (public) |
| GET | /api/admin/bookings | booking:read | List all |
| GET | /api/admin/bookings/:id | booking:read | Detail |
| PUT | /api/admin/bookings/:id | booking:update | Update |
| PATCH | /api/admin/bookings/:id/status | booking:update | Update status |
| DELETE | /api/admin/bookings/:id | booking:delete | Cancel |

## POST /api/booking (Public)
Request:
`json
{
  "packageId": "uuid",
  "scheduleId": "uuid",
  "pilgrims": [{
    "name": "John Doe", "email": "john@email.com", "phone": "628123456789",
    "birthPlace": "Jakarta", "birthDate": "1990-01-01", "gender": "MALE",
    "address": "Jl. Contoh", "cityId": "uuid",
    "passportNumber": "A1234567", "passportExpiry": "2030-01-01",
    "relationship": "SELF"
  }],
  "notes": "..."
}
`
Success (201): { "success": true, "data": { "bookingNumber": "STMS/2026/07/00001", "status": "BOOKED", "totalPrice": 25000000 } }

## GET /api/admin/bookings
Query: ?status=ACTIVE&search=nama&page=1&limit=20
