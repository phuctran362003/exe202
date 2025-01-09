import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import REAPI from '@/lib/2REAPI'
import { toast } from 'sonner'
import { ProductDetail } from '@/types'
import Loading from '../Loading/Loading'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { convertPercentageToNumber } from '@/lib/utils'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface UpdateProductFormProps {
  product: ProductDetail | undefined
  setEdit: (value: boolean) => void
  edit: boolean
}

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

export default function UpdateProductForm({ product, setEdit, edit }: UpdateProductFormProps) {
  const [formData, setFormData] = useState({
    shopId: product?.shopId,
    name: product?.name,
    price: product?.price,
    sale: product?.sale,
    size: product?.size,
    sizeId: product?.sizeId,
    brand: product?.brand,
    category: product?.category,
    categoryId: product?.categoryId,
    genderCategory: product?.genderCategory,
    genderCategoryId: product?.genderCategoryId,
    description: product?.description,
    oldImgUrl: product?.listImgUrl ? [...product?.listImgUrl, product?.mainImgUrl] : [],
    newImgUrl: [] as File[],
    status: product?.status,
    condition: convertPercentageToNumber(product?.condition ?? '0%')
  })

  const defaultFormData = {
    shopId: product?.shopId,
    name: product?.name,
    price: product?.price,
    sale: product?.sale,
    size: product?.size,
    sizeId: product?.sizeId,
    brand: product?.brand,
    category: product?.category,
    categoryId: product?.categoryId,
    genderCategory: product?.genderCategory,
    genderCategoryId: product?.genderCategoryId,
    description: product?.description,
    oldImgUrl: product?.listImgUrl ? [...product?.listImgUrl, product?.mainImgUrl] : [],
    newImgUrl: [] as File[],
    status: product?.status,
    condition: convertPercentageToNumber(product?.condition ?? '0%')
  }

  const [categories, setCategories] = useState<Category[]>([])
  const [genderCategories, setGenderCategories] = useState<GenderCategory[]>([])
  const [brands, setBrands] = useState([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleRemoveOldImage = (index: number) => {
    const updatedImages = formData.oldImgUrl.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      oldImgUrl: updatedImages
    })
  }

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
    // formEndData.append('shopOwnerId', formData.shopId ?? '')
    formEndData.append('categoryId', formData.categoryId ?? '')
    formEndData.append('genderCategoryId', formData.genderCategoryId ?? '')
    formEndData.append('sizeId', formData.sizeId ?? '')
    formEndData.append('name', formData.name ?? '')
    formEndData.append('price', String(formData.price))
    // formEndData.append('oldImg', String([]))
    // formEndData.append('listImgUrl', String([]))
    formEndData.append('description', formData.description ?? '')
    formEndData.append('brand', formData.brand ?? '')
    formEndData.append('condition', formData.condition + '%')
    formEndData.append('sale', String(formData.sale))
    formData.oldImgUrl.forEach((url, index) => {
      formEndData.append(`oldImg[${index}]`, url)
    })

    formData.newImgUrl.forEach((file) => {
      formEndData.append('listImgUrl', file)
    })
    console.log('FormData prepared for submission:')
    for (let pair of formEndData.entries()) {
      console.log(`${pair[0]}:`, pair[1])
    }
    try {
      const response = await REAPI.put(`/product/${product?.productId}`, formEndData)
      if (response.status === 200) {
        toast.success('Cập nhật sản phẩm thành công')
        setTimeout(() => {
          setEdit(false)
          navigate('/products')
        })
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Cập nhật sản phẩm thất bại')
      setEdit(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData(defaultFormData)
    setEdit(false)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-primary'>Ảnh sản phẩm:</label>

        <div className='flex gap-2 mt-2'>
          {formData.oldImgUrl.map((img, index) => (
            <div key={index} className='relative'>
              <img src={img} alt={`Old Image ${index}`} className='w-28 h-28 object-cover' />
              {edit && (
                <button
                  className='absolute flex justify-center items-center rounded-full w-4 h-4 top-1 right-1 bg-red-500 text-white'
                  onClick={() => handleRemoveOldImage(index)}
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className='flex gap-2 mt-3'>
          {formData.newImgUrl.map((file, index) => (
            <div key={index} className='relative'>
              <img src={URL.createObjectURL(file)} alt={`New Image ${index}`} className='w-28 h-28 object-cover' />
              {edit && (
                <button
                  className='absolute flex justify-center items-center rounded-full w-4 h-4 top-1 right-1 bg-red-500 text-white'
                  onClick={() => handleRemoveNewImage(index)}
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
        </div>

        {edit && (
          <div className='mt-3'>
            <input type='file' multiple onChange={handleImageUpload} />
          </div>
        )}
      </div>
      <div>
        <label htmlFor='name' className='block text-primary'>
          Tên sản phẩm:
        </label>
        <Input
          type='text'
          id='name'
          name='name'
          disabled={!edit}
          value={formData.name}
          onChange={handleChange}
          className='border p-2 rounded w-full'
        />
      </div>

      <div className='flex w-full justify-between gap-5'>
        <div className='flex-1'>
          <label htmlFor='price' className='block text-primary'>
            Giá:
          </label>
          <Input
            type='number'
            id='price'
            name='price'
            disabled={!edit}
            value={formData.price}
            onChange={handleChange}
            className='border p-2 rounded w-full'
            unit='vnđ'
          />
        </div>
        <div className='flex-1'>
          <label htmlFor='sale' className='block text-primary'>
            Giảm giá:
          </label>
          <Input
            type='number'
            id='sale'
            name='sale'
            disabled={!edit}
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
            disabled={!edit}
            name='sizeId'
            value={formData.sizeId}
            onValueChange={(value) => handleSelectChange('sizeId', value)}
          >
            <SelectTrigger className='border-[#b2927b]/30 bg-[#e8dfd7]'>
              <SelectValue placeholder='' />
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
            disabled={!edit}
            name='genderCategory'
            value={formData.genderCategoryId}
            onValueChange={(value) => handleSelectChange('genderCategoryId', value)}
          >
            <SelectTrigger className='border-[#b2927b]/30 bg-[#e8dfd7]'>
              <SelectValue placeholder='' />
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
            disabled={!edit}
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
            disabled={!edit}
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

      <div>
        <label htmlFor='brand' className='block text-primary'>
          Thương hiệu:
        </label>
        <Select
          disabled={!edit}
          name='brand'
          value={formData.brand}
          onValueChange={(value) => handleSelectChange('brand', value)}
        >
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
      </div>

      <div>
        <label htmlFor='description' className='block text-primary'>
          Mô tả:
        </label>
        <textarea
          disabled={!edit}
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          className='border p-2 rounded w-full border-[#b2927b]/30 bg-[#e8dfd7] disabled:cursor-not-allowed disabled:opacity-50'
        />
      </div>

      {edit && (
        <div className='flex gap-3 w-full justify-end'>
          <Button variant='outline' onClick={handleReset} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
          </Button>
        </div>
      )}
    </form>
  )
}
