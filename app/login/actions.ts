"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const role = formData.get("role") as string
    let email = ""
    let password = ""

    if (role === "ADMIN") {
      email = "admin@breywboy.demo"
      password = ""
    } else if (role === "CUSTOMER") {
      email = "customer@breywboy.demo"
      password = ""
    } else {
      // Manual form submission
      email = formData.get("email") as string
      password = formData.get("password") as string
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: role === "ADMIN" ? "/admin" : "/app",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials."
        default:
          return "Something went wrong."
      }
    }
    throw error
  }
}

export async function signInWithGoogle() {
  await signIn("google")
}
