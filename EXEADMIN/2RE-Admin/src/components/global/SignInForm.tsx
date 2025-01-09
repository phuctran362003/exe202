import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TSignInSchema, signInSchema } from '../../lib/LoginSchema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useToast } from '../ui/use-toast'
import background from '@/assets/background1.jpg'
import Icon from '@/assets/Logo.png'
import { useAuth } from '@/auth/AuthContext'
import { Loader } from 'lucide-react'
function SignInForm() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggingGoogle, setIsLoggingGoogle] = useState(false)

  async function onSubmit(values: TSignInSchema) {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      await login(values.email, values.password)
    } catch (error: any) {
      const messageError = error.response.data.message
      toast({
        variant: 'destructive',
        description: messageError || 'Không rõ nguyên nhân',
        title: 'Lỗi đăng nhập'
      })
      if (messageError === 'Email chưa được xác thực.') {
        navigate(`/auth/${error.response.data.userId}/verify-email?email=${error.response.data.email}`)
      }
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <div className='bg-teriary container relative grid flex-col items-center justify-center min-h-screen lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex'>
          <div
            style={{
              backgroundImage: `url(${background})`
            }}
            className='absolute inset-0 bg-left-top bg-cover'
          />
        </div>
        <div className='py-4 lg:p-8'>
          
          <div className='py-4 lg:p-8 text-primary'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
              <div className='flex flex-col space-y-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight'>Đăng nhập</h1>
                <p className='text-sm'>
                  để tiếp tục với <img className='inline w-5 h-5 mb-1' alt='icon' src={Icon} /> 2RE Secondhand
                </p>
              </div>
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder='Nhập email ...' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
                          <FormControl>
                            <Input type='password' placeholder='Nhập mật khẩu ...' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button disabled={loading} type='submit' className='w-full text-white'>
                      {loading && <Loader className='w-4 h-4 animate-spin' />} Đăng nhập
                    </Button>
                  </form>
                </Form>
              </>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default SignInForm
