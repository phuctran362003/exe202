import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { ClipboardList, LogIn, LogOut, UserIcon, UserPen } from 'lucide-react'
import { Link } from 'react-router-dom'
type Props = {
  className?: string
}

export default function ProfileButton({ className }: Props) {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' className={cn('mr-2', className)} aria-label='Shopping Cart'>
            <UserIcon className='w-6 h-6' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 bg-teriary text-primary'>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className='cursor-pointer'>
              <Link to='/auth/sign-in'>
                <LogIn className='w-4 h-4 mr-2' />
                <span>Đăng nhập</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className='cursor-pointer'>
              <Link to='/auth/sign-up'>
                <UserPen className='w-4 h-4 mr-2' />
                <span>Đăng ký</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='ml-3 cursor-pointer'>
          <AvatarImage src={user.shopLogo || 'https://github.com/shadcn.png'} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 bg-teriary text-primary'>
        <DropdownMenuLabel>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-bold leading-none line-clamp-1'>{user.userName}</p>
            <p className='text-xs leading-none text-muted-foreground line-clamp-1'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className='cursor-pointer'>
            <Link to='/profile'>
              <UserIcon className='w-4 h-4 mr-2' />
              <span>Hồ sơ người dùng</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className='cursor-pointer'>
            <Link to='/orders'>
              <ClipboardList className='w-4 h-4 mr-2 dark:filter dark:invert'/>
              <span>Đơn hàng của bạn</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className='cursor-pointer'
        >
          <LogOut className='w-4 h-4 mr-2' />
          <span>Đăng Xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
