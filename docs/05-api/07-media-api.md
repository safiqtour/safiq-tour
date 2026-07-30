# Media API

## Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | /api/admin/media | media:read | List all media |
| POST | /api/admin/media/upload | media:create | Upload file |
| DELETE | /api/admin/media/:id | media:delete | Delete media |
| GET | /api/admin/galleries | media:read | List galleries |
| POST | /api/admin/galleries | media:create | Create gallery |
| PUT | /api/admin/galleries/:id | media:update | Update gallery |
| DELETE | /api/admin/galleries/:id | media:delete | Delete gallery |

## POST /api/admin/media/upload
Content-Type: multipart/form-data
Field: file (jpg, jpeg, png, webp, mp4)
Max: 5MB (foto), 20MB (video)
Success (201): { "success": true, "data": { "id", "url", "thumbnailUrl", "mimeType", "size", "width", "height" } }

## Gallery Items
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | /api/admin/galleries/:id/items | media:read |
| POST | /api/admin/galleries/:id/items | media:create |
| DELETE | /api/admin/galleries/:id/items/:itemId | media:delete |
| PUT | /api/admin/galleries/:id/items/reorder | media:update |
