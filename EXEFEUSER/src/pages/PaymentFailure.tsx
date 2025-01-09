import { Link } from 'react-router-dom'
import { useEffect } from 'react'
function PaymentFailure() {
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
        <img src='https://t3.ftcdn.net/jpg/05/83/87/88/360_F_583878822_TPd9eveUc0hVuAXeB9IKPn68gPIfQ3Js.jpg' className='my-10 w-[350px] h-[300px]' />
        <div className='text-2xl font-medium'>Thanh toán thất bại</div>
        <div className='text-xl mt-4'>Vui lòng kiểm tra lại thông tin thanh toán và thử lại!!!</div>
        <p className='text-lg mt-4'>
          Nếu gặp lỗi không thể khắc phục, vui lòng liên hệ <span className='text-primary font-medium'>2RE Secondhand Fashion</span> để nhận được sự hỗ trợ
        </p>

        <Link to='/cart' className='underline hover:text-primary font-medium text-xl mt-8'>
          Quay lại giỏ hàng
        </Link>
      </div>
    </div>
  )
}

export default PaymentFailure
