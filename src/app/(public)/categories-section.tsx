'use client'

import { Link } from '@/components/link'
import { categories } from '@/utils/categories'
import { cn } from '@/utils/cn'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

const MotionLink = motion(Link)

export function CategoriesSection({ selectedCategory }: { selectedCategory?: string }) {
  const [show, setShow] = useState(!selectedCategory)

  const categoriesList = Object.entries(categories)
  const categoriesToShow = show
    ? categoriesList
    : categoriesList.filter(([key]) => key === selectedCategory?.toUpperCase())

  return (
    <motion.section layoutId='categories-section' className='space-y-4'>
      {!selectedCategory && <h2 className='text-center'>Select a category</h2>}
      <motion.div
        className='flex flex-wrap justify-center gap-3 overflow-visible'
        layout
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
          mass: 0.5,
        }}
      >
        {categoriesToShow.map(([key, value], index) => {
          return (
            <MotionLink
              layoutId={key}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              href={`/store/${key.toLowerCase()}`}
              key={key}
              className={cn(
                'inline-flex duration-500 items-center px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap overflow-hidden',
                selectedCategory === key.toLowerCase()
                  ? 'ring-1 ring-inset bg-accent/10'
                  : 'ring-1 ring-inset ring-accent/10 bg-accent/5',
              )}
            >
              <div className='relative flex items-center'>
                <span>{value}</span>
                <AnimatePresence>
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                      mass: 0.5,
                    }}
                    className='absolute right-0'
                  ></motion.span>
                </AnimatePresence>
              </div>
            </MotionLink>
          )
        })}
        {!show && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setShow(true)}
            className={cn(
              'inline-flex duration-500 items-center px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap overflow-hidden',
              'ring-1 ring-inset ring-accent/10 bg-accent/5',
            )}
          >
            Select another category <Plus size={14} />
          </motion.button>
        )}
      </motion.div>
    </motion.section>
  )
}
