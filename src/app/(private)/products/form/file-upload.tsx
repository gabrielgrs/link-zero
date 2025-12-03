import { Eye, Trash, Upload } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { toast } from 'sonner'

type Props = {
  value?: File | string
  onChange: (file: File | File[] | null) => void
  accept?: string
  placeholder?: string
  maxMb?: number
}

export function FileUpload({ value, onChange, accept, placeholder = 'Upload a file', maxMb }: Props) {
  return (
    <div className='relative w-full flex flex-col py-10 gap-8 items-center border-2 dashed bg-foreground/5 hover:bg-foreground/10 duration-500 rounded-lg px-2 text-sm'>
      {value ? (
        <div className='flex items-center justify-between w-full'>
          <Link
            href={value instanceof File ? URL.createObjectURL(value) : value}
            target='_blank'
            className='w-full truncate text-sm'
          >
            {value instanceof File ? value.name : value.split('/').at(-1)}
          </Link>

          <div className='flex justify-end items-center w-full gap-1'>
            <Link href={value instanceof File ? URL.createObjectURL(value) : value} target='_blank'>
              <Eye size={16} />
            </Link>

            <button type='button' onClick={() => onChange(null)} className='text-destructive'>
              <Trash size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <Upload size={40} className='text-muted-foreground' />
          <input
            className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
            accept={accept}
            onChange={(e) => {
              const rawFiles = e.target.files
              if (!rawFiles) return
              const file = rawFiles[0]

              if (typeof maxMb === 'number' && file.size > maxMb * 1024 * 1024) {
                return toast.error(`File size must be less than ${maxMb}Mb.`)
              }

              onChange(file)
            }}
            type='file'
          />
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
              <p className='flex items-center justify-center h-full w-full duration-500 text-muted-foreground hover:text-primary'>
                {placeholder}
              </p>
              {accept && (
                <p className='text-xs text-muted-foreground text-center mx-auto max-w-lg'>
                  Aceppted formats:{' '}
                  {accept
                    .split(' ')
                    .map((format) => format.split('/').at(-1))
                    .join(', ')}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
