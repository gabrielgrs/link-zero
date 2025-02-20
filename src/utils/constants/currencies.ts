export const currencies = ['USD', 'BRL'] as const

export type Currency = (typeof currencies)[number]
