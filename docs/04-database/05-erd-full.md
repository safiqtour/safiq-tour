# Full ERD — All Entities & Relationships

## Entity Count: 30+ Entities

### Master Data (15)
Country, Region, City, Destination, Hotel, Airline, Transportation, Facility, PackageCategory, Promo, Visa, Currency, Media, Gallery, GalleryItem, TourObject, PackageTag

### Transaction (8)
Package, PackageDestination, PackageHotel, PackageGallery, PackageFacility, PackageItinerary, PackageSchedule, Booking, Pilgrim, Payment, Invoice, Document

### CMS (5)
Article, Category, Author, Tag, ArticleTag, Comment

### System (6)
User, Role, Permission, RolePermission, ActivityLog, Setting
Plus: Session, Account, VerificationToken (Auth.js)

## Key Relationships Diagram

`
User 1──N Role
Role 1──N RolePermission N──1 Permission

User 1──N Package (created_by)
Package N──1 PackageCategory
Package N──N Destination (via PackageDestination)
Package N──N Hotel (via PackageHotel)
Package N──N Facility (via PackageFacility)
Package 1──N PackageItinerary
Package 1──N PackageSchedule
Package N──N Media (via PackageGallery)

PackageSchedule 1──N Booking
Booking 1──N Pilgrim
Booking 1──1 Invoice
Booking 1──N Payment
Pilgrim 1──N Document

Article N──1 Category
Article N──N Tag (via ArticleTag)
Article 1──N Comment
Author 1──N Article
Author 1──1 User
`

## Index Strategy

Tabel dengan pencarian tinggi (Package, Booking, Article):
- Full-text search index pada field title, description, content (future)
- Composite index pada (status, publishedAt) untuk publikasi
- Unique index pada slug, email, bookingNumber, invoiceNumber

## Constraints

- Semua UUID primary key
- All time fields in UTC
- Soft delete menggunakan deletedAt (future)
- Cascade delete untuk child entities
- No binary data in database
- Decimal (not float) untuk money
