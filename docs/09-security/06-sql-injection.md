# Security — SQL Injection

## Strategy
- **Use Prisma ORM exclusively**
- Prisma menggunakan parameterized queries secara default
- Tidak ada raw SQL queries di application code
- Tidak ada string concatenation untuk query

## Rules
1. NEVER use raw SQL in application code
2. NEVER concatenate strings to build queries
3. ALWAYS use Prisma query methods (findMany, create, update, etc.)
4. Prisma $queryRaw hanya untuk kompleksitas tinggi, dengan parameter binding

## Safe Query Example
```
// SAFE — Prisma parameterized
const packages = await prisma.package.findMany({
  where: { title: { contains: searchTerm } }
})

// UNSAFE — jangan lakukan ini
const query = `SELECT * FROM packages WHERE title LIKE '%${searchTerm}%'`
```

## Additional Protection
- Input validation via Zod (type checking, length limits)
- Database constraints (NOT NULL, UNIQUE, CHECK)
- Prisma migration (no manual DDL)
