import { z } from 'zod'

export const checkoutSchema = z.object({
    fullname: z.string().min(2, { message: 'First name must be at least 2 characters long' }),
    // lastname: z.string().min(2, { message: 'Last name must be at least 2 characters long' }),
    email: z.string().email(),
    address: z.string().min(10, { message: 'Address must be at 10 characters long' }),
    phonenumber: z.string().startsWith('0', {message: 'Phone number must be start with 0'}).min(10, { message: 'Phone number must be at 10-digit number' }).max(10, { message: 'Phone number must be at 10-digit number' }),
    paymentmethod: z.enum(['QRPAY', 'COD']),
})