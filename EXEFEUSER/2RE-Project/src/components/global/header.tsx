import { useState } from 'react'
import Container from './Container'
import Logo from '@/assets/Logo.png'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu'
import { Button } from '../ui/button'
import { Search, ShoppingCart } from 'lucide-react' // Import cancel icon
import { useCartContext } from '@/contexts/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import ProfileButton from '../local/Profile/ProfileButton'

export default function Header() {
  const { quantityInCart } = useCartContext()
  const [isSearchMode, setIsSearchMode] = useState(false) // Manage search mode
  const [searchQuery, setSearchQuery] = useState('') // Store search input
  const navigate = useNavigate();
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/products?search=${searchQuery}`)
      setIsSearchMode(false)
    }
  }
  return (
    <header className='w-full pt-5 fixed top-0 left-0 z-40 bg-teriary'>
      <Container>
        <div className='flex w-full h-20 justify-between items-end'>
          <div className='flex-1'>
            <Link to='/'>
              <img src={Logo} className='w-24 h-24' />
            </Link>
          </div>
          <div className='flex justify-center' style={{ flex: '2.5' }}>
            {isSearchMode ? (
              <div className='flex relative w-full items-center gap-2'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Tìm kiếm sản phẩm...'
                  className='w-full border border-[#b2927b]/30 bg-[#e8dfd7] rounded-lg py-2 px-4 mb-1 focus:outline-none focus:ring-1 focus:ring-primary/50'
                  onKeyDown={handleSearch}
                />
              </div>
            ) : (
              // Navigation Menu
              <NavigationMenu>
                <NavigationMenuList className='flex gap-10 justify-center items-center mb-2'>
                  <NavigationMenuItem className='relative after:absolute after:bg-primary after:h-0.5 after:w-0 after:left-0 after:-bottom-1 after:hover:w-full after:duration-300'>
                    <NavigationMenuLink href='/'>Trang chủ</NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem className='relative after:absolute after:bg-primary after:h-0.5 after:w-0 after:left-0 after:-bottom-1 after:hover:w-full after:duration-300'>
                    <NavigationMenuLink href='/products'>Sản phẩm</NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem className='relative after:absolute after:bg-primary after:h-0.5 after:w-0 after:left-0 after:-bottom-1 after:hover:w-full after:duration-300'>
                    <NavigationMenuLink href='/favorite'>Yêu thích</NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem className='relative after:absolute after:bg-primary after:h-0.5 after:w-0 after:left-0 after:-bottom-1 after:hover:w-full after:duration-300'>
                    <NavigationMenuLink href='/shop'>Cửa hàng</NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>


          <div className='flex-1 flex gap-4 mb-2 justify-end'>

            {isSearchMode ? (
              <Button variant='outline' onClick={() => setIsSearchMode(false)}>
                Hủy bỏ
              </Button>
            ) : (
              <Button variant='outline' size='icon' onClick={() => setIsSearchMode(true)}>
                <Search className='h-6 w-6' />
              </Button>
            )}


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
