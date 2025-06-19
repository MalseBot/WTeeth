"use client"

import { authenticate } from "@/app/actions/auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError("")
    setLoading(true)

    try {
      const result = await authenticate(formData)

      if (result.error) {
        setError(result.error)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error(error)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form action={handleSubmit} className="space-y-4 w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      <a href="/sign-up" className="text-center">{`I don't have an account`}</a>
      </form>
    </div>
  )
}