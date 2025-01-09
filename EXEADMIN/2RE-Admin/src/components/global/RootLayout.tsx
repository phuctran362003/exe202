import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
  } from '@/components/ui/dropdown-menu'
  import SideNavbar from '@/components/global/SideNavbar'
  import { BookUser, Loader, LogOut } from 'lucide-react'
  import { Link, Outlet } from 'react-router-dom'
  import LogoFull2 from '../../assets/Logo.png'
  import { useEffect, useState } from 'react'
  import { useAuth } from '@/auth/AuthContext'
  
  function RouteLayout() {
    const { user, loading, logout } = useAuth()
    // console.log('user ở layout', user)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    // const {userDetail} = useAuth();
    // console.log("user ở layout", userDetail);
  
    useEffect(() => {
      if (user) {
        setIsAdmin(!user.isShopOwner)
      }
    }, [user])
    if (loading) {
      return (
        <div className='flex justify-center items-center min-h-screen'>
          <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full' role='status'>
            <span className='visually-hidden'>
              <Loader className='w-4 h-4 animate-spin' />
            </span>
          </div>
        </div>
      )
    }
    return (
      <div className='relative text-primary'>
        <div className='fixed top-0 left-0 right-0 flex justify-between items-center px-20 py-2 bg-teriary z-10 shadow-md'>
          <div className='h-14'>
            <img src={LogoFull2} className='h-full' alt='Logo' />
          </div>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  className='h-12 w-12 cursor-pointer rounded-full object-cover'
                  src='https://api.dicebear.com/8.x/adventurer/svg?seed=Oliver'
                  alt='avatar'
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-fit bg-teriary text-primary'>
                <DropdownMenuLabel className='py-0'>{user?.isShopOwner ? user.shopName : user.userName}</DropdownMenuLabel>
                <DropdownMenuItem className='py-0 text-xs text-gray-800 line-clamp-1 font-bold' disabled>
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link to='/profile'>
                  <DropdownMenuItem className='flex justify-start items-center gap-1 cursor-pointer'>
                    <BookUser className='w-4' />
                    Hồ sơ người dùng
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className='flex justify-start items-center gap-1 cursor-pointer'
                  onClick={() => logout()}
                >
                  <LogOut className='w-4' />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className='min-h-screen h-fit w-full bg-teriary text-black flex'>
          {user ? (
            <SideNavbar isAdmin={isAdmin} />
          ) : (
            <div className='flex justify-center items-center w-full'>
              <Loader className='w-4 h-4 animate-spin' />
            </div>
          )}
          <div className='p-8 pt-24 w-full max-h-screen overflow-y-auto no-scrollbar'>
            <Outlet />
          </div>
        </div>
      </div>
    )
  }
  
  export default RouteLayout
  