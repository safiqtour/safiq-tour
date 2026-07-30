# Master Data API

Prefix: /api/master/

## Endpoints Pattern

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | /api/master/:resource | — | List (public read) |
| GET | /api/master/:resource/:id | — | Detail (public read) |
| POST | /api/admin/master/:resource | master:create | Create |
| PUT | /api/admin/master/:resource/:id | master:update | Update |
| DELETE | /api/admin/master/:resource/:id | master:delete | Delete |

## Resources

- countries — Data negara
- regions — Data provinsi/wilayah
- cities — Data kota
- destinations — Data destinasi
- hotels — Data hotel
- airlines — Data maskapai
- facilities — Data fasilitas
- categories — Data kategori paket
- currencies — Data mata uang

## GET /api/master/cities?countryId=uuid&search=jakarta&page=1&limit=20
`json
{
  "success": true,
  "data": [{ "id": "uuid", "name": "Jakarta", "countryId": "uuid", "countryName": "Indonesia" }],
  "pagination": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 }
}
`
"@ | Set-Content -Path "D:\test-safiq-iid\docs\05-api\02-master-data-api.md" -Encoding UTF8

@"
# Package API

## Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | /api/packages | — | List published (public) |
| GET | /api/packages/:slug | — | Detail (public) |
| GET | /api/admin/packages | package:read | List all (admin) |
| GET | /api/admin/packages/:id | package:read | Detail (admin) |
| POST | /api/admin/packages | package:create | Create |
| PUT | /api/admin/packages/:id | package:update | Update |
| DELETE | /api/admin/packages/:id | package:delete | Delete |
| PATCH | /api/admin/packages/:id/status | package:update | Update status |

## GET /api/packages (Public)
Query: ?category=slug&search=keyword&featured=true&page=1&limit=10

Response:
`json
{
  "success": true,
  "data": [{
    "id": "uuid", "title": "Paket Reguler 12 Hari", "slug": "...",
    "category": { "name": "Reguler" }, "duration": 12,
    "price": 25000000, "promoPrice": 23500000, "currency": "IDR",
    "airline": "Saudi Airlines", "quota": 50, "seatFilled": 35,
    "thumbnail": "https://...", "featured": true, "badge": "Best Seller",
    "schedules": [{ "departureDate": "2026-09-15", "seat": 50, "seatFilled": 20 }]
  }],
  "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
`

## POST /api/admin/packages
Permission: package:create
Request: { "title", "excerpt", "description", "categoryId", "duration", "price", "promoPrice", "currency", "airline", "quota", "thumbnail", "metaTitle", "metaDescription", "hotels": [{ "hotelId", "type" }], "facilities": [], "itineraries": [{ "day", "title", "description" }], "schedules": [{ "departureDate", "seat" }] }
Success (201): { "success": true, "data": { "id": "uuid", "slug": "..." } }
