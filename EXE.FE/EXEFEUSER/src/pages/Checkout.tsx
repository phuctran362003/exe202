import Container from '@/components/global/Container'
import CheckoutForm from '@/components/local/Checkout/CheckoutForm'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { formatCurrency } from '@/lib/utils'
import { Product } from '@/types'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Checkout() {
  const location = useLocation()
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(location.state?.selectedProducts || [])

  const handleRemoveSelectedProduct = (productId: string) => {
    const newSelectedProducts = selectedProducts.filter((product) => product.productId !== productId)
    setSelectedProducts(newSelectedProducts)
  }
  return (
    <div className='w-full justify-center py-5'>
      <Container>
        <div className='flex flex-col items-center gap-8'>
          <div className='text-4xl'>Thanh toán</div>
          <Breadcrumb className='text-sm'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/cart'>Giỏ hàng</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='font-bold'>Thanh toán</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='w-full flex '>
            <div className='flex-1'>
              <CheckoutForm products={selectedProducts}/>
            </div>
            <div className='flex-1'>
              <div className='flex flex-col gap-4 px-10'>
                <div className='flex flex-col gap-4 mt-10'>
                  {selectedProducts.map((product: Product) => (
                    <div key={product.productId} className='relative flex gap-4 justify-between items-center'>
                      <div className='flex items-center gap-3'>
                        <div className='w-16 h-16 bg-gray-200'>
                          <img src={product.imgUrl} className='w-full h-full object-cover' alt={product.name} />
                        </div>
                        <div>
                          <div className='text-base font-bold'>{product.name}</div>
                          <div className='text-sm text-gray-500'>{product.size}</div>
                          <div className='text-base'>{product.shopOwner}</div>
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <div>{formatCurrency(product.price)}</div>
                      </div>
                      {selectedProducts.length > 1 && (<div onClick={() => handleRemoveSelectedProduct(product.productId)} className='absolute -right-2 -top-2 cursor-pointer'>x</div>)}
                    </div>
                  ))}
                  <hr></hr>
                  <div className='w-full flex justify-between'>
                    <div className='font-semibold'>Tổng cộng</div>
                    <div className='font-semibold'>
                      {formatCurrency(
                        selectedProducts.reduce(
                          (total, items) => total + (items.price),
                          0
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
