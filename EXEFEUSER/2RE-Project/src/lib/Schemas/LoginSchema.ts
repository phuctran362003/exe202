import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email({ message: 'Email không hợp lệ'}),
    password: z.string().min(5, { message: 'Mật khẩu có ít nhất 5 kí tự' }),
})

export const registerSchema = z.object({
    fullName: z.string().min(2, { message: 'Tên có ít nhất 2 kí tự' }),
    // firstName: z.string().min(2, { message: 'First name must be at least 2 characters long' }),
    address: z.string().min(2, { message: 'Địa chỉ có ít nhất 2 kí tự' }),
    email: z.string().email(),
    phoneNumber: z.string().startsWith('0', {message: 'Số điện thoại nên bắt đầu bằng 0'}).min(10, { message: 'Số điện thoại phải có 10 chữ số' }).max(10, { message: 'Số điện thoại phải có 10 chữ số' }),
    password: z.string().min(5, { message: 'Mật khẩu có ít nhất 5 kí tự' }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ['confirmPassword'], // path of error
})