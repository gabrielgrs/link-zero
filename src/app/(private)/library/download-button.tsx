'use client'

import { generateDownloadUrl } from '@/actions/product'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

export function DownloadButton({ productId }: { productId: string }) {
  const action = useServerAction(generateDownloadUrl, {
    onSuccess: ({ data }) => {
      window.open(data.url, '_blank')
      toast.success('Download started!')
    },
    onError: (error) => {
      toast.error(error.err.message || 'Failed. Try again later.')
    },
  })

  return (
    <Button loading={action.isPending} onClick={() => action.execute({ productId })}>
      Download
    </Button>
  )
}
