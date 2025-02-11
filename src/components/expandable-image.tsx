'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ExpandableImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export default function ExpandableImage({ src, alt, width, height }: ExpandableImageProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setIsExpanded(false)

    if (isExpanded) document.addEventListener('keydown', handleKeyDown)
    else document.removeEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isExpanded])

  return (
    <>
      <motion.div
        className='cursor-pointer'
        onClick={() => setIsExpanded((p) => !p)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className='rounded-lg border shadow object-cover'
          style={{ height, width }}
        />
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-50'
            onClick={() => setIsExpanded((p) => !p)}
          >
            <motion.div
              className='relative max-w-full max-h-full'
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                layout='responsive'
                objectFit='contain'
                width={width}
                height={height}
                className='rounded-lg'
              />
              <motion.button
                onClick={() => setIsExpanded((p) => !p)}
                className='fixed top-4 right-4 z-10 bg-secondary/50 text-muted-foreground backdrop-blur-sm rounded'
                aria-label='Close fullscreen image'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={40} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
