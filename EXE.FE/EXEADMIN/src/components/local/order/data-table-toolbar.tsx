import { Table } from '@tanstack/react-table'
import { ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/auth/AuthContext'
import { Link } from 'react-router-dom'

// import { IUserGender, IUserRole } from "@/types/user.interface"
// import { DataTableFacetedFilter } from "@/components/local/data-table/data-table-faceted-filter"

// import { AddUser } from "../add-user-form"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const isSorted = table.getState().sorting.length > 0
  const { user } = useAuth()

  const handleReset = () => {
    table.resetColumnFilters()
    table.resetSorting()
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center justify-between space-x-2'>
        <div className='flex items-center space-x-2'>
          <div className='relative w-full'>
            <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3'>
              <Search className='h-4 w-4 text-gray-400' />
            </div>
            <input
              type='text'
              id='simple-search'
              className='block w-[300px] rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 '
              placeholder='Tìm kiếm bằng mã đơn hàng'
              value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('id')?.setFilterValue(event.target.value)}
            />
          </div>
          {(isFiltered || isSorted) && (
            <Button variant='ghost' onClick={handleReset} className='h-8 px-2 lg:px-3'>
              Reset
            </Button>
          )}
        </div>
        {user?.RoleName === 'Admin' && (
          <Link to='/shops'>
            <Button onClick={() => {}}><ArrowLeft size={20} className='mr-2'/> Trở về</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
