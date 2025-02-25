import { Eye, Trash } from 'lucide-react'
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
    <div className='relative h-10 w-full flex items-center border-2 dashed bg-background rounded-lg px-2 text-sm'>
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

            <button type='button' onClick={() => onChange(null)}>
              <Trash size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
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
          <p className='flex items-center justify-center h-full w-full duration-500 text-muted-foreground hover:text-primary'>
            {placeholder}
          </p>
        </>
      )}
    </div>
  )
}
