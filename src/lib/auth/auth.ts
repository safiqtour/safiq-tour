import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { findUserByEmail, verifyPassword, updateLastLogin } from "@/services/auth.service"
import { logActivity } from "@/services/audit.service"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await findUserByEmail(credentials.email as string)
        if (!user || !user.password) return null

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password
        )
        if (!isValid) return null

        await updateLastLogin(user.id)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          roleId: user.roleId,
          role: user.role
            ? {
                id: user.role.id,
                name: user.role.name,
                slug: user.role.slug,
                level: user.role.level,
              }
            : null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.roleId = (user as { roleId: string | null }).roleId
        token.role = (user as { role: { id: string; name: string; slug: string; level: number } | null }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.roleId = token.roleId as string | null
        session.user.role = token.role as {
          id: string
          name: string
          slug: string
          level: number
        } | null
      }
      return session
    },
    async signIn({ user }) {
      if (user) {
        await logActivity({
          action: "LOGIN",
          resource: "user",
          resourceId: user.id,
          metadata: { email: user.email },
        })
      }
      return true
    },
  },
  events: {
    async signOut(message) {
      if ("token" in message && message.token && typeof message.token === "object" && "id" in message.token) {
        const token = message.token as { id: string }
        await logActivity({
          action: "LOGOUT",
          resource: "user",
          resourceId: token.id,
        })
      }
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
})
