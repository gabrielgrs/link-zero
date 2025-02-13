'use client'

import { generateDownloadUrl } from '@/actions/product'

export function DownloadButton({ productId }: { productId: string }) {
  return (
    <button
      onClick={async () => {
        const [url, err] = await generateDownloadUrl({ productId })
        if (err) return console.log(err)

        window.open(url, '_blank')
      }}
    >
      Download
    </button>
  )
}
