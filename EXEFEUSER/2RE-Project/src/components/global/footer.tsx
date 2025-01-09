import { Facebook, Instagram, PhoneCall } from 'lucide-react'
import { Button } from '../ui/button'
import Container from './Container'
import Tiktok from '@/assets/tiktok.svg'

export default function Footer() {
  return (
    <footer className='border border-gray-100 bg-teriary'>
      <Container>
        <div className='w-full h-full pt-5'>
          <div className='flex mt-6 gap-14 justify-between'>
            <div className='flex flex-col items-center flex-1 gap-1'>
              {/* <div className='text-2xl font-bold text-primary'>Customer Support</div> */}
              <div className='flex gap-4 mt-10'>
                <a
                  href='https://www.facebook.com/profile.php?id=61566434150339'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button variant='ghost' size='icon'>
                    <Facebook />
                  </Button>
                </a>
                <a
                  href='https://www.tiktok.com/@2re.secondhand/photo/7420700600964304146?_d=secCgYIASAHKAESPgo8QY6yaVfL5AwMqMK6g1ka90CBkRPQAsvzuEpOd5667y48zPSpLTijpBeV1soJ%2BuymxkxP3pTtTrEcctuHGgA%3D&_r=1&checksum=fc1cc8e75b7044a9a83d44f9c77a6c3ffb3638a9af6d2139d2a14140559d2262&link_reflow_popup_iteration_sharer=%7B%7D&mid=7326058243132836609&preview_pb=0&region=VN&sec_user_id=MS4wLjABAAAAYVwui5F2ngpiH6Wab1HfMUfabCjSA_tGrQGRrWXzu1Hyp5W-cmE2DQZBLoQ3zf5U&share_app_id=1180&share_item_id=7420700600964304146&share_link_id=481814AE-D708-4204-BCE3-87EDD72CCB4F&sharer_language=vi&social_share_type=14&source=h5_t&timestamp=1727766542&tt_from=messenger&u_code=egbklkii55clm2&ug_btm=b5171%2Cb2001&ug_photo_idx=0&user_id=7418491949995033607&utm_campaign=client_share&utm_medium=ios&utm_source=messenger'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button variant='ghost' size='icon'>
                    <img src={Tiktok} alt='tik tok' className='h-6 w-6'/>
                  </Button>
                </a>
                <a
                  href='https://www.instagram.com/2resecondhand/'
                  target='_blank'
                  rel='noopener noreferrer'
                >  
                <Button variant='ghost' size='icon'>
                  <Instagram />
                </Button>
                </a>
                <Button variant='ghost' size='icon'>
                  <PhoneCall />
                </Button>
              </div>
            </div>

            <div className='flex flex-col items-center flex-1 gap-1'>
              {/* <div className='text-2xl font-bold text-primary'>Contact information</div> */}
              <div className='flex flex-col items-start gap-4 mt-2'>
                <div className='text-xs sm:text-base'>
                  <strong>Hỗ trợ</strong>
                </div>
                <div className='text-xs sm:text-base'>Giao hàng & Thanh toán</div>
                <div className='text-xs sm:text-base'>Trợ giúp & Hỗ trợ</div>
                <div className='text-xs sm:text-base'>Dịch vụ 24/7</div>
              </div>
            </div>

            <div className='flex flex-col items-center flex-1 gap-1'>
              {/* <div className='text-2xl font-bold text-primary'>Contact information</div> */}
              <div className='flex flex-col items-start gap-4 mt-2'>
                <div className='text-xs sm:text-base'>
                  <strong>Thông tin</strong>
                </div>
                <div className='text-xs sm:text-base'>+8496 416 0769</div>
                <div className='text-xs sm:text-base'>2re2hand@gmail.com</div>
                <div className='text-xs sm:text-base'>
                  <a href='/'>https://2re-secondhand.vercel.app/</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className='flex justify-center items-center text-base h-10 mt-10'>© Bản quyền 2024. Bảo lưu mọi quyền.</div>
    </footer>
  )
}
