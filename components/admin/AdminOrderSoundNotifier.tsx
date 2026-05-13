"use client"

import { useEffect, useRef, useState } from "react"

type OrderSnapshot = {
  id: string
  status: string
}

const POLL_INTERVAL_MS = 5000
const RING_SRC = "/assets/ring.mp3"

export function AdminOrderSoundNotifier() {
  const [isAudioReady, setAudioReady] = useState(false)
  const knownOrderIdsRef = useRef<Set<string> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(RING_SRC)
    audio.preload = "auto"
    audioRef.current = audio

    const unlockAudio = async () => {
      const previousVolume = audio.volume
      audio.volume = 0.01

      try {
        await audio.play()
        audio.pause()
        audio.currentTime = 0
        setAudioReady(true)
        window.removeEventListener("pointerdown", unlockAudio)
        window.removeEventListener("keydown", unlockAudio)
      } catch {
        setAudioReady(false)
      } finally {
        audio.volume = previousVolume
      }
    }

    window.addEventListener("pointerdown", unlockAudio)
    window.addEventListener("keydown", unlockAudio)

    return () => {
      window.removeEventListener("pointerdown", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
      audio.pause()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    let isPolling = false
    const controller = new AbortController()

    const playRing = async () => {
      const audio = audioRef.current
      if (!audio) return

      try {
        audio.currentTime = 0
        await audio.play()
      } catch {
        // If autoplay is blocked, the next admin interaction will unlock audio.
      }
    }

    const checkForNewOrders = async () => {
      if (isPolling || document.visibilityState === "hidden") return
      isPolling = true

      try {
        const response = await fetch("/api/admin/orders", {
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        })

        if (!response.ok) return

        const data = await response.json() as { orders?: OrderSnapshot[] }
        const currentNewOrderIds = new Set(
          (data.orders || [])
            .filter((order) => order.status === "NEW")
            .map((order) => order.id)
        )

        if (knownOrderIdsRef.current === null) {
          knownOrderIdsRef.current = currentNewOrderIds
          return
        }

        const hasNewOrder = Array.from(currentNewOrderIds).some((id) => !knownOrderIdsRef.current?.has(id))
        knownOrderIdsRef.current = currentNewOrderIds

        if (hasNewOrder) {
          await playRing()
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("[admin-orders] sound notifier failed:", error)
        }
      } finally {
        isPolling = false
      }
    }

    void checkForNewOrders()
    const interval = window.setInterval(checkForNewOrders, POLL_INTERVAL_MS)

    return () => {
      controller.abort()
      window.clearInterval(interval)
    }
  }, [])

  if (isAudioReady) return null

  return (
    <button
      type="button"
      onClick={async () => {
        const audio = audioRef.current
        if (!audio) return

        const previousVolume = audio.volume
        audio.volume = 0.01

        try {
          await audio.play()
          audio.pause()
          audio.currentTime = 0
          setAudioReady(true)
        } catch {
          setAudioReady(false)
        } finally {
          audio.volume = previousVolume
        }
      }}
      className="fixed bottom-4 right-4 z-[60] rounded-full border bg-white px-4 py-2 text-xs font-bold text-primary shadow-sm hover:bg-secondary"
    >
      Enable sound
    </button>
  )
}
