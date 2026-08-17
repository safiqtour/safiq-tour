# ERD — CMS

## Entity List

### Article
- **Purpose**: Konten artikel/blog
- **PK**: id (UUID)
- **FK**: categoryId → Category.id, authorId → Author.id
- **Index**: slug, status, categoryId, authorId, publishedAt
- **Fields**: id, title, slug, excerpt, content, thumbnail, categoryId, authorId, metaTitle, metaDescription, keywords, status (DRAFT/PUBLISHED/ARCHIVED), publishedAt, createdAt, updatedAt
- **Relationships**: belongs to Category, belongs to Author, has many ArticleTags

### Category
- **Purpose**: Kategori artikel
- **PK**: id (UUID)
- **FK**: —
- **Index**: slug
- **Fields**: id, name, slug, description, sortOrder, isActive, createdAt, updatedAt
- **Relationships**: has many Articles

### Author
- **Purpose**: Penulis artikel
- **PK**: id (UUID)
- **FK**: userId → User.id
- **Index**: slug, userId
- **Fields**: id, name, slug, bio, avatar, userId, createdAt, updatedAt
- **Relationships**: belongs to User, has many Articles

### Tag
- **Purpose**: Tag artikel
- **PK**: id (UUID)
- **FK**: —
- **Index**: slug
- **Fields**: id, name, slug, createdAt, updatedAt
- **Relationships**: has many ArticleTags

### ArticleTag
- **Purpose**: Relasi artikel dengan tag
- **PK**: id (UUID)
- **FK**: articleId → Article.id, tagId → Tag.id
- **Index**: articleId, tagId
- **Fields**: id, articleId, tagId, createdAt
- **Relationships**: belongs to Article, belongs to Tag
- **Unique**: [articleId, tagId]

### Comment
- **Purpose**: Komentar pada artikel
- **PK**: id (UUID)
- **FK**: articleId → Article.id, parentId → Comment.id
- **Index**: articleId, status
- **Fields**: id, articleId, parentId, name, email, content, status (PENDING/APPROVED/REJECTED), createdAt, updatedAt
- **Relationships**: belongs to Article, belongs to Parent (Comment), has many Replies
