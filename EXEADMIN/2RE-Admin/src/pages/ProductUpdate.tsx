
import UpdateProductForm from '@/components/global/UpdateProductForm'
import Loading from '@/components/Loading/Loading'
import { Button, buttonVariants } from '@/components/ui/button'
import REAPI from '@/lib/2REAPI'
import { cn } from '@/lib/utils'
import { ProductDetail } from '@/types'
import { ArrowLeft, Edit } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ProductUpdate() {
  const { id } = useParams()
  const [edit, setEdit] = useState(false)
  const [product, setProduct] = useState<ProductDetail>()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const response = await REAPI.get(`/product/${id}`)
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
          <div className='text-3xl font-bold'>{!edit ? 'Chi tiết sản phẩm' : 'Chỉnh sửa sản phẩm'}</div>
        </div>

        <div className='flex gap-2'>
          {(!edit && product?.status.toLowerCase() !== 'hết hàng') && (
            <Button
              onClick={() => {
                setEdit(true)
              }}
              className='flex items-center gap-1 my-auto'
            >
              <span>Chỉnh sửa</span>
              <Edit className='w-5 h-5' />
            </Button>
          )}
          <Link className={cn(buttonVariants(), 'flex items-center gap-1 my-auto')} to='/products'>
            <span>Quay lại</span>
            <ArrowLeft className='w-5 h-5' />
          </Link>
        </div>
      </div>
      <UpdateProductForm product={product} setEdit={setEdit} edit={edit}/>
    </div>
  )
}
