import Loading from '@/components/Loading/Loading'
import { Button } from '@/components/ui/button'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import REAPI from '@/lib/2REAPI'
import { formatCurrency } from '@/lib/utils'
import { Order } from '@/types'
import { Row } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useDataRefresh } from '@/contexts/DataRefeshContext'
import { format } from 'date-fns'
import { useAuth } from '@/auth/AuthContext'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

interface Product {
  productId: string
  productName: string
  price: number
  imageUrl: string
}

export default function DataViewDetail({ row }: DataTableRowActionsProps<Order>) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newStatus, setNewStatus] = useState(row.getValue('status') as string)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const refeshData = useDataRefresh()
  const statuses = ['CHƯA THANH TOÁN', 'ĐANG VẬN CHUYỂN', 'ĐÃ HOÀN THÀNH', 'ĐÃ HỦY']
  const handleViews = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await REAPI.get(`/shop/detail-cart-from-shop/${id}`)
      const data = response.data
      setProducts(data)
      setIsLoading(false)
    } catch {
      console.log('Error fetching products')
    }
  }
  const handleStatusChange = async () => {
    setIsSubmitting(true)
    try {
      const response = await REAPI.put(`/status/${row.getValue('id')}?status=${newStatus}`)
      console.log('Status updated successfully:', response.data)
      toast.success('Cập nhật trạng thái đơn hàng thành công!')
      setTimeout(() => {
        refeshData()
      }, 1000)
    } catch (error) {
      console.log('Error updating status:', error)
      toast.error('Cập nhật trạng thái thất bại.')
    } finally {
      setIsSubmitting(false)
    }
  }
  const badgeColor = (status: string) => {
    switch (status) {
      case 'CHƯA THANH TOÁN':
        return <Badge className='bg-red-500 hover:bg-red-600'>CHƯA THANH TOÁN</Badge>
      case 'ĐANG VẬN CHUYỂN':
        return <Badge className='bg-blue-500 hover:bg-blue-600'>ĐANG VẬN CHUYỂN</Badge>
      case 'ĐÃ HOÀN THÀNH':
        return <Badge className='bg-green-500 hover:bg-green-600'>ĐÃ HOÀN THÀNH</Badge>
      default:
        return <Badge className='bg-gray-500 hover:bg-gray-600'>ĐÃ HỦY</Badge>
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          onClick={() => handleViews(row.getValue('id'))}
          className='cursor-pointer flex-1 flex text-sm font-bold items-center justify-end'
        >
          Xem chi tiết <Eye className='ml-2' size={20} />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className='text-primary'>Chi tiết đơn hàng</SheetTitle>
          <SheetDescription>
            <div className='flex flex-col mt-10 gap-2 text-primary'>
              <div className='text-lg'>
                <span className='font-bold'>Tên:</span> {row.getValue('nameUser')}
              </div>
              <div className='text-lg'>
                <span className='font-bold'>Mã đơn hàng:</span>{' '}
                {row.getValue('id') ? (row.getValue('id') as string)?.slice(0, 8) : ''}
              </div>
              <div className='text-lg flex items-center gap-5'>
                <span className='font-bold'>Trạng thái:</span>
                <Select disabled={user?.roleName !== 'User'} onValueChange={(value) => setNewStatus(value)} defaultValue={row.getValue('status')}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Theme' />
                  </SelectTrigger>
                  <SelectContent>
                    {row.getValue('paymentMethod') === 'QRPAY' ? statuses.filter((status) => status != 'CHƯA THANH TOÁN').map((status) => (
                      <SelectItem key={status} value={status}>
                        {badgeColor(status)}
                      </SelectItem>
                    )) : statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {badgeColor(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='text-lg text-red-500'>
                <span className='font-bold text-primary'>Tổng tiền:</span> {formatCurrency(row.getValue('totalPrice'))}
              </div>
              <div className='text-lg'>
                <span className='font-bold'>Phương thức thanh toán: </span>{row.getValue('paymentMethod')}
              </div>
              <div className='text-lg'>
                <span className='font-bold'>Ngày đặt: </span>{format(new Date(row.getValue('date') ? row.getValue('date') : new Date()), 'dd/MM/yyyy')}
              </div>
              <div className='text-lg mb-4'>
                <span className='font-bold'>Sản phẩm:</span>
              </div>
              <div className='w-full flex flex-col gap-4 overflow-y-auto max-h-64'>
                {isLoading ? (
                  <Loading />
                ) : (
                  products.map((product) => (
                    <Link to={`/productDetails/${product.productId}`}>
                      <div key={product.productId} className='relative flex gap-4 justify-between items-center'>
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
                  ))
                )}
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline' className='mt-10 text-left'>
              Đóng
            </Button>
          </SheetClose>
          {newStatus !== row.getValue('status') && (
            <Button className='mt-10 text-left' type='submit' onClick={handleStatusChange} disabled={isSubmitting}>
              {isSubmitting ? 'Đang cập nhật...' : 'Xác nhận thay đổi trạng thái'}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
