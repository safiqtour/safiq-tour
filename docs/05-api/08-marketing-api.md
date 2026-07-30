# Marketing API

## Promos

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | /api/promos | — (public, active only) |
| GET | /api/admin/promos | marketing:read |
| GET | /api/admin/promos/:id | marketing:read |
| POST | /api/admin/promos | marketing:create |
| PUT | /api/admin/promos/:id | marketing:update |
| DELETE | /api/admin/promos/:id | marketing:delete |

## POST /api/admin/promos
Permission: marketing:create
Request: { "code": "EARLYBIRD", "name": "Early Bird 2026", "type": "PERCENTAGE", "value": 10, "minPurchase": 20000000, "maxDiscount": 3000000, "quota": 100, "startDate": "...", "endDate": "...", "packageIds": [] }

## Testimonials

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | /api/testimonials | — (public, approved only) |
| GET | /api/admin/testimonials | marketing:read |
| POST | /api/admin/testimonials | marketing:create |
| PUT | /api/admin/testimonials/:id | marketing:update |
| PATCH | /api/admin/testimonials/:id/approve | marketing:update |
| DELETE | /api/admin/testimonials/:id | marketing:delete |
