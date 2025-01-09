import Loading from '@/components/Loading/Loading'
import { useAuth } from '@/auth/AuthContext'
import REAPI from '@/lib/2REAPI'
import { formatCurrency } from '@/lib/utils'
import type { Order } from '@/types/index'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface Product {
  productId: string
  productName: string
  price: number
  imageUrl: string
}

export default function Order() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipping' | 'completed' | 'canceled'>('all')

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    scrollToTop()

    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const response = await REAPI.get(`/product/order-from-shop/${user?.userId}`)
        console.log(response)
        const data = response.data
        console.log(data)
        setOrders(data)
        setFilteredOrders(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
    if (user) {
      fetchOrders()
    }
  }, [user])

  useEffect(() => {
    switch (activeTab) {
      case 'pending':
        setFilteredOrders(orders.filter((order) => order.status === 'pending'))
        break
      case 'shipping':
        setFilteredOrders(orders.filter((order) => order.status === 'shipping'))
        break
      case 'completed':
        setFilteredOrders(orders.filter((order) => order.status === 'completed'))
        break
      case 'canceled':
        setFilteredOrders(orders.filter((order) => order.status === 'canceled'))
        break
      default:
        setFilteredOrders(orders)
    }
  }, [activeTab, orders])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
  }

  const handleViews = async (id: string) => {
    try {
      const response = await REAPI.get(`/shop/detail-cart-from-shop/${id}`)
      const data = response.data
      setProducts(data)
    } catch {
      console.log('Error fetching products')
    }
  }

  if (!user) {
    return (
      <div className='w-full min-h-80 flex justify-center items-center'>
        <div className='flex flex-col items-center'>
          <div className='text-2xl font-medium'>Vui lòng đăng nhập để xem đơn hàng</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <Loading />
  }

  if (orders.length === 0) {
    return (
      <div className='w-full min-h-80 flex justify-center items-center'>
        <div className='flex flex-col items-center'>
          <div className='text-2xl font-medium'>Không có đơn hàng nào</div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col gap-10 my-10'>
      <div className='w-full flex justify-center'>
        <div className='flex flex-col justify-center items-center'>
          <div className='text-4xl mb-5'>Danh sách sản phẩm</div>
        </div>
      </div>

      <div className='w-full flex justify-center'>
        <div className='flex gap-4'>
          <button
            className={`px-4 py-2 ${activeTab === 'all' ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'pending' ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Chờ xác nhận
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'shipping' ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Đang vận chuyển
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'completed' ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Đã hoàn thành
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'canceled' ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('canceled')}
          >
            Đã hủy
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className='w-full flex justify-center'>
        <div className='flex flex-col gap-4 w-full max-w-4xl'>
          {filteredOrders.map((order) => (
            <div className='w-full justify-center flex'>
              <div key={order.id} className='border p-4 flex flex-col gap-3 w-full max-w-2xl rounded-xl'>
                <div className='w-full flex justify-between'>
                  <div style={{ flex: '4' }}>
                    <strong>Mã đơn hàng:</strong> {order.id.slice(0, 8)}
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <div onClick={() => handleViews(order.id)} className='cursor-pointer flex-1 flex text-sm font-bold items-center justify-end'>
                        Xem chi tiết <Eye className='ml-2' size={20} />
                      </div>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Chi tiết đơn hàng</SheetTitle>
                        <SheetDescription>
                          <div className='flex flex-col mt-10 gap-2'>
                            <div className='text-lg'>
                              <span className='font-bold'>Tên:</span> {order.nameUser}
                            </div>
                            <div className='text-lg'>
                              <span className='font-bold'>Mã đơn hàng:</span> {order.id.slice(0,8)}
                            </div>
                            <div className='text-lg'>
                              <span className='font-bold'>Trạng thái:</span> {order.status}
                            </div>
                            <div className='text-lg'>
                              <span className='font-bold'>Tổng tiền:</span> {formatCurrency(order.totalPrice)}
                            </div>
                            <div className='text-lg mb-4'>
                              <span className='font-bold'>Sản phẩm:</span>
                            </div>
                            <div className='w-full flex flex-col gap-4 overflow-y-auto max-h-64'>
                              {products.map((product) => (
                                <Link to={`/productDetails/${product.productId}`}>
                                  <div
                                    key={product.productId}
                                    className='relative flex gap-4 justify-between items-center'
                                  >
                                    <div className='flex items-center gap-3'>
                                      <div className='w-16 h-16 bg-gray-200'>
                                        <img
                                          src={product.imageUrl}
                                          className='w-full h-full object-cover'
                                          alt={product.productName}
                                        />
                                      </div>
                                      <div>
                                        <div className='text-base'>{product.productName}</div>
                                        <div className='text-black'>{formatCurrency(product.price)}</div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </SheetDescription>
                      </SheetHeader>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button className='mt-10 text-left' type='submit'>
                            Xác nhận
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
                <div>
                  <strong>Tên người mua:</strong> {order.nameUser}
                </div>
                <div>
                  <strong>Trạng thái:</strong> {order.status}
                </div>
                <div className='w-full text-right'>
                  Tổng tiền: <span className='text-red-600 font-semibold'>{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
