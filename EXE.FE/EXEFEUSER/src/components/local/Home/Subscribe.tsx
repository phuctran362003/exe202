import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { subschema } from '@/lib/Schemas/Subscribe'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Subscribe() {
  const form = useForm<z.infer<typeof subschema>>({
    resolver: zodResolver(subschema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (data: z.infer<typeof subschema>) => {
    console.log(data)
    form.reset()
    toast.success('Đăng kí thành công!')
  }
  return (
    <div className='w-full'>
      <Form {...form}>
        <form className='w-full flex flex-col items-center gap-8' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='shadow-lg'>
            <p className='text-4xl w-full text-center'>Đăng ký nhận bản tin</p>
            <p className='font-light text-gray-400 p-4 text-xs text-center'>
              Đăng kí bằng email của bạn để nhận được những thông báo về ưu đãi về sản phẩm mới và những ưu đãi mới nhất của chúng tôi{' '}
            </p>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='px-10'>
                  <FormControl>
                    <Input className='p-4 text-lg mb-6 border-none' placeholder='email@gmail.com' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button className='font-thin text-xs'>Đăng ký ngay</Button>
        </form> 
      </Form>
    </div>
  )
}
