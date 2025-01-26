import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/local/products/data-table-column-header'

import { Product } from '@/types/index'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import DataViewDetail from '@/components/local/products/data-view-detail'
import { Link } from 'react-router-dom'
import { Ellipsis, Eye, Shell } from 'lucide-react'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import REAPI from '@/lib/2REAPI'
import { toast } from 'sonner'

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'productId',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã sản phẩm' />,
    cell: ({ row }) => {
      return (
        <div className='ml-5'>
          <p>{row.getValue('productId') ? (row.getValue('productId') as string)?.slice(0, 8) : ''} </p>
        </div>
      )
    },
    enableHiding: false
  },
  {
    accessorKey: 'imgUrl',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ảnh sản phẩm' />,
    cell: ({ row }) => {
      return (
        <div className='flex justify-center items-center'>
          <img src={row.getValue('imgUrl')} alt='ảnh' className='w-12 h-12 object-cover' />
        </div>
      )
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên sản phẩm' />,
    cell: ({ row }) => {
      return <div className='max-w-[500px] truncate font-semibold'>{row.getValue('name')}</div>
    }
  },
  {
    accessorKey: 'size',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Kích cỡ' />,
    cell: ({ row }) => {
      return <div className='mx-10'>{row.getValue('size')}</div>
    }
  },
  {
    accessorKey: 'genderCategory',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giới tính' />,
    cell: ({ row }) => {
      return <div className='mx-5'>{row.getValue('genderCategory')}</div>
    }
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tổng giá tiền' />,
    cell: ({ row }) => {
      return <div className='mx-5'>{formatCurrency(row.getValue('price'))}</div>
    }
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Loại' />,
    cell: ({ row }) => {
      return <div className='mx-5'>{row.getValue('category')}</div>
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const [currentStatus, setCurrentStatus] = useState(
        row.getValue('status') ? (row.getValue('status') as string) : 'Có sẵn'
      )
      const [isOpenDialog, setIsOpenDialog] = useState(false)
      const [isLoading, setIsLoading] = useState(false)
      const handleChangeStatus = () => {
        setIsOpenDialog(true)
      }
      const handleConfirmChangeStatus = async () => {
        setIsLoading(true)
        setCurrentStatus(currentStatus.toLowerCase() === 'có sẵn' ? 'Hết hàng' : 'Có sẵn')
        const dataChange = currentStatus.toLowerCase() === 'có sẵn' ? 'Hết hàng' : 'Có sẵn'
        try {
          await REAPI.put(`/product/status/${row.getValue('productId')}?productId=${row.getValue('productId')}&status=${dataChange.toUpperCase()}`)
          toast.success('Thay đổi trạng thái thành công')
        } catch (error) {
          toast.error('Thay đổi trạng thái thất bại')
        } finally {
          setIsLoading(false)
        }
        setIsOpenDialog(false)
      }
      return (
        <>
          <Select
            defaultValue={currentStatus.toLocaleLowerCase()}
            value={currentStatus.toLocaleLowerCase()}
            disabled={currentStatus.toLocaleLowerCase() === 'hết hàng'}
            onValueChange={() => handleChangeStatus()}
          >
            <SelectTrigger>
              <SelectValue placeholder='Theme' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='có sẵn'>
                <Badge className='bg-green-500 hover:bg-green-600'>Có sẵn</Badge>
              </SelectItem>
              <SelectItem value='hết hàng'>
                <Badge className='bg-red-500 hover:bg-red-600'>Hết hàng</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
          <AlertDialog open={isOpenDialog}>
            {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn thay đổi trạng thái ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Khi bạn thay đổi trạng thái, sản phẩm sẽ không còn hiển thị trên trang chủ, và bạn sẽ không được đổi lại trạng thái.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading} onClick={() => setIsOpenDialog(false)}>Hủy</AlertDialogCancel>
                <AlertDialogAction disabled={isLoading} onClick={() => handleConfirmChangeStatus()}>Tiếp tục {isLoading && <Shell className='h-4 w-4 animate-spin'/>}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )
    }
  },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
  //   cell: ({ row }) => {
  //     const status = row.getValue('status') as IUserStatus
  //     const color = status === IUserStatus.Active ? '#4DB848' : '#E53E3E'
  //     const content = status === IUserStatus.Active ? 'Active' : 'Inactive'
  //     return <Chip content={content} color={color} />
  //   }
  // },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Link
          to={`/products/${row.getValue('productId')}`}
          className='cursor-pointer flex-1 flex text-sm font-bold items-center justify-end'
        >
          <Ellipsis className='ml-2' size={20} />
        </Link>
      )
    }
  }
]
