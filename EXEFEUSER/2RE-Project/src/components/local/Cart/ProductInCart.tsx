import Container from '@/components/global/Container'
import Loading from '@/components/global/Loading/Loading'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCartContext } from '@/contexts/CartContext'
import REAPI from '@/lib/2REAPI'

import { formatCurrency, formatProductType } from '@/lib/utils'
import { Product } from '@/types'

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function ProductInCart() {
  const { cart, setCart, removeFromCart } = useCartContext()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const navigate = useNavigate()
  useEffect(() => {
    const fetchedProducts = async () => {
      try {
        setIsLoading(true)
        let paramsId = ''
        cart.forEach((productId) => {
          if(paramsId !== '') {
            paramsId += '&'
          }
          paramsId += `listId=${productId}`
        })
        const response = await REAPI.get(`/product/list?${paramsId}`)
        const data = await response.data
        setProducts(data)
        data.filter((product: Product) => {
          if (product.status.toLowerCase() !== 'có sẵn') {
            removeFromCart(product.productId.toString());
            return false;
          }
          return true;
        });
      } catch (error) {
        console.error('Fetching products failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if(cart.length > 0) {
      fetchedProducts()
    }
  }, [cart])

  const handleCheckboxChange = (productId: string) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId) ? prevSelected.filter((id) => id !== productId) : [...prevSelected, productId]
    )
  }

  const handleViewDetail = (productId: string) => {
    navigate(`/productDetails/` + productId)
  }

  const handleDeleteSelected = () => {
    const updatedCart = cart.filter((productId) => !selectedProducts.includes(productId))
    setCart(updatedCart)
    setSelectedProducts([])
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map((product) => product.productId.toString()))
    }
  }
  const selectedProductDetails = products.filter((product) => selectedProducts.includes(product.productId.toString()))

  if(isLoading) {
    return <Loading />
  }

  return (
    <Container>
      {cart.length === 0 ? (
        <div className='flex w-full justify-center'>
          <div>
            Giỏ hàng của bạn rỗng.{' '}
          </div>
        </div>
      ) : isLoading ? (
        <div>Loading</div>
      ) : products ? (
        <div className='flex flex-col gap-8'>
          <Table className='table-fixed'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-12'>
                  <Checkbox
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className='w-24 font-bold text-center'>Hình ảnh</TableHead>
                <TableHead className='w-64 font-bold'>Tên sản phẩm</TableHead>
                <TableHead className='w-60 font-bold'>Tên cửa hàng</TableHead>
                <TableHead className='w-24 font-bold text-center'>Kích cỡ</TableHead>
                <TableHead className='w-24 font-bold text-center'>Tình trạng</TableHead>
                <TableHead className='w-32 font-bold text-center'>Giá</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell className='w-12' onClick={() => handleCheckboxChange(product.productId.toString())}>
                    <Checkbox checked={selectedProducts.includes(product.productId.toString())} />
                  </TableCell>
                  <TableCell className='w-24 h-36'>
                    <img src={product.imgUrl} className='object-cover w-full h-full' />
                  </TableCell>
                  <TableCell className='w-64 cursor-pointer' onClick={() => handleViewDetail(product.productId.toString())}>
                    {product.name}{' '}
                    {/* {product.sale > 0 && <Badge className='bg-red-500 hover:bg-red-600 px-1'>-{product.sale}%</Badge>} */}
                  </TableCell>
                  <TableCell className='w-60'>{formatProductType(product.shopOwner)}</TableCell>
                  <TableCell className='w-24 text-center'>{product.size}</TableCell>
                  <TableCell className='w-24 text-center'>{product.condition}</TableCell>
                  <TableCell className='w-32 text-center'>
                    {formatCurrency(product.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className='bg-teriary'>
                <TableCell colSpan={6} className='font-bold py-4'>
                  Tổng số tiền
                </TableCell>
                <TableCell className='font-bold text-center'>
                  {formatCurrency(
                    products.reduce(
                      (total, product) => total + (product.price),
                      0
                    )
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div className='flex justify-between'>
            <AlertDialog>
              <AlertDialogTrigger disabled={selectedProductDetails.length === 0}>
                <Button variant='destructive' disabled={selectedProducts.length === 0}>
                  Xóa {selectedProducts.length} được chọn
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc chắn xóa?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn xóa {selectedProducts.length} ra khỏi giỏ hàng không? Hành động sẽ không được hoàn lại sau khi thực hiện.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction className='bg-red-500 hover:bg-red-600' onClick={handleDeleteSelected}>
                    Tiếp tục xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button disabled={selectedProducts.length === 0}>
              <Link to='/checkout' state={{ selectedProducts: selectedProductDetails }}>
                Thanh toán {selectedProducts.length} sản phẩm
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div>Không tìm thấy sản phẩm</div>
      )}
    </Container>
  )
}
