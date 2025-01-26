import Loading from '@/components/global/Loading/Loading'
import ProductCard from '@/components/local/Shop/ProductCard'
import REAPI from '@/lib/2REAPI'
import { Product } from '@/types'
import { useEffect, useState } from 'react'

interface ProductRelatedProps {
  productId: string | undefined
}

const ProductRelated = ({ productId }: ProductRelatedProps) => {
  const [listProducts, setListProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await REAPI.get(`/product/related/${productId}`)
        const data = await response.data
        response.data.length = 4
        setListProducts(data)
      } catch (error) {
        console.error('Fetching related products failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (productId) {
      fetchProducts()
    }
  }, [productId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='mb-4'>
      <div className='border-b-4 border-black -mb-4'>
        <h2 className='text-3xl font-bold pt-4 pb-2 pl-2'>Sản phẩm liên quan</h2>
      </div>
      {listProducts.length > 0 ? (
        <div className='grid grid-cols-4 mt-10 gap-10'>
          {listProducts.map((product) => (
            <div key={product.productId} className='flex justify-center'>
              <ProductCard key={product.productId} product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className='flex justify-center items-center min-h-56'>
          <div className='font-bold text-xl'>Không có sản phẩm liên quan</div>
        </div>
      )}
    </div>
  )
}

export default ProductRelated
