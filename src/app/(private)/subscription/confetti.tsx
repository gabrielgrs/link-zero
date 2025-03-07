'use client'

import confetti from 'canvas-confetti'
import { useEffect } from 'react'

export function Confetti() {
  useEffect(() => {
    confetti({
      particleCount: 300,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  return null
}
