# Coding Standard

## 1. TypeScript
- Strict mode enabled
- Explicit types for function params and return
- Avoid any (use unknown instead)
- Interface for objects, type for union/intersection
- const/let only, no var

## 2. Functions
- Max ~40 lines per function
- Single responsibility
- Early return for errors
- Avoid side effects in pure functions

## 3. Components
- Max ~200 lines per component
- Props typed with interface/type
- Server Component by default
- Client Component only when interactivity needed

## 4. Imports Order
```
1. External libraries (react, next, etc)
2. Internal utilities (@/lib, @/utils)
3. Components (@/components)
4. Types (@/types)
```

## 5. Exports
- Named exports preferred
- Default export only for page/layout components

## 6. Error Handling
```typescript
async function createPackage(data: Input): Promise<ActionResult> {
  try {
    return { success: true, data: result }
  } catch (error) {
    return { success: false, message: "Failed" }
  }
}
```
