# Dashboard API

## Endpoints

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | /api/admin/dashboard/stats | dashboard:read |
| GET | /api/admin/dashboard/revenue | dashboard:read |
| GET | /api/admin/dashboard/bookings | dashboard:read |
| GET | /api/admin/dashboard/recent-activity | dashboard:read |
| GET | /api/admin/dashboard/upcoming-departures | dashboard:read |

## GET /api/admin/dashboard/stats
Response:
`json
{
  "success": true,
  "data": {
    "totalPackages": 25,
    "totalBookings": 150,
    "totalPilgrims": 320,
    "totalRevenue": 7500000000,
    "activeBookings": 45,
    "upcomingDepartures": 3,
    "pendingPayments": 12
  }
}
`

## Chart Data Endpoints
Response: { "success": true, "data": { "labels": ["Jan","Feb",...], "datasets": [{ "label": "Revenue", "data": [...] }] } }
