import ViewDetailShop from '@/components/global/ViewDetailShop'
import Loading from '@/components/Loading/Loading'
import { buttonVariants } from '@/components/ui/button'
import REAPI from '@/lib/2REAPI'
import { cn } from '@/lib/utils'
import { ShopDetail } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ShopDetails() {
  const { id } = useParams()
  const edit = false
  const [product, setProduct] = useState<ShopDetail>()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const response = await REAPI.get(`/detail/${id}`)
        const data = await response.data
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if(id) {
      fetchProduct()
    }
  }, [id])

  if(isLoading) {
    return <Loading />
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex gap-2'>
          <div className='text-3xl font-bold'>{!edit ? 'Chi tiết cửa hàng' : 'Chỉnh sửa sản phẩm'}</div>
        </div>

        <div className='flex gap-2'>
          <Link className={cn(buttonVariants(), 'flex items-center gap-1 my-auto')} to='/shops'>
            <span>Quay lại</span>
            <ArrowLeft className='w-5 h-5' />
          </Link>
        </div>
      </div>
      <ViewDetailShop product={product}  edit={edit}/>
    </div>
  )
}
