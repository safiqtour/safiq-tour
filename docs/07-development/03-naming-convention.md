# Naming Convention

## TypeScript / JavaScript
| Item | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | totalPrice |
| Functions | camelCase | getPackages() |
| Classes | PascalCase | PackageService |
| Interfaces | PascalCase | PackageData |
| Types | PascalCase | PackageStatus |
| Constants | UPPER_SNAKE_CASE | MAX_UPLOAD_SIZE |
| Booleans | prefix is/has/can | isActive, hasPermission |

## React
| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | PackageCard.tsx |
| Hooks | prefix use | usePackage.ts |
| Props | Interface Props suffix | PackageCardProps |
| State | camelCase | isOpen, setIsOpen |
| Handlers | prefix handle | handleSubmit |

## Database (Prisma)
| Item | Convention | Example |
|------|-----------|---------|
| Model names | PascalCase | PackageBooking |
| Field names | camelCase | departureDate |
| Table names | snake_case | package_bookings |
