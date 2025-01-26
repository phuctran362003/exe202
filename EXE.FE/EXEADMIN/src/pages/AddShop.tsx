import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import REAPI from '@/lib/2REAPI'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'


export default function AddShop() {
  const [formData, setFormData] = useState({
    userName: '',
    passWord: '',
    email: '',
    address: '',
    phoneNumber: '',
    isShopOwner: true,
    shopName: '',
    shopAddress: '',
    shopDescription: '',
    shopLogo: null as File | null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        shopLogo: e.target.files[0]
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formEndData = new FormData()
    formEndData.append('userName', formData.userName ?? '')
    formEndData.append('passWord', formData.passWord ?? '')
    formEndData.append('email', formData.email ?? '')
    formEndData.append('address', formData.address ?? '')
    formEndData.append('phoneNumber', formData.phoneNumber ?? '')
    formEndData.append('isShopOwner', formData.isShopOwner.toString())
    formEndData.append('shopName', formData.shopName ?? '')
    formEndData.append('shopAddress', formData.shopAddress ?? '')
    formEndData.append('shopDescription', formData.shopDescription ?? '')
    if (formData.shopLogo) {
      formEndData.append('shopLogo', formData.shopLogo)
    }
    try {
      const response = await REAPI.post('/api/Auth/Signup', formEndData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(response.data)
      if (response.status === 200) {
        toast.success('Tạo tài khoản thành công')
      }
      setTimeout(() => {
        navigate('/shops')
      }, 2000)
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Tạo sản phẩm thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6 text-primary'>
        <div className='flex gap-2'>
          <div className='text-3xl font-bold'>Thêm mới cửa hàng</div>
        </div>

        <div className='flex gap-2'>
          <Link className={cn(buttonVariants(), 'flex items-center gap-1 my-auto')} to='/shops'>
            <span>Quay lại</span>
            <ArrowLeft className='w-5 h-5' />
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-primary'>Logo cửa hàng:</label>

          <div className='flex gap-2 mt-2'>
            {formData.shopLogo && (
              <div className='relative'>
                <img src={URL.createObjectURL(formData.shopLogo)} alt='ảnh logo' className='w-28 h-28 object-cover' />
              </div>
            )}
          </div>

          <div className='mt-3'>
            <input type='file' multiple onChange={handleImageUpload} required/>
          </div>
        </div>
        <div>
          <label htmlFor='name' className='block text-primary'>
            Tên khách hàng:
          </label>
          <Input
            type='text'
            id='userName'
            name='userName'
            placeholder='Tên khách hàng'
            value={formData.userName}
            onChange={handleChange}
            required
            className='border p-2 rounded w-full'
          />
        </div>
        
        <div>
          <label htmlFor='name' className='block text-primary'>
            Tên cửa hàng:
          </label>
          <Input
            type='text'
            id='shopName'
            name='shopName'
            placeholder='Tên cửa hàng'
            value={formData.shopName}
            onChange={handleChange}
            required
            className='border p-2 rounded w-full'
          />
        </div>

        <div className='flex w-full justify-between gap-5'>
          <div className='flex-1'>
            <label htmlFor='price' className='block text-primary'>
              Email:
            </label>
            <Input
              type='text'
              id='email'
              name='email'
              value={formData.email}
              placeholder='Email'
              required
              onChange={handleChange}
              className='border p-2 rounded w-full'
            />
          </div>
          <div className='flex-1'>
            <label htmlFor='sale' className='block text-primary'>
              Số điện thoại khách hàng:
            </label>
            <Input
              type='text'
              id='phoneNumber'
              name='phoneNumber'
              required
              value={formData.phoneNumber}
              placeholder='Số điện thoại khách hàng'
              onChange={handleChange}
              className='border p-2 rounded w-full'
            />
          </div>
          <div className='flex-1'>
            <label htmlFor='sale' className='block text-primary'>
              Số điện thoại cửa hàng:
            </label>
            <Input
              type='text'
              id='phoneNumber'
              name='phoneNumber'
              required
              placeholder='Số điện thoại cửa hàng'
              value={formData.phoneNumber}
              onChange={handleChange}
              className='border p-2 rounded w-full'
            />
          </div>
        </div>

        <div>
          <label htmlFor='name' className='block text-primary'>
            Địa chỉ khách hàng:
          </label>
          <Input
            type='text'
            id='address'
            name='address'
            required
            placeholder='địa chỉ khách hàng'
            value={formData.address}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
        </div>

        <div>
          <label htmlFor='name' className='block text-primary'>
            Địa chỉ cửa hàng:
          </label>
          <Input
            type='text'
            id='shopAddress'
            name='shopAddress'
            required
            placeholder='Địa chỉ cửa hàng'
            value={formData.shopAddress}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
        </div>

        <div>
          <label htmlFor='name' className='block text-primary'>
            Mật khẩu:
          </label>
          <Input
            type='text'
            id='passWord'
            name='passWord'
            required
            placeholder='Mật khẩu'
            value={formData.passWord}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
        </div>

        <div>
          <label htmlFor='description' className='block text-primary'>
            Mô tả:
          </label>
          <textarea
            id='shopDescription'
            name='shopDescription'
            required
            placeholder='Mô tả cửa hàng'
            value={formData.shopDescription}
            onChange={handleChange}
            className='border p-2 rounded w-full border-[#b2927b]/30 bg-[#e8dfd7]'
          />
        </div>

        <div className='flex gap-3 w-full justify-end'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Đang cập nhật...' : 'Thêm mới cửa hàng'}
          </Button>
        </div>
      </form>
    </div>
  )
}
