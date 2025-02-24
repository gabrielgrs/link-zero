export function goToPreview(data: Record<string, unknown>) {
  const searchParams = new URLSearchParams()

  Object.entries(data).forEach(([key, value]) => {
    searchParams.set(key, String(value))
  })
  window.open(`/product/preview?${searchParams.toString()}`, '_blank')
}
