import { Product } from '@/types'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

function ProductCard(props: Product) {
  return (
    <Card className='flex flex-col justify-center items-start p-4 shadow-md border-none transition-transform duration-300 hover:shadow-lg hover:-translate-y-2'>
      <div className='w-64 h-44 overflow-hidden rounded-md'>
        <img
          className='w-full h-full object-cover transition-transform duration-300 hover:scale-110'
          src={props.imgUrl}
          alt={props.name}
        />
      </div>
      <div className='flex gap-1 w-full'>
        <div className='truncate font-semibold mt-2 text-[#484848] transition-colors duration-300 hover:text-black max-w-full'>
          {props.name}
        </div>
        <div className='font-semibold mt-2 text-[#484848] transition-colors duration-300 hover:text-black'>
          ({props.size})
        </div>
      </div>
      <p className='mt-3 text-xs text-[#484848]'>Tình trạng {props.condition}%</p>
      <div className='flex gap-2 w-full items-center'>
        <p className='mt-3 text-md font-semibold text-[#484848] transition-colors duration-300 hover:text-black'>
          {formatCurrency(props.price)}
        </p>
        <p className='mt-3 line-through text-sm font-extralight text-[#484848] transition-colors duration-300 hover:text-black'>
          {formatCurrency(props.sale)}
        </p>
      </div>
    </Card>
  )
}

export default ProductCard
