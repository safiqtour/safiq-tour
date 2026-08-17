# API Standards

**Style:** RESTful (via Server Actions & API Routes)  
**Format:** JSON  
**Validation:** Zod  
**Auth:** Auth.js Session

---

## Standard Response Format

### Success
\\\json
{
  "success": true,
  "data": {}
}
\\\

### List with Pagination
\\\json
{
  "success": true,
  "data": [],
  "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}
\\\

### Error
\\\json
{
  "success": false,
  "message": "Human readable error",
  "errors": [{ "field": "email", "message": "Email is required" }]
}
\\\

## HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Rate Limited |
| 500 | Internal Server Error |

## Pagination & Filtering

Query: ?page=1&limit=10&search=keyword&sort=field&order=asc&status=PUBLISHED

## Permission Model

Setiap endpoint mencantumkan permission: "resource:action"
