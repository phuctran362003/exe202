import Loading from '@/components/global/Loading/Loading'
import ProductCard from '@/components/local/Shop/ProductCard'
import REAPI from '@/lib/2REAPI'
import { Product } from '@/types'
import { format } from 'date-fns'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface ShopDetailInterface {
  shopName: string
  shopLogo: string
  shopDescription: string
  shopAddress: string
  totalRating: number
  quantityRating: number
}

interface Review {
  reviewId: string
  userId: string
  userName: string
  shopId: string
  rating: number
  comment: string
  createdAt: string
}

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>()
  const [listProduct, setListProduct] = useState<Product[]>([])
  const [shopDetail, setShopDetail] = useState<ShopDetailInterface>()
  const [isLoading, setIsLoading] = useState(false)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [reviews, setViews] = useState<Review[]>([])
  const [activeTab, setActiveTab] = useState<'products' | 'contact' | 'rating'>('products')
  const [selectedRating, setSelectedRating] = useState<number | null>(0)

  useEffect(() => {
    const fetchShopDetail = async () => {
      try {
        setIsLoading(true)
        const response = await REAPI.get(`/detail/${id}`)
        const responseProduct = await REAPI.get(`/product/product-from-shop/${id}`)
        setShopDetail(response.data)
        const listProduct = responseProduct.data.filter((product: Product) => product.status === 'Có sẵn' || product.status === 'CÓ SẴN')
        setListProduct(listProduct)
        setViews(response.data.reviews)
        setFilteredReviews(response.data.reviews)
      } catch (error) {
        console.error('Fetching shop detail failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (id) {
      fetchShopDetail()
    }
  }, [id])

  useEffect(() => {
    selectedRating === 0 ? setFilteredReviews(reviews) : setFilteredReviews(reviews.filter((review) => review.rating === selectedRating))
  }, [selectedRating, reviews])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
  }

  if (isLoading) {
    return <Loading />
  }

  if (!shopDetail) {
    return <div>Shop not found</div>
  }

  return (
    <div className='w-full h-full flex justify-center mt-10 min-h-screen'>
      <div className='w-full max-w-5xl flex flex-col items-center gap-5'>
        <div className='flex justify-center'>
          <div className='w-40 h-40 border rounded-full'>
            <img
              src={
                !shopDetail.shopLogo
                  ? 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/b8beed59949097.5a357be858f77.jpg'
                  : shopDetail.shopLogo
              }
              className='w-full h-full object-cover rounded-full'
            />
          </div>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <div className='text-3xl font-bold'>{shopDetail.shopName}</div>
          <div className='flex items-center gap-2'>
            <div>{shopDetail.totalRating}</div>
            <Star size={20} color='gray' fill='yellow'/>
            <div>({shopDetail.quantityRating} đánh giá)</div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex gap-4 mt-5'>
          <button
            className={`px-4 py-2 ${activeTab === 'products' ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Sản phẩm
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'contact' ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Liên hệ
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'rating' ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('rating')}
          >
            Đánh giá
          </button>
        </div>

        {/* Tab Content */}
        <div className='w-full mt-5'>
          {activeTab === 'products' && (
            <div className='grid grid-cols-3 p-5 gap-4 gap-y-14'>
              {listProduct.map((product) => (
                <div className='flex justify-center'>
                  <ProductCard key={product.productId} product={product} />
                </div>
              ))}
            </div>
          )}
          {activeTab === 'contact' && (
            <div className='w-full flex justify-center'>
              <div className='flex w-full max-w-4xl justify-center items-center gap-3 flex-col'>
                <div className='text-lg'>
                  <strong>Địa chỉ:</strong> {shopDetail.shopAddress}
                </div>
                <div className='text-lg'>
                  <strong>Mô tả:</strong> {shopDetail.shopDescription}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'rating' && (
            <div className='flex justify-center w-full'>
              <div className='flex flex-col w-full max-w-2xl'>
                <div className='flex gap-2 mb-5 justify-center'>
                  {[0, 5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      className={`flex items-center bg-white px-4 py-2 border rounded-lg ${selectedRating === star ? 'font-bold border-primary border-3' : ''}`}
                    >
                      {star === 0 ? 'Tất cả' : star} {star !== 0 && <Star size={16} fill='yellow' color='gray'/>}
                    </button>
                  ))}
                </div>

                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <div key={review.reviewId} className='border p-4 mb-4 rounded-lg'>
                      <div className='flex items-center gap-2'>
                        <div className='font-bold'>{review.userName}</div>
                        <div className='flex items-center gap-1'>
                          {[...Array(review.rating)].map((_, index) => (
                            <Star key={index} size={16} fill='yellow' color='yellow' />
                          ))}
                        </div>
                      </div>
                      <div className='text-sm text-gray-500'>{formatDate(review.createdAt)}</div>
                      <div className='mt-2'>{review.comment}</div>
                    </div>
                  ))
                ) : (
                  <div className='w-full flex justify-center'>Không có đánh giá nào cho cửa hàng</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
