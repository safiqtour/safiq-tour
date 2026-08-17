export function buildSearchCondition(
  search?: string,
  fields?: string[],
): Record<string, unknown> | undefined {
  if (!search || !fields?.length) return undefined
  return {
    OR: fields.map((field) => ({
      [field]: { contains: search },
    })),
  }
}
