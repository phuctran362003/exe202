import Loading from '@/components/Loading/Loading'
import { useAuth } from '@/auth/AuthContext'
import REAPI from '@/lib/2REAPI'
import { formatCurrency } from '@/lib/utils'
import { OrderUser } from '@/types'
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
import { Link, useParams } from 'react-router-dom'

export default function OrderOfUser() {
  const [orders, setOrders] = useState<OrderUser[]>([])
  const { id } = useParams()
  const [filteredOrders, setFilteredOrders] = useState<OrderUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
        const response = await REAPI.get(`/user/${id}`)
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
    if (id) {
      fetchOrders()
    }
  }, [id])

  useEffect(() => {
    switch (activeTab) {
      case 'pending':
        setFilteredOrders(orders.filter((order) => order.status === 'CHƯA THANH TOÁN'))
        break
      case 'shipping':
        setFilteredOrders(orders.filter((order) => order.status === 'ĐANG VẬN CHUYỂN'))
        break
      case 'completed':
        setFilteredOrders(orders.filter((order) => order.status === 'ĐÃ HOÀN THÀNH'))
        break
      case 'canceled':
        setFilteredOrders(orders.filter((order) => order.status === 'ĐÃ HỦY'))
        break
      default:
        setFilteredOrders(orders)
    }
  }, [activeTab, orders])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
  }

  if (!user) {
    return (
      <div className='w-screen min-h-80 flex justify-center items-center'>
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
      <div className='w-screen min-h-80 flex justify-center items-center'>
        <div className='flex flex-col items-center'>
          <div className='text-2xl font-medium'>Không có đơn hàng nào</div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col gap-10 my-10 text-primary'>
      <div className='w-full flex justify-center'>
        <div className='flex flex-col justify-center items-center'>
          <div className='text-4xl mb-5'>Danh sách đơn hàng</div>
        </div>
      </div>

      <div className='w-full flex justify-center'>
        <div className='flex gap-4'>
          <button
            className={`px-4 py-2 ${activeTab === 'all' ? 'font-bold border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'pending' ? 'font-bold border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Chưa thanh toán
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'shipping' ? 'font-bold border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Đang vận chuyển
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'completed' ? 'font-bold border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Đã hoàn thành
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'canceled' ? 'font-bold border-b-2 border-primary' : ''}`}
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
              <div key={order.orderId} className='bg-white border p-4 flex flex-col gap-3 w-full max-w-2xl rounded-xl'>
                <div className='w-full flex justify-between'>
                  <div style={{ flex: '4' }}>
                    <strong>Sản phẩm:</strong>{' '}
                    {order.listProducts.map((product, index) => (index === 0 ? product.name : ', ' + product.name))}
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <div className='cursor-pointer flex-1 flex text-sm font-bold items-center justify-end'>
                        Xem chi tiết <Eye className='ml-2' size={20} />
                      </div>
                    </SheetTrigger>
                    <SheetContent className='text-primary'>
                      <SheetHeader>
                        <SheetTitle className='text-primary'>Chi tiết đơn hàng</SheetTitle>
                        <SheetDescription>
                          <div className='flex flex-col mt-10 gap-2 text-primary'>
                            <div className='text-lg'>
                              <span className='font-bold'>Tên:</span> {order.fullName}
                            </div>
                            <div className='text-lg'>
                              <span className='font-bold'>Số điện thoại:</span> {order.phone}
                            </div>
                            <div className='text-lg'>
                              <span className='font-bold'>Email:</span> {order.email}
                            </div>
                            <div className='text-lg'>
                              <span className='font-bold'>Địa chỉ:</span> {order.address}
                            </div>
                            <div className='text-lg'>
                              <span className='font-bold'>Ngày:</span> {formatDate(order.dateTime)}
                            </div>
                            <div className='text-lg text-red-500'>
                              <span className='font-bold text-primary'>Tổng tiền:</span> {formatCurrency(order.totalPrice)}
                            </div>
                            <div className='text-lg mb-4'>
                              <span className='font-bold'>Sản phẩm:</span>
                            </div>
                            <div className='w-full flex flex-col gap-4 overflow-y-auto max-h-64'>
                              {order.listProducts.map((product) => (
                                <Link to={`/productDetail/${product.productId}`}>
                                  <div
                                    key={product.productId}
                                    className='relative flex gap-4 justify-between items-center'
                                  >
                                    <div className='flex items-center gap-3'>
                                      <div className='w-16 h-16 bg-gray-200'>
                                        <img
                                          src={product.imageUrl}
                                          className='w-full h-full object-cover'
                                          alt={product.name}
                                        />
                                      </div>
                                      <div>
                                        <div className='text-base'>{product.name}</div>
                                        <div className='text-sm text-gray-500'>{product.size}</div>
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
                  <strong>Ngày:</strong> {formatDate(order.dateTime)}
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
