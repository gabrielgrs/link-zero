'use client'
import { DollarSign } from 'lucide-react'
import { motion } from 'motion/react'

const randomArray = Array.from({ length: 4 }, () => Math.floor(Math.random() * (200 - 100 + 1) + 100))

export function Salles() {
  return (
    <div className='flex flex-col gap-0 hover:gap-8 duration-500'>
      {randomArray.map((item, index) => {
        return (
          <motion.div
            key={`${index}_${index}`}
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: (index + 1) * -20 }}
            transition={{ duration: 0.5, delay: index * 2 }}
            className='bg-background border-foreground/50 border rounded-[8px] px-2 py-1 flex items-center gap-2'
          >
            <span className='bg-green-700/50 h-8 w-8 flex items-center justify-center rounded-[4px]'>
              <DollarSign size={16} />
            </span>
            <div className='-space-y-1'>
              <p className='text-sm'>You just sold a new product</p>
              <p className='text-sm text-muted-foreground'>
                You received {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item)}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
