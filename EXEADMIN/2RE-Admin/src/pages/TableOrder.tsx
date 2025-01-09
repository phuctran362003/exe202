import { useAuth } from '@/auth/AuthContext'
import PageTitle from '@/components/global/PageTitle'
import Loading from '@/components/Loading/Loading'
import { DataTable } from '@/components/local/order/data-table'
import { columns } from '@/components/local/order/column'
import REAPI from '@/lib/2REAPI'
import { Order } from '@/types'
import { useEffect, useState } from 'react'
import { DataRefreshContext } from '@/contexts/DataRefeshContext'
import { useParams } from 'react-router-dom'

const defaultValue: Order[] = [
  {
    id: '',
    totalQuantity: 0,
    totalPrice: 0,
    nameUser: '',
    date: '',
    paymentMethod: '',
    status: ''
  }
]

export default function TableOrder() {
  const { id } = useParams()
  const [Data, setData] = useState<Order[]>(defaultValue)
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const endpoint = id ? `/product/order-from-shop/${id}` : `/product/order-from-shop/${user?.userId}`
      const response = await REAPI.get(endpoint)
      const data = await response.data
      setData(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }
  console.log(Data)
  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user, id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <DataRefreshContext.Provider value={fetchOrders}>
      <div className='flex flex-col gap-5 w-full'>
        <PageTitle title='Đơn hàng' />
        <DataTable columns={columns} data={Data} loading={isLoading}/>
      </div>
    </DataRefreshContext.Provider>
  )
}
