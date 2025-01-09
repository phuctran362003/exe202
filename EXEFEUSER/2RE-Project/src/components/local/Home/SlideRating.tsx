import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules'
import RatingCard from '@/components/local/Home/RatingCard'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';


export default function SlideRating() {
  const Data = [
    {
      id: 1,
      image: 'https://i.pinimg.com/564x/b9/e0/e3/b9e0e30ac1ec95077b7e1d0abd250e5d.jpg',
      author: 'ABC',
      quote: 'I think this is so good',
      title: 'driver'
    },
    {
      id: 1,
      image: 'https://i.pinimg.com/564x/b9/e0/e3/b9e0e30ac1ec95077b7e1d0abd250e5d.jpg',
      author: 'ABC',
      quote: 'I think this is so good',
      title: 'driver'
    },
    {
      id: 1,
      image: 'https://i.pinimg.com/564x/b9/e0/e3/b9e0e30ac1ec95077b7e1d0abd250e5d.jpg',
      author: 'ABC',
      quote: 'I think this is so good',
      title: 'driver'
    },
    {
      id: 1,
      image: 'https://i.pinimg.com/564x/b9/e0/e3/b9e0e30ac1ec95077b7e1d0abd250e5d.jpg',
      author: 'ABC',
      quote: 'I think this is so good',
      title: 'driver'
    },
    {
      id: 1,
      image: 'https://i.pinimg.com/564x/b9/e0/e3/b9e0e30ac1ec95077b7e1d0abd250e5d.jpg',
      author: 'ABC',
      quote: 'I think this is so good',
      title: 'driver'
    },
    {
      id: 1,
      image: 'https://i.pinimg.com/564x/b9/e0/e3/b9e0e30ac1ec95077b7e1d0abd250e5d.jpg',
      author: 'ABC',
      quote: 'I think this is so good',
      title: 'driver'
    },
    {
      id: 1,
      image: 'https://i.pinimg.com/564x/b9/e0/e3/b9e0e30ac1ec95077b7e1d0abd250e5d.jpg',
      author: 'ABC',
      quote: 'I think this is so good',
      title: 'driver'
    }
  ]
  return (
    <div className='w-full relative flex justify-center'>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={2}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows:true,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        spaceBetween={16}
        scrollbar={{ draggable: true }}
        className='mySwiper flex justify-center items-center p-4'
      >
        {Data.map((item, index) => (
          <SwiperSlide key={index}>
            <RatingCard data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
