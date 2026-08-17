# Auth API

## POST /api/auth/login
- **Auth**: No | **Permission**: —
- **Request**:
`json
{ "email": "admin@safiqtour.com", "password": "********" }
`
- **Success** (200): { "success": true, "data": { "user": { "id": "uuid", "name": "Admin", "email": "...", "role": "ADMIN" } } }
- **Error** (401): { "success": false, "message": "Invalid credentials" }

## POST /api/auth/logout
- **Auth**: Yes | **Permission**: —
- **Success**: { "success": true }

## GET /api/auth/session
- **Auth**: No | **Permission**: —
- **Success**: { "success": true, "data": { "user": {...} } }
- **No session**: { "success": true, "data": null }

## POST /api/auth/register
- **Auth**: Yes | **Permission**: user:create
- **Request**: { "name": "", "email": "", "password": "", "roleId": "uuid" }
- **Success** (201): { "success": true, "data": { "id": "uuid" } }
