import { Button } from '@/components/ui/button'
import { useCartContext } from '@/contexts/CartContext'
import { formatCurrency } from '@/lib/utils'
import { Product } from '@/types'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import ShoppingCartPlus from '@/assets/shopping_cart_plus.svg'

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCartContext()
  // const calNewPrice = (price: number, sale: number) => {
  //   return price - (price * sale) / 100
  // }
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    addToCart(product.productId.toString())
    toast.success('Thêm sản phẩm vào giỏ hàng thành công!')
  }
  return (
    <Link key={product.productId} to={`/productDetails/` + product.productId}>
      <div className='rounded-lg group w-64 h-full flex flex-col gap-3 items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-md'>
        <div className='w-full h-80 rounded-lg overflow-hidden relative'>
          <img className='w-full h-full object-cover' src={product.imgUrl} alt={product.name} />
          <Button
            onClick={handleAddToCart}
            className='absolute top-3 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            variant='outline'
            size='icon'
          >
            <img src={ShoppingCartPlus} alt='Add to cart' className='w-6 h-6' />
          </Button>
        </div>

        <div className='w-full px-3 flex flex-col gap-y-2'>
          <div className='flex gap-1 w-full justify-start truncate'>
            <div className='font-bold truncate'>{product.name}</div>
            <div className='font-bold'>({product.size})</div>
          </div>
          <div className='flex gap-1 w-full justify-start text-gray-500'>Thương hiệu: {product.brand}</div>
          <div className='flex gap-1 w-full justify-start  text-gray-500'>Tình trạng: {product.condition}%</div>
          <div className='flex gap-2 items-center w-full justify-start'>
            {product.sale && product.sale > 0 ? (
              <div className='font-semibold'>
                <span className='text-sm'></span>
                {formatCurrency(product.price)}
              </div>
            ) : (
              <div className='font-medium'>
                <span className='text-sm'></span>
                {formatCurrency(product.price)}
              </div>
            )}
            {product.sale > 0 && (
              <div className='line-through text-gray-500 opacity-70 text-xs'>{formatCurrency(product.sale)}</div>
            )}
          </div>
        </div>
        <div className='flex items-center justify-end w-full gap-3'>
          {/* <Button className='flex-1' variant='outline'>
            So sánh
          </Button> */}
          {/* <Button className='' onClick={handleAddToCart}>
            Thêm vào giỏ <PackagePlus className='ml-2' size={20} />
          </Button> */}
        </div>
      </div>
    </Link>
  )
}
