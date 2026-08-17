# Commit Convention

## Format
`
<type>(<scope>): <description>

[optional body]
[optional footer]
`

## Types
| Type | Usage |
|------|-------|
| feat | New feature |
| fix | Bug fix |
| refactor | Code refactoring |
| docs | Documentation |
| style | Formatting (not CSS) |
| test | Tests |
| chore | Build, dependencies |
| perf | Performance |
| db | Database schema changes |

## Examples
`
feat(packages): add package CRUD with validation
fix(booking): handle empty pilgrim list
docs(api): update payment endpoint documentation
db(migrations): add bookings table schema
`

## Rules
1. Imperative, present tense ("add" not "added")
2. Lowercase, no period at end
3. Max 72 characters
4. Scope optional but recommended
