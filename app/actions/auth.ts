'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function register(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password || !name) {
      return {
        error: "All fields are required"
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return {
        error: "Email already registered"
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER"
      }
    })

    return {
      success: true

    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      error: "Something went wrong"
    }
  }
}

