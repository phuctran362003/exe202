import { useAuth } from '@/auth/AuthContext'
import Loading from '@/components/Loading/Loading'
import { Button } from '@/components/ui/button'
import REAPI from '@/lib/2REAPI'
import { formatPrice } from '@/lib/utils'
import { ShopDetail } from '@/types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

interface Transaction {
  transactionId: string
  shopBankId: string
  shopBank: string
  month: number
  year: number
  totalMoney: number
  status: string
}

interface BankingData {
    bankId: string
    bankName: string
}

export default function Transaction() {
  const { id } = useParams()
  const [transaction, setTransaction] = useState<Transaction[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [bankingdata, setBankingData] = useState<BankingData | null>(null)
  const [shopData , setShopData] = useState<ShopDetail | null>(null)
  const { user } = useAuth()
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true)
        const endpoint = id ? `/shop/${id}` : `/shop/${user?.userId}`
        const endpointDetail = id ? `/detail/${id}` : `/detail/${user?.userId}`
        const response = await REAPI.get(endpointDetail)
        setShopData(response.data)
        const res = await REAPI.get(endpoint)
        const data = res.data
        setTransaction(data)
        let value = {
            bankId: '',
            bankName: ''
        }
        if(res.data.length > 0){
            value.bankId = data[0].shopBankId
            value.bankName = data[0].shopBank
        }
        data.map((item: Transaction) => {
            if(item.shopBank !== value.bankName){
                value.bankName = item.shopBank
            }
            if(item.shopBankId !== value.bankId){
                value.bankId = item.shopBankId
            }
        })
        setBankingData(value)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    if (id || user) {
      fetchTransaction()
    }
  }, [id, user])

  const handlePaymentStatus = async(status: string, id: string) => {
    if(status.toLowerCase() === 'chưa thanh toán'){
        try {
            const response = await REAPI.put(`/status?transactionId=${id}&status=${status}`)
            console.log(response.data)
            toast.success('Thanh toán thành công')
        } catch(error) {
            console.log(error)
        }
    } else {
        return <Button>Đã thanh toán</Button>
    }
  }

  function handleAppearButton(items: {
    month: number
    year: number
    status: string
    id: string
  }) {
    if(items.status.toLowerCase() !== 'chưa thanh toán'){
        return
    }
    if(items.status.toLowerCase() === 'admin đã thanh toán'){
        if(user?.RoleName === 'Admin'){
            return
        } else {
            return <Button onClick={() => handlePaymentStatus('HOÀN THÀNH', items.id)}>Đã thanh toán</Button>
        }
    }
    const date = new Date()
    if(items.year < date.getFullYear()){
        return <Button onClick={() => handlePaymentStatus('ADMIN ĐÃ THANH TOÁN', items.id)}>Xác nhận thanh toán</Button>
    } else {
        if(items.month < date.getMonth()){
            return <Button>Xác nhận thanh toán</Button>
        } else {
            return
        }
    }
  }

  if (loading) {
    return <Loading />
  }
  return <div className='w-full h-full flex justify-center text-primary'>
    <div className='relative w-full max-w-7xl flex flex-col gap-y-10 items-center'>
        <div className='text-4xl font-bold'>
            Tổng kết giao dịch
        </div>
        <div className='text-4xl font-bold'>
            {shopData?.shopName}
        </div>
        <div>
            <div className='text-lg'>Ngân hàng: <strong>{bankingdata?.bankName}</strong></div>
            <div className='text-lg'>Số tài khoản: <strong>{bankingdata?.bankId}</strong></div>
        </div>
        <div className='w-full grid grid-cols-3 gap-10 px-10 mt-10'>
            {(transaction && transaction?.length > 0) ? transaction.map((item: Transaction) => (
                <div key={item.transactionId} className=' border-gray-300 p-4 rounded-xl shadow-lg'>
                    <div className='text-lg'>
                        Tháng: <strong>{item.month}/{item.year}</strong>
                    </div>
                    <div className='text-lg'>
                        Tổng doanh thu: <strong>{formatPrice(item.totalMoney)}</strong>
                    </div>
                    <div className='text-lg'>
                        Phí giao dịch: <strong>10%</strong>
                    </div>
                    <div className='text-lg'>
                        Tổng tiền nhận: <strong>{formatPrice(item.totalMoney * 0.9)}</strong>
                    </div>
                    <div className='text-lg'>
                        Trạng thái: <strong>{item.status}</strong>
                    </div>
                    <div className='flex justify-end mt-5'>
                        {handleAppearButton({month: item.month, year: item.year, status: item.status, id: item.transactionId})}
                    </div>
                </div>
            )) : <div>Không có dữ liệu</div>}
            
        </div>
    </div>
  </div>
}
