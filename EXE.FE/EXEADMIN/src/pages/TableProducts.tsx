import { useAuth } from '@/auth/AuthContext'
import PageTitle from '@/components/global/PageTitle'
import Loading from '@/components/Loading/Loading'
import { DataTable } from '@/components/local/products/data-table'
import { columns } from '@/components/local/products/column'
import REAPI from '@/lib/2REAPI'
import { Product } from '@/types'
import { useEffect, useState } from 'react'
import { DataRefreshContext } from '@/contexts/DataRefeshContext'

const defaultValue: Product[] = [
  {
    productId: '',
    name: '',
    price: 0,
    imgUrl: '',
    size: '',
    category: '',
    condition: '',
    genderCategory: '',
    brand: '',
    status: '',
    shopOwner: '',
    sale: 0,
  }
]

export default function TableProducts() {
  const [Data, setData] = useState<Product[]>(defaultValue)
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await REAPI.get(`/product/product-from-shop/${user?.userId}`)
      const data = await response.data
      setData(data)
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
        <PageTitle title='Danh sách sản phẩm' />
        <DataTable columns={columns} data={Data} loading={isLoading}/>
      </div>
    </DataRefreshContext.Provider>
  )
}
