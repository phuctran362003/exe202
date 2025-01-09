import React, { useEffect, useState } from 'react'
import Container from '@/components/global/Container'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import ProductCard from '@/components/local/Shop/ProductCard'
import REAPI from '@/lib/2REAPI'
import { useAuth } from '@/contexts/AuthContext'
import Loading from '@/components/global/Loading/Loading'
import { Product } from '@/types'

const FavoritePage: React.FC = () => {
  const { user } = useAuth()
  const [listId, setListId] = useState([])
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        setIsLoading(true)
        const response = await REAPI.get(`/favorite/${user?.userId}`)
        setListId(response.data)
      } catch (error) {
        console.error('Fetching favorite products failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (user) {
      fetchFavoriteProducts()
    }
  }, [user])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        let paramsId = ''
        listId.forEach((productId) => {
          if (paramsId !== '') {
            paramsId += '&'
          }
          paramsId += `listId=${productId}`
        })
        const response = await REAPI.get(`/product/list?${paramsId}`)
        const data = response.data
        setFavoriteProducts(data)
      } catch (error) {
        console.error('Fetching favorite products failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (listId.length > 0) {
      fetchProducts()
    }
  }, [listId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='w-full flex flex-col gap-20 my-10'>
      <div className='w-full flex justify-center'>
        <div className='flex flex-col justify-center items-center'>
          <div className='text-4xl mb-5'>Sản phẩm yêu thích</div>
          <Breadcrumb className='text-sm'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='font-bold'>Yêu thích</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className='w-full flex justify-center'>
        <Container>
          {user ? (
            listId.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {favoriteProducts.map((product) => (
                  <div key={product.productId} className='w-full flex justify-center'>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex items-center justify-center'>
                <p className='text-center'>Không có sản phẩm yêu thích nào được thêm!</p>
              </div>
            )
          ) : (
            <div className='flex items-center justify-center'>
              <p className='text-center text-gray-500'>Vui lòng đăng nhập để xem được sản phẩm yêu thích</p>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}

export default FavoritePage
