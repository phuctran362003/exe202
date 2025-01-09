// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import './style.css'

// import required modules
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules'

export default function SlideShow() {
  return (
    <>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        }}
        pagination={{
          el: '.swiper-pagination',
          clickable: true
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className='mySwiper'
      >
        <SwiperSlide>
          <img src='https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/473812xIE/bunnysbar-891426.jpg' />
        </SwiperSlide>
        <SwiperSlide>
          <img src='https://toplist.vn/images/800px/2hand-nha-nhun-1108930.jpg' />
        </SwiperSlide>
        <SwiperSlide>
          <img src='https://hangthungnguyenkiencaocap.com/wp-content/uploads/2020/04/9.jpg' />
        </SwiperSlide>
        <SwiperSlide>
          <img src='https://toplist.vn/images/800px/ghuzvintage-1253191.jpg' />
        </SwiperSlide>
        <SwiperSlide>
          <img src='https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/473802jJM/owly-1067925.jpg' />
        </SwiperSlide>

        <div className='w-full flex justify-center'>
          <div className='swiper-pagination'></div>
        </div>
      </Swiper>
    </>
  )
}
