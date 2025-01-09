import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/local/users/data-table-column-header'

import { DataUser } from '@/types/index'
import { Link } from 'react-router-dom'
import { Ellipsis } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
// import { formatCurrency } from '@/lib/utils'
// import DataViewDetail from '@/components/local/products/data-view-detail'
// import { Link } from 'react-router-dom'
// import { Ellipsis, Eye } from 'lucide-react'

export const columns: ColumnDef<DataUser>[] = [
  {
    accessorKey: 'userName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên khách hàng' />,
    cell: ({ row }) => {
      return (
        <div className='ml-5'>
          <p>{row.getValue('userName')}</p>
        </div>
      )
    },
    enableHiding: false
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => {
      return (
        <div className='ml-5'>
          <p>{row.getValue('email')}</p>
        </div>
      )
    }
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số điện thoại' />,
    cell: ({ row }) => {
      return <div className='ml-5'>{row.getValue('phoneNumber')}</div>
    }
  },
  {
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa chỉ' />,
    cell: ({ row }) => {
      return <div className='mx-5'>{row.getValue('address')}</div>
    }
  },
  {
    accessorKey: 'userId', // Adding 'userId' accessorKey to fetch the data
    header: () => null, // This prevents the column from rendering a header
    cell: () => null,   // This prevents the column from rendering any cell content
    enableHiding: true, // Hides the column from the UI
    enableSorting: false // Optionally disable sorting for this column
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Link to={`/orderUser/${row.getValue('userId')}`}
          className='cursor-pointer flex-1 flex text-sm font-bold items-center justify-end'
        >
          <Ellipsis className='ml-2' size={20} />
        </Link>
      )
    }
  }
]
