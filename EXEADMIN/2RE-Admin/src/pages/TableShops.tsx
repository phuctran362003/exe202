import { useAuth } from '@/auth/AuthContext'
import PageTitle from '@/components/global/PageTitle'
import Loading from '@/components/Loading/Loading'
import { DataTable } from '@/components/local/shops/data-table'
import { columns } from '@/components/local/shops/column'
import REAPI from '@/lib/2REAPI'
import { DataUser } from '@/types'
import { useEffect, useState } from 'react'
import { DataRefreshContext } from '@/contexts/DataRefeshContext'

const defaultValue: DataUser[] = [
  {
    userId: '',
    userName: '',
    passWord: '',
    email: '',
    address: '',
    phoneNumber: '',
    roleId: '',
    roleName: '',
    isShopOwner: false,
    shopName: '',
    shopAddress: '',
    shopDescription: '',
    shopLogo: '',
    createdAt: '',
    updatedAt: ''
  }
]

export default function TableShops() {
  const [Data, setData] = useState<DataUser[]>(defaultValue)
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await REAPI.get('/role/f47ac10b-58cc-4372-a567-0e02b2c3d479')
      const data = await response.data
      const newdata = data.filter((item: any) => item.isShopOwner === true)
      setData(newdata)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  if (isLoading) {
    return <Loading />
  }

  return (
    <DataRefreshContext.Provider value={fetchProducts}>
      <div className='flex flex-col gap-5 w-full'>
        <PageTitle title='Danh sách cửa hàng' />
        <DataTable columns={columns} data={Data} />
      </div>
    </DataRefreshContext.Provider>
  )
}
