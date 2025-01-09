import { z } from 'zod'

export const subschema = z.object({
    email: z.string().email(),
})