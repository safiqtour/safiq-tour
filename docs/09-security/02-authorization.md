# Security — Authorization

## RBAC Implementation
- Role model with hierarchical levels
- Permission model: "resource:action" (e.g., "package:create")
- Role-permission mapping table
- Check at middleware + service layer

## Authorization Flow
```
Request → Middleware (session check) → Service (permission check) → Action
```

## Default Permissions by Role
| Role | Scope |
|------|-------|
| SUPER_ADMIN | All resources:ALL |
| ADMIN | All resources:CRUD |
| FINANCE | payment:*, invoice:* |
| MARKETING | cms:*, media:*, marketing:* |
| CS | booking:*, pilgrim:* |
| MUTHOWIF | pilgrim:read, schedule:read |

## Implementation in Code
```
function authorize(user: User, permission: string): boolean {
  const [resource, action] = permission.split(":")
  return user.role.permissions.some(
    p => p.resource === resource && (p.action === action || p.action === "ALL")
  )
}
```
