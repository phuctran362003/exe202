import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Frame from '../assets/frame.png'
function PaymentSuccess() {
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    scrollToTop()
  }, [])
  return (
    <div className='w-screen flex justify-center items-center mb-8'>
      <div className='flex flex-col items-center'>
        <div className='flex items-center gap-x-10'>
        <img src='https://i.pinimg.com/564x/35/cc/c9/35ccc963f1e758a6c7b1136ba883e6fc.jpg' className='my-10 w-[300px] h-[300px]' />
        <img src={Frame} className='my-10 w-[300px] h-[350px]' />
        </div>
        <div className='text-2xl font-medium'>Thanh toán thành công</div>
        <div className='text-xl mt-4'>Bạn hãy quét mã QR và để lại đánh giá mua hàng để giúp 2RE ngày càng phát triển hơn nha!!</div>
        <p className='text-lg mt-4'>
          Cảm ơn vì đã tin tưởng <span className='text-primary font-medium'>2RE Secondhand Fashion</span>
        </p>

        <Link to='/orders' className='underline hover:text-primary font-medium text-xl mt-8'>
          Quay lại đơn hàng của bạn
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess
