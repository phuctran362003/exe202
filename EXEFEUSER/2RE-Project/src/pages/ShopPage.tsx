import Container from '@/components/global/Container'
import Loading from '@/components/global/Loading/Loading'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Card } from '@/components/ui/card'
import REAPI from '@/lib/2REAPI'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface ShopInterface {
  shopId: string
  shopName: string
  shopLogo: string
  totalRating: number
  quantityRating: number
}

export default function ShopPage() {
  const [listShop, setListShop] = useState<ShopInterface[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setIsLoading(true)
        const response = await REAPI.get(`/shop`)
        setListShop(response.data)
      } catch (error) {
        console.error('Fetching shop failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchShop()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='w-full flex flex-col gap-20 py-10'>
      <div className='w-full flex justify-center'>
        <div className='flex flex-col justify-center items-center'>
          <div className='text-4xl mb-5'>Cửa hàng</div>
          <Breadcrumb className='text-sm'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='font-bold'>Cửa hàng</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className='w-full flex justify-center'>
        <Container>
          <div className='w-full flex justify-center'>
            {listShop.length > 0 ? (
              <div className='grid grid-cols-3 gap-10 px-10 mt-3'>
                {listShop.map((shop) => (
                  <Link to={`/shopDetails/` + shop.shopId}>
                    <Card className='bg-teriary flex flex-col justify-center items-start p-4 shadow-md border-none transition-transform duration-300 hover:shadow-lg hover:-translate-y-2'>
                      <div className='w-64 h-64 overflow-hidden rounded-md'>
                        <img
                          className='w-full h-full object-cover transition-transform duration-300 hover:scale-110'
                          src={shop.shopLogo ? shop.shopLogo : 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/b8beed59949097.5a357be858f77.jpg'}
                          alt={shop.shopName}
                        />
                      </div>
                      <div className='flex gap-1'>
                        <div className='truncate font-semibold max-w-60 mt-2 text-primary transition-colors duration-300 hover:text-black'>
                          {shop.shopName}
                        </div>
                      </div>
                      <div className='flex items-center justify-end w-full'>
                        <div>{shop.totalRating}</div>
                        <Star size={16} className='mx-2' fill='yellow' color='gray'/>
                        <div>({shop.quantityRating})</div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className='flex justify-center items-center h-[300px]'>No shop found</div>
            )}
          </div>
        </Container>
      </div>
    </div>
  )
}
