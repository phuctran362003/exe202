import Container from '@/components/global/Container'
import Logo from '@/assets/Logo.png'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Search, ShoppingCart } from 'lucide-react'
import { useCartContext } from '@/contexts/CartContext'
import { Link } from 'react-router-dom'
import ProfileButton from '@/components/local/Profile/ProfileButton'

export default function SearchPage() {
  const { quantityInCart } = useCartContext()
  return (
    <header className='w-full mt-5'>
      <Container>
        <div className='flex w-full h-20 justify-between items-end'>
          <div className=''>
            <Link to='/'>
              <img src={Logo} className='w-24 h-24' />
            </Link>
          </div>
          <div className='flex-1 flex justify-center mb-2 px-10'>
            <input 
                type='text'
                placeholder='Search...'
                className='w-full h-10 px-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-blue-300'
            />
          </div>
          <div className=' flex gap-4 mb-2 justify-end'>
            <Button variant='outline' size='icon' className='relative shrink-0'>
              <Link to='/cart'>
                <ShoppingCart className='h-6 w-6' />
                {!!quantityInCart && (
                  <div className='bg-red-500 text-slate-50 absolute rounded-full w-4 h-4 text-xs flex justify-center items-center -top-1.5 -right-1.5'>
                    {quantityInCart}
                  </div>
                )}
              </Link>
            </Button>
            <ProfileButton className='shrink-0' />
          </div>
        </div>
      </Container>
    </header>
  )
}
