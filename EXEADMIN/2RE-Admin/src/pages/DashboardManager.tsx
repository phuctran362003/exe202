/** @format */

import PageTitle from '@/components/global/PageTitle'
// import Image from "next/image";
import Card, { CardContent } from '@/components/global/Card'
import { Bus, Ticket, Route, HandCoins, Coins, FileStack, Package, Star } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import Loading from '@/components/Loading/Loading'
import { formatPrice } from '@/lib/utils'
import BarChartManager from '@/components/global/BarChart'
import { useEffect, useState } from 'react'
import { Dashboard } from '@/types'
import REAPI from '@/lib/2REAPI'
// import PopularTripCard from '../organisms/PopularTripCard'

export default function DashboardManager() {
  const { user } = useAuth()
  const [data, setData] = useState<Dashboard>()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchDashboardData = async () => {
    setIsLoading(true)
      try {
        const response = await REAPI(`/dashboard/shop/${user?.userId}`)
        const data = await response.data
        setData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if(user) fetchDashboardData()
  }, [user])

  if (isLoading) return <Loading />
  return (
    <div className='flex flex-col gap-5 w-full'>
      <PageTitle title='Dashboard' />
      <section className='grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
        <Card
          key={1}
          amount={data ? formatPrice(data.revenueThisMonth) : '0'}
          discription=''
          icon={Coins}
          label='Doanh thu tháng này'
        />
        <Card
          key={2}
          amount={data ? data.totalOrders.toString() : '0'}
          discription=''
          icon={FileStack}
          label='Tổng số đơn hàng'
        />
        <Card
          key={3}
          amount={data ? data.totalProducts.toString() : '0'}
          discription=''
          icon={Package}
          label='Tổng số sản phẩm'
        />
        <Card
          key={4}
          amount={data ? data.totalRatings.toString() : '0'}
          discription=''
          icon={Star}
          label='Số lượt đánh giá'
        />
      </section>
      <section className='grid grid-cols-1  gap-4 transition-all'>
        <CardContent className='bg-white'>
          <p className='mb-4 font-semibold text-xl text-primary'>Tổng doanh thu trong năm</p>

          <BarChartManager data={data?.monthlyRevenue} />
        </CardContent>
        {/* <CardContent className='flex justify-start gap-4'>
          <section>
            <p className='text-lg font-semibold text-primary'>Những tuyến đường phổ biến</p>
          </section>
          {data?.PopularRoutes.map((d, i) => (
            <PopularTripCard data={d} key={i}/>
          ))}
        </CardContent> */}
      </section>
    </div>
  )
}
