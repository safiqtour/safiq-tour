# ERD — System

## Entity List

### User
- **Purpose**: Data user / staff
- **PK**: id (UUID)
- **FK**: roleId → Role.id
- **Index**: email, roleId
- **Fields**: id, name, email, password, roleId, image, isActive, lastLogin, createdAt, updatedAt
- **Relationships**: belongs to Role, has many Sessions, has many Accounts
- **Note**: Menggunakan Auth.js dengan Prisma adapter

### Role
- **Purpose**: Role / jabatan user
- **PK**: id (UUID)
- **FK**: —
- **Index**: name
- **Fields**: id, name, slug, description, level, isActive, createdAt, updatedAt
- **Relationships**: has many Users, has many RolePermissions

### Permission
- **Purpose**: Izin akses spesifik
- **PK**: id (UUID)
- **FK**: —
- **Index**: name, resource, action
- **Fields**: id, name, resource, action (CREATE/READ/UPDATE/DELETE/ALL), description, createdAt, updatedAt
- **Relationships**: has many RolePermissions

### RolePermission
- **Purpose**: Relasi role dengan permission
- **PK**: id (UUID)
- **FK**: roleId → Role.id, permissionId → Permission.id
- **Index**: roleId, permissionId
- **Fields**: id, roleId, permissionId, isAllowed, createdAt
- **Relationships**: belongs to Role, belongs to Permission
- **Unique**: [roleId, permissionId]

### Session
- **Purpose**: Session Auth.js
- **PK**: id (UUID)
- **FK**: userId → User.id
- **Index**: sessionToken, userId
- **Fields**: id, sessionToken, userId, expires, createdAt

### Account
- **Purpose**: Account Auth.js (OAuth)
- **PK**: id (UUID)
- **FK**: userId → User.id
- **Index**: provider + providerAccountId (unique), userId
- **Fields**: id, userId, type, provider, providerAccountId, refreshToken, accessToken, expiresAt, tokenType, scope, idToken, sessionState, createdAt

### VerificationToken
- **Purpose**: Token verifikasi Auth.js
- **PK**: identifier + token (composite)
- **Index**: token (unique), expires
- **Fields**: identifier, token, expires

### ActivityLog
- **Purpose**: Catatan aktivitas user
- **PK**: id (UUID)
- **FK**: userId → User.id
- **Index**: userId, resource, action, createdAt
- **Fields**: id, userId, resource, resourceId, action, metadata (JSON), ipAddress, userAgent, createdAt
- **Relationships**: belongs to User

### Setting
- **Purpose**: Konfigurasi sistem
- **PK**: id (UUID)
- **FK**: —
- **Index**: key (unique)
- **Fields**: id, key, value, type (STRING/NUMBER/BOOLEAN/JSON), description, createdAt, updatedAt

## System Audit Fields

Setiap entitas transaksional wajib memiliki:
- createdAt (DateTime, default now)
- updatedAt (DateTime, @updatedAt)
- createdById (optional, FK to User) — future
- deletedAt (optional, untuk soft delete) — future
