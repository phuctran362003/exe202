import ProductInCart from "@/components/local/Cart/ProductInCart";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function CartPage() {
  return (
    <div className='w-full min-h-screen flex flex-col gap-20 py-10'>
      <div className='w-full flex justify-center'>
        <div className='flex flex-col justify-center items-center'>
          <div className='text-4xl mb-5 font-semibold'>Giỏ hàng mua sắm</div>
          <Breadcrumb className='text-sm'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/products'>Sản phẩm</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='font-bold'>Giỏ hàng</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className='w-full flex justify-center'>
        <ProductInCart />
      </div>
    </div>
  )
}
