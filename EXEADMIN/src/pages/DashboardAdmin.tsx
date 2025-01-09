/** @format */

import PageTitle from '@/components/global/PageTitle'
// import Image from "next/image";
import Card, { CardContent } from '@/components/global/Card'
import { Store, User, Package } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import Loading from '@/components/Loading/Loading'
import BarChartManager from '@/components/global/BarChart'
import { useEffect, useState } from 'react'
import { IDashboardAdmin } from '@/types'
import REAPI from '@/lib/2REAPI'


export default function DashboardAdmin() {
  const { user } = useAuth()
  const [data, setData] = useState<IDashboardAdmin>()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchDashboardData = async () => {
    setIsLoading(true)
      try {
        const response = await REAPI('/dashboard/admin')
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
    <div className='flex flex-col gap-5  w-full'>
      <PageTitle title='Dashboard' />
      <section className='grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
        <Card
          key={1}
          amount={data ? data.totalOrdersThisMonth.toString() : '0'}
          discription=''
          icon={Package}
          label='Số đơn hàng trong tháng'
        />
        <Card
          key={2}
          amount={data ? data.totalUsers.toString() : '0'}
          discription=''
          icon={User}
          label='Tổng số người dùng'
        />
        <Card
          key={3}
          amount={data ? data.totalShops.toString() : '0'}
          discription=''
          icon={Store}
          label='Tổng số cửa hàng'
        />
        {/* <Card
          key={4}
          amount={data ? data.totalRatings.toString() : '0'}
          discription=''
          icon={HandCoins}
          label='Số lượt đánh giá'
        /> */}
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
