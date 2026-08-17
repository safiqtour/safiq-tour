# Master Data API

Prefix: /api/master/

## Endpoints Pattern

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | /api/master/:resource | — | List (public) |
| GET | /api/master/:resource/:id | — | Detail (public) |
| POST | /api/admin/master/:resource | master:create | Create |
| PUT | /api/admin/master/:resource/:id | master:update | Update |
| DELETE | /api/admin/master/:resource/:id | master:delete | Delete |

## Resources

countries, regions, cities, destinations, hotels, airlines, facilities, categories, currencies

## Example

GET /api/master/cities?countryId=uuid&search=jakarta&page=1&limit=20
```json
{
  "success": true,
  "data": [{ "id": "uuid", "name": "Jakarta", "countryId": "uuid" }],
  "pagination": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 }
}
```
