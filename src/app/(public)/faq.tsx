import { cn } from '@/utils/cn'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

const faq: { question: string; answer: string }[] = [
  {
    question: 'Lorem ipdum dolor',
    answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nesciunt.',
  },
  {
    question: 'Lorem ipdum dolor 2',
    answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nesciunt.',
  },
]

export function FAQ() {
  const [openSections, setOpenSections] = useState<number[]>([])

  return (
    <ul>
      {faq.map((item, index) => {
        const isOpen = openSections.includes(index)

        return (
          <li key={item.question} className='border-b py-4 px-8'>
            <button
              className='text-left w-full'
              onClick={() => setOpenSections((p) => (p.includes(index) ? p.filter((i) => i !== index) : [...p, index]))}
            >
              <p className='text-2xl md:text-3xl flex justify-between items-center'>
                {item.question}
                <span className={cn('duration-500', isOpen ? 'rotate-180' : 'rotate-0')}>
                  {isOpen ? <Minus /> : <Plus />}
                </span>
              </p>
            </button>

            <div
              className={cn('overflow-hidden duration-500', isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0')}
            >
              <p className='text-muted-foreground mt-2'>{item.answer}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
