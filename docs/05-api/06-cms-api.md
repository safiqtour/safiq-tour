# CMS API

## Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | /api/articles | — | List published (public) |
| GET | /api/articles/:slug | — | Article detail (public) |
| GET | /api/admin/articles | cms:read | List all (admin) |
| GET | /api/admin/articles/:id | cms:read | Detail (admin) |
| POST | /api/admin/articles | cms:create | Create |
| PUT | /api/admin/articles/:id | cms:update | Update |
| DELETE | /api/admin/articles/:id | cms:delete | Delete |
| PATCH | /api/admin/articles/:id/status | cms:update | Publish/archive |

## Categories & Tags

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET/POST | /api/admin/categories | cms:read / cms:create |
| PUT/DELETE | /api/admin/categories/:id | cms:update / cms:delete |
| GET/POST | /api/admin/tags | cms:read / cms:create |
| DELETE | /api/admin/tags/:id | cms:delete |

## GET /api/articles (Public)
Query: ?category=slug&tag=slug&search=keyword&page=1&limit=10
Response: { "success": true, "data": [{ "title", "slug", "excerpt", "thumbnail", "category", "author", "publishedAt", "tags": [] }], "pagination": {...} }
