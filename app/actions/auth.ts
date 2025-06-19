'use server'

import { prisma } from "@/lib/prisma"
import { signIn } from "@/auth"
import { v4 as uuidv4 } from "uuid"
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

export async function authenticate(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate input
    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    // Find user
    const foundUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!foundUser || !foundUser.password) {
      return { error: "Invalid credentials" }
    }

    // Verify password
    const isValid = await bcrypt.compare(password, foundUser.password)

    if (!isValid) {
      return { error: "Invalid credentials" }
    }

    // Create session
    await prisma.session.create({
      data: {
        sessionToken: uuidv4(),
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        userId: foundUser.id,
      }
    })

    // Sign in using NextAuth
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (result?.error) {
      return { error: "Invalid credentials" }
    }

    return { success: true }
  } catch (error) {
    console.error("Authentication error:", error)
    return { error: "Something went wrong" }
  }
}