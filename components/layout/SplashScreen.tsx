"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function SplashScreen({ destination }: { destination: string }) {
  const router = useRouter()
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Start fade out after 3 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, 3000)

    // Redirect after 3.5 seconds
    const redirectTimer = setTimeout(() => {
      router.push(destination)
    }, 3500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(redirectTimer)
    }
  }, [destination, router])

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[100] transition-opacity duration-700 ease-in-out" style={{ opacity: isFadingOut ? 0 : 1 }}>
      <img 
        src="/assets/breywboy.gif" 
        alt="Breywboy" 
        className="w-full h-full object-contain" 
      />
    </div>
  )
}
