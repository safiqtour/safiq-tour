export function generateCode(prefix: string, length = 4): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let random = ""
  for (let i = 0; i < length; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${prefix}${random}`
}

export function generateNumericCode(prefix: string, length = 4): string {
  const random = Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0")
  return `${prefix}${random}`
}

export function generateSequentialCode(prefix: string, count: number, padLength = 3): string {
  return `${prefix}-${String(count + 1).padStart(padLength, "0")}`
}
