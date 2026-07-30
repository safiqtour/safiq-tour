import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User extends DefaultUser {
    roleId?: string | null
    role?: {
      id: string
      name: string
      slug: string
      level: number
    } | null
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      roleId: string | null
      role: {
        id: string
        name: string
        slug: string
        level: number
      } | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    roleId: string | null
    role: {
      id: string
      name: string
      slug: string
      level: number
    } | null
  }
}
