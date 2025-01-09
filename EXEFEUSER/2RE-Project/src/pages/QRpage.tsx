import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"

export default function QRpage() {
  const location = useLocation()
  const dataimg = location.state.qrCode
  return (
    <div className='w-full flex flex-col gap-10 my-10'>
      <div className='w-full flex justify-center'>
        <div className='flex w-full mx-20 justify-between items-center'>
          <div className="w-20"></div>
          <div className='text-4xl mb-5'>Quét mã QR để tiến hành thanh toán</div>
          <Link to='/payment-success'><Button>Xác nhận</Button></Link>
        </div>
      </div>
      <div className='w-full flex justify-center'>
        <div className='flex flex-col justify-center items-center'>
          <img src={dataimg} alt='QR Code' />
        </div>
      </div>
    </div>
  )
}
