export const currencies = ['usd', 'brl'] as const

export type Currency = (typeof currencies)[number]
