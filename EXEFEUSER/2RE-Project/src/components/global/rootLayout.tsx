import Header from '@/components/global/header'
import Footer from '@/components/global/footer'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className='h-screen relative bg-teriary text-[#5E3023]'>
      <Header />
      <div className='min-h-[70%] pt-10 mt-24 bg-teriary'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
