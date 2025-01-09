import { useEffect, useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import REAPI from '@/lib/2REAPI'
import { toast } from 'sonner'
import Loading from '@/components/Loading/Loading'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ArrowLeft, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Switch } from '@/components/ui/switch'

interface Size {
  sizeId: string
  sizeName: string
}

interface Category {
  categoryId: string
  name: string
}

interface GenderCategory {
  genderCategoryId: string
  name: string
}

export default function AddProduct() {
  const [formData, setFormData] = useState({
    shopId: '',
    name: '',
    price: 0,
    sale: 0,
    size: '',
    sizeId: '',
    brand: '',
    category: '',
    categoryId: '',
    genderCategory: '',
    genderCategoryId: '',
    description: '',
    oldImgUrl: [],
    newImgUrl: [] as File[],
    status: '',
    condition: 0
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [genderCategories, setGenderCategories] = useState<GenderCategory[]>([])
  const [brands, setBrands] = useState([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCustomBrand, setIsCustomBrand] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCategories = await REAPI.get('/product/categories')
        setCategories(responseCategories.data)

        const responseGenderCategories = await REAPI.get('/product/gender_categories')
        setGenderCategories(responseGenderCategories.data)

        const responseBrands = await REAPI.get('/product/brands')
        setBrands(responseBrands.data)

        const responseSizes = await REAPI.get('/product/sizes')
        setSizes(responseSizes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (type: string, data: string) => {
    setFormData({
      ...formData,
      [type]: data
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        newImgUrl: [...formData.newImgUrl, ...Array.from(e.target.files)]
      })
    }
  }

  // const handleRemoveOldImage = (index: number) => {
  //   const updatedImages = formData.oldImgUrl.filter((_, i) => i !== index)
  //   setFormData({
  //     ...formData,
  //     oldImgUrl: updatedImages
  //   })
  // }

  const handleRemoveNewImage = (index: number) => {
    const updatedNewImages = formData.newImgUrl.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      newImgUrl: updatedNewImages
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formEndData = new FormData()
    formEndData.append('shopOwnerId', user?.userId ?? '')
    formEndData.append('categoryId', formData.categoryId ?? '')
    formEndData.append('genderCategoryId', formData.genderCategoryId ?? '')
    formEndData.append('sizeId', formData.sizeId ?? '')
    formEndData.append('name', formData.name ?? '')
    formEndData.append('price', String(formData.price))
    formEndData.append('sale', String(formData.sale))
    formEndData.append('description', formData.description ?? '')
    formEndData.append('brand', formData.brand ?? '')
    formEndData.append('condition', formData.condition + '%')

    formData.newImgUrl.forEach((file) => {
      formEndData.append('listImgUrl', file)
    })
    console.log('FormData prepared for submission:')
    for (let pair of formEndData.entries()) {
      console.log(`${pair[0]}:`, pair[1])
    }
    try {
      const response = await REAPI.post('/product', formEndData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.status === 200) {
        toast.success('Tạo sản phẩm thành công')
      }
      navigate('/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Tạo sản phẩm thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
      <div className='flex justify-between text-primary items-center mb-6'>
        <div className='flex gap-2'>
          <div className='text-3xl font-bold text-primary'>Thêm mới sản phẩm</div>
        </div>

        <div className='flex gap-2'>
          <Link className={cn(buttonVariants(), 'flex items-center gap-1 my-auto')} to='/products'>
            <span>Quay lại</span>
            <ArrowLeft className='w-5 h-5' />
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-primary'>Ảnh sản phẩm:</label>

          {/* <div className='flex gap-2 mt-2'>
            {formData.oldImgUrl.map((img, index) => (
              <div key={index} className='relative'>
                <img src={img} alt={`Old Image ${index}`} className='w-28 h-28 object-cover' />
                <button
                  className='absolute flex justify-center items-center rounded-full w-4 h-4 top-1 right-1 bg-red-500 text-white'
                  onClick={() => handleRemoveOldImage(index)}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div> */}

          <div className='flex gap-2 mt-3'>
            {formData.newImgUrl.map((file, index) => (
              <div key={index} className='relative'>
                <img src={URL.createObjectURL(file)} alt={`New Image ${index}`} className='w-28 h-28 object-cover' />
                <button
                  className='absolute flex justify-center items-center rounded-full w-4 h-4 top-1 right-1 bg-red-500 text-white'
                  onClick={() => handleRemoveNewImage(index)}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>

          <div className='mt-3'>
            <input type='file' multiple onChange={handleImageUpload} />
          </div>
        </div>
        <div>
          <label htmlFor='name' className='block text-primary'>
            Tên sản phẩm:
          </label>
          <Input
            type='text'
            id='name'
            name='name'
            placeholder='Tên sản phẩm'
            value={formData.name}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
        </div>

        <div className='flex w-full justify-between gap-5'>
          <div className='flex-1'>
            <label htmlFor='price' className='block text-primary'>
              Giá sau giảm:
            </label>
            <Input
              type='number'
              id='price'
              name='price'
              value={formData.price}
              onChange={handleChange}
              className='border p-2 rounded w-full'
              unit='vnđ'
            />
          </div>
          <div className='flex-1'>
            <label htmlFor='sale' className='block text-primary'>
              Giá trước giảm:
            </label>
            <Input
              type='number'
              id='sale'
              name='sale'
              value={formData.sale}
              onChange={handleChange}
              className='border p-2 rounded w-full'
              unit='vnđ'
            />
          </div>
          <div className='flex-1'>
            <label htmlFor='size' className='block text-primary'>
              Kích thước:
            </label>
            <Select
              name='sizeId'
              value={formData.sizeId}
              required
              onValueChange={(value) => handleSelectChange('sizeId', value)}
            >
              <SelectTrigger className='border-[#b2927b]/30 bg-[#e8dfd7]'>
                <SelectValue placeholder='Kích cỡ' />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size.sizeId} value={size.sizeId}>
                    {size.sizeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex w-full justify-between gap-5'>
          <div className='flex-1'>
            <label htmlFor='genderCategory' className='block text-primary'>
              Giới tính:
            </label>
            <Select
              name='genderCategory'
              value={formData.genderCategoryId}
              onValueChange={(value) => handleSelectChange('genderCategoryId', value)}
            >
              <SelectTrigger className='border-[#b2927b]/30 bg-[#e8dfd7]'>
                <SelectValue placeholder='Giới tính' />
              </SelectTrigger>
              <SelectContent>
                {genderCategories.map((gender) => (
                  <SelectItem key={gender.genderCategoryId} value={gender.genderCategoryId}>
                    {gender.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex-1'>
            <label htmlFor='sale' className='block text-primary'>
              Tình trạng:
            </label>
            <Input
              type='number'
              id='condition'
              name='condition'
              value={formData.condition}
              onChange={handleChange}
              className='border p-2 rounded w-full'
              unit='%'
            />
          </div>

          <div className='flex-1'>
            <label htmlFor='categoryId' className='block text-primary'>
              Danh mục:
            </label>
            <Select
              name='categoryId'
              value={formData.categoryId}
              onValueChange={(value) => handleSelectChange('categoryId', value)}
            >
              <SelectTrigger className='border-[#b2927b]/30 bg-[#e8dfd7]'>
                <SelectValue placeholder='' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* <div>
          <label htmlFor='brand' className='block text-primary'>
            Thương hiệu:
          </label>
          <Select name='brand' value={formData.brand} onValueChange={(value) => handleSelectChange('brand', value)}>
            <SelectTrigger className='border-[#b2927b]/30 bg-[#e8dfd7]'> 
              <SelectValue placeholder='' />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        <div className='flex items-center gap-3'>
          <label className='block text-primary'>Thương hiệu:</label>
          <span>{'Chọn từ danh sách'}</span>
          <Switch checked={isCustomBrand} onCheckedChange={setIsCustomBrand} />
          <span>{'Nhập thương hiệu mới'}</span>
        </div>

        {isCustomBrand ? (
          <Input
            type='text'
            id='brand'
            name='brand'
            placeholder='Nhập thương hiệu mới'
            value={formData.brand}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
        ) : (
          <Select name='brand' value={formData.brand} onValueChange={(value) => handleSelectChange('brand', value)}>
            <SelectTrigger className='border-[#b2927b]/30 bg-[#e8dfd7]'>
              <SelectValue placeholder='Chọn thương hiệu có sẵn tại cửa hàng' />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div>
          <label htmlFor='description' className='block text-primary'>
            Mô tả:
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='border p-2 rounded w-full border-[#b2927b]/30 bg-[#e8dfd7]'
          />
        </div>

        <div className='flex gap-3 w-full justify-end'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Đang cập nhật...' : 'Thêm mới sản phẩm'}
          </Button>
        </div>
      </form>
    </div>
  )
}
