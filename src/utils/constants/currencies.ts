export const currencies = ['USD'] as const

export type Currency = (typeof currencies)[number]
