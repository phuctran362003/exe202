import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/local/order/data-table-column-header'

import { Order } from '@/types/index'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import DataViewDetail from './data-view-detail'
import { format } from 'date-fns'

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã đơn hàng' />,
    cell: ({ row }) => {
      return (
        <div className='ml-5'>
          <p>{row.getValue('id') ? (row.getValue('id') as string)?.slice(0, 8) : ''} </p>
        </div>
      )
    },
    enableHiding: false
  },
  {
    accessorKey: 'nameUser',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên khách hàng' />,
    cell: ({ row }) => {
      return <div className='max-w-[500px] truncate font-semibold'>{row.getValue('nameUser')}</div>
    }
  },
  {
    accessorKey: 'totalQuantity',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tổng sản phẩm' />,
    cell: ({ row }) => {
      return <div className='mx-10'>{row.getValue('totalQuantity')}</div>
    },
  },
  {
    accessorKey: 'totalPrice',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tổng giá tiền' />,
    cell: ({ row }) => {
      return <div className='mx-5'>{formatCurrency(row.getValue('totalPrice'))}</div>
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
    cell: ({ row }) => {
      const createdOnDate = new Date(row.getValue('date') ? row.getValue('date') : new Date())
      return <div className='ml-3'>{format(createdOnDate, 'Pp')}</div>
    }
  },
  {
    accessorKey: 'paymentMethod',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Phương thức thanh toán' />,
    cell: ({ row }) => {
      return <div className='flex justify-center'>{row.getValue('paymentMethod')}</div>
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      switch (row.getValue('status')) {
        case 'CHƯA THANH TOÁN': return <Badge className='bg-red-500 hover:bg-red-600'>CHƯA THANH TOÁN</Badge>
        case 'ĐANG VẬN CHUYỂN': return <Badge className='bg-blue-500 hover:bg-blue-600'>ĐANG VẬN CHUYỂN</Badge>
        case 'ĐÃ HOÀN THÀNH': return <Badge className='bg-green-500 hover:bg-green-600'>ĐÃ HOÀN THÀNH</Badge>
        default: return <Badge className='bg-gray-500 hover:bg-gray-600'>ĐÃ HỦY</Badge>
      }
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <DataViewDetail row={row} />
    }
  }
]
