import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedPaths = !nextUrl.pathname.startsWith('/sign-in') && 
                            !nextUrl.pathname.startsWith('/sign-up')

      if (protectedPaths && !isLoggedIn) {
        return false
      }

      return true
    },
  },
} satisfies NextAuthConfig