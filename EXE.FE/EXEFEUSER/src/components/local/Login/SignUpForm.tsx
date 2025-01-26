import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { registerSchema } from '@/lib/Schemas/LoginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Logo from '@/assets/Logo.png'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
// import googleIcon from '@/assets/google.svg'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Shell } from 'lucide-react'
import { toast } from 'sonner'

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phoneNumber: '',
      address: ''
    }
  })
  // const handleGoogleLogin = () => {
  //   console.log('login with google')
  // }

  const onSumit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true)
      await signup(data)
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      toast.error('Đăng kí tài khoản thất bại')
    }
  }
  return (
    <div className='w-full h-full text-primary flex justify-center items-center py-4 lg:p-8'>
      <div className='w-2/3 mx-auto flex flex-col justify-center space-y-6'>
        <div className='flex flex-col items-center'>
          <div className='font-medium text-2xl flex items-center'>
            Đăng kí <img className='w-10 h-10' src={Logo} alt='logo app' /> với
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSumit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='w-full grid items-center gap-1.5'>
                      <Label htmlFor='email'>
                        Tên đầy đủ
                        {/* <span className='text-red-500'>*</span> */}
                      </Label>
                      <Input {...field} id='email' placeholder='Vd: Nguyễn Văn A' />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-3'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem style={{ flex: '2' }}>
                    <FormControl>
                      <div className='w-full grid items-center gap-1.5'>
                        <Label htmlFor='email'>
                          Email
                          {/* <span className='text-red-500'>*</span> */}
                        </Label>
                        <Input {...field} id='email' placeholder='abc@gmail.com' />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <div className='w-full grid items-center gap-1.5'>
                        <Label htmlFor='password'>
                          Số điện thoại
                          {/* <span className='text-red-500'>*</span> */}
                        </Label>
                        <Input {...field} id='password' type='tel' placeholder='Vd: 0xxxxxxxx' />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <div className='w-full grid items-center gap-1.5'>
                      <Label htmlFor='address'>
                        Địa chỉ
                        {/* <span className='text-red-500'>*</span> */}
                      </Label>
                      <Input {...field} id='address' type='tel' placeholder='Nhập địa chỉ của bạn' />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-3'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <div className='w-full grid items-center gap-1.5'>
                        <Label htmlFor='password'>Mật khẩu</Label>
                        <Input {...field} id='password' type='password' placeholder='Nhập mật khẩu' />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <div className='w-full grid items-center gap-1.5'>
                        <Label htmlFor='password'>Xác nhận mật khẩu</Label>
                        <Input {...field} id='password' type='password' placeholder='Xác nhận' />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={isLoading} type='submit' className='w-full'>
              Đăng kí {isLoading && <Shell className='w-4 h-4 ml-1 animate-spin' />}
            </Button>
          </form>
        </Form>
        {/* <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='px-2 bg-background text-muted-foreground'>Hoặc tiếp tục với</span>
          </div>
        </div>
        <Button
          onClick={() => {
            handleGoogleLogin()
          }}
          variant='outline'
          type='button'
        >
          <img className='mr-2 w-7 h-7' alt='google' src={googleIcon} />
          Tiếp tục với Google
        </Button> */}
        <p className='mx-auto text-sm'>
          Bạn đã có tài khoản?{' '}
          <Link className='text-primary hover:underline font-bold' to='/auth/sign-in'>
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
