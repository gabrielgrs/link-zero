export const formatCurrency = (valueInCents: number, currency: 'USD' | 'BRL') =>
  Intl.NumberFormat('en-US', { style: 'currency', currency }).format(valueInCents / 100)
