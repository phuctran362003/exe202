import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Banner1 from '@/assets/banner1.jpg'
import Banner2 from '@/assets/banner2.jpg'
import Banner3 from '@/assets/bannerx.png'
import Banner4 from '@/assets/banner4.png'
import Brand from '@/assets/brands.png'
import Follow from '@/assets/follow.png'
import { Button } from '@/components/ui/button'
import SlideShow from '@/components/local/Home/SlideShow'
import CountdownTimer from '@/components/local/Home/Coutdown'
import Arrivals from '@/components/local/Home/Arrivals'
import Sub1 from '@/assets/sub1.png'
import Sub2 from '@/assets/sub2.png'
import Subscribe from '@/components/local/Home/Subscribe'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className='min-h-screen flex flex-col mx-auto bg-teriary'>
      <div className='w-full flex justify-center'>
        <div className='w-full gap-3 flex justify-between max-w-5xl'>
          <div className='w-1/3 bg-white h-full p-4 rounded-2xl'>
            <img src={Banner1} className='w-full h-full object-cover rounded-lg' alt='banner' />
          </div>
          <div className='w-1/3 max-h-full flex flex-col justify-center items-center'>
            <img src={Banner3} alt='banner' className=''/>
            <Link to='/products'>
              <Button className='mt-10 w-32 h-14 text-xl'>Mua ngay</Button>
            </Link>
            {/* <div className='relative w-full'>
              <img src={Banner4} alt='banner' className='w-full' />
              <div className='absolute bottom-0 w-full h-1/2 rounded-lg bg-[#E0E0E0] -z-50'></div>
            </div> */}
          </div>
          <div className='w-1/3 bg-white h-full p-4 rounded-2xl'>
            <img src={Banner2} className='w-full h-full object-cover rounded-lg' alt='banner' />
          </div>
        </div>
      </div>
      <div className='flex justify-center w-full'>
        <img src={Brand} alt='brand' className='w-full object-cover'/>
      </div>
      <div className='flex justify-center bg-teriary'>
        <div className='w-full max-w-5xl flex justify-between'>
          <div className='p-5 flex flex-col gap-14 '>
            <div>
              <h2 className='text-3xl font-bold '>Sản phẩm tuần này</h2>
              <p className='text-sm'>Số lượng có hạn</p>
            </div>
            <div>
              <Link to='/products?collection=DiscountDeals'>
                <Button>Mua ngay</Button>
              </Link>
            </div>
            <div>
              <h3 className='text-base font-bold'>Hãy nhanh lên, trước khi quá muộn!</h3>
              <CountdownTimer />
            </div>
          </div>
          <SlideShow />
        </div>
      </div>
      <div className='flex justify-center items-center w-full py-20'>
        <div className='flex flex-col items-center justify-center w-full max-w-5xl gap-10'>
          <div className='text-6xl font-semibold '>Hàng mới về</div>
          <div>
            <Arrivals />
          </div>
          <div>
            <Link to='/products?collection=NewArrivals'>
              <Button>Xem thêm</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col justify-center items-center gap-20 py-20 bg-teriary'>
        <div className='flex flex-col items-center gap-8'>
          <p className='text-4xl font-semibold '>Theo dõi chúng tôi trên Fanpage</p>
          <p className='text-sm'>
            Để không bỏ lỡ những ưu đãi mới nhất, sản phẩm mới và độc đáo với mức giá cực kỳ phải chăng.
          </p>
        </div>
        <img src={Follow} />
      </div>
      <div className='w-full flex justify-center'>
        <div className=' w-full max-w-6xl flex'>
          <img className='scale-75' src={Sub1} alt='subscrition' />
          <div className='flex flex-col justify-center'>
            <Subscribe />
          </div>
          <img className='scale-75' src={Sub2} alt='subscrition' />
        </div>
      </div>
    </div>
  )
}
