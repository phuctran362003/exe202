import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { Link } from 'react-router-dom'
import REAPI from '@/lib/2REAPI'
import { Product } from '@/types'
import Loading from '@/components/global/Loading/Loading'

export default function Arrivals() {
  const [selectedType, setSelectedType] = useState<string>('Nam')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    setIsLoading(true)
    const filteredProducts = async () => {
      try {
        const response = await REAPI.get('/product/newest')
      setProducts(response.data)
      } catch {
        console.log('Error')
      } finally {
        setIsLoading(false)
      }
    }
    filteredProducts()
  }, [])
  
  const handleNavClick = (type: string) => {
    setSelectedType(type)
  }
  

  // const filteredProducts = products.filter((product) => product.genderCategory === selectedType)

  if (products.length > 6) {
    products.length = 6
  }

  // const getButtonClass = (type: string) => {
  //   return `${selectedType === type ? 'hover:bg-black hover:text-white' : 'bg-[#FAFAFA] text-[#8A8A8A] shadow-none hover:bg-[#FAFAFA] hover:text-[#8A8A8A]'}`
  // }
  if(isLoading) {
    return <Loading />
  }


  return (
    <div>
      {products.length > 0 ? (
        <div className='grid grid-cols-3 gap-10 px-10 mt-3'>
        {products.map((product) => (
          <Link to={`/productDetails/` + product.productId}>
            <ProductCard key={product.productId} {...product} />
          </Link>
        ))}
      </div>
      ) : (
        <div className='flex justify-center items-center h-[300px]'>No products found</div>
      )}
    </div>
  )
}
