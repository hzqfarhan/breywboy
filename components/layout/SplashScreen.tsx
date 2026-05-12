"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function SplashScreen({ destination }: { destination: string }) {
  const router = useRouter()
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, 2000)

    // Redirect after 2.5 seconds (allowing 500ms for fade out animation)
    const redirectTimer = setTimeout(() => {
      router.push(destination)
    }, 2500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(redirectTimer)
    }
  }, [destination, router])

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100] transition-opacity duration-500" style={{ opacity: isFadingOut ? 0 : 1 }}>
      <div className="relative w-32 h-32 flex items-center justify-center animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-4">
        <img src="/assets/brey-this.png" alt="Breywboy" className="w-full h-auto drop-shadow-md animate-pulse" />
      </div>
      <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto opacity-50"></div>
      </div>
    </div>
  )
}
