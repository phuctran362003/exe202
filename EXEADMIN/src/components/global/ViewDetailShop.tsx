import { useState } from 'react'
import { ShopDetail } from '@/types'
import Loading from '../Loading/Loading'
import { Input } from '../ui/input'

interface UpdateProductFormProps {
  product: ShopDetail | undefined
  edit: boolean
}

export default function ViewDetailShop({ product, edit }: UpdateProductFormProps) {
  const formData = {
    shopName: product?.shopName,
    shopAddress: product?.shopAddress,
    shopPhone: product?.shopPhone,
    email: product?.email,
    address: product?.address,
    shopLogo: product?.shopLogo,
    shopDescription: product?.shopDescription,
    userName: product?.userName,
    shopBank: product?.shopBank,
    shopBankId: product?.shopBankId,
    phoneNumber: product?.phoneNumber
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('hehe')
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block'>Logo cửa hàng:</label>

        <div className='flex gap-2 mt-2'>
          <div className='relative'>
            <img src={formData.shopLogo} alt={`Old Image ${formData.shopName}`} className='w-28 h-28 object-cover' />
          </div>
        </div>
      </div>
      <div className='flex gap-5'>
        <div className='flex-1'>
          <label htmlFor='name' className='block'>
            Tên khách hàng:
          </label>
          <Input
            type='text'
            id='name'
            name='name'
            disabled={!edit}
            value={formData.userName}
            className='border p-2 rounded w-full'
          />
        </div>
        <div className='flex-1'>
          <label htmlFor='name' className='block'>
            Tên cửa hàng:
          </label>
          <Input
            type='text'
            id='name'
            name='name'
            disabled={!edit}
            value={formData.shopName}
            className='border p-2 rounded w-full'
          />
        </div>
      </div>

      <div className='flex w-full justify-between gap-5'>
        <div className='flex-1'>
          <label htmlFor='price' className='block'>
            Email:
          </label>
          <Input disabled={!edit} value={formData.email} className='border p-2 rounded w-full' />
        </div>
        <div className='flex-1'>
          <label htmlFor='sale' className='block'>
            Số điện thoại khách hàng:
          </label>
          <Input disabled={!edit} value={formData.phoneNumber} className='border p-2 rounded w-full' />
        </div>
        <div className='flex-1'>
          <label htmlFor='sale' className='block'>
            Số điện thoại cửa hàng:
          </label>
          <Input disabled={!edit} value={formData.shopPhone} className='border p-2 rounded w-full' />
        </div>
      </div>

      <div className='flex gap-5'>
        <div className='flex-1'>
          <label htmlFor='name' className='block'>
            Địa chỉ:
          </label>
          <Input
            type='text'
            id='name'
            name='name'
            disabled={!edit}
            value={formData.shopAddress}
            className='border p-2 rounded w-full'
          />
        </div>
        <div className='flex-1'>
          <label htmlFor='name' className='block'>
            Địa chỉ cửa hàng:
          </label>
          <Input
            type='text'
            id='name'
            name='name'
            disabled={!edit}
            value={formData.address}
            className='border p-2 rounded w-full'
          />
        </div>
      </div>

      <div className='flex gap-5'>
        <div className='flex-1'>
          <label htmlFor='name' className='block'>
            Số tài khoản ngân hàng:
          </label>
          <Input
            type='text'
            id='name'
            name='name'
            disabled={!edit}
            value={formData.shopBankId}
            className='border p-2 rounded w-full'
          />
        </div>
        <div className='flex-1'>
          <label htmlFor='name' className='block'>
            Tên ngân hàng:
          </label>
          <Input
            type='text'
            id='name'
            name='name'
            disabled={!edit}
            value={formData.shopBank}
            className='border p-2 rounded w-full'
          />
        </div>
      </div>

      <div>
        <label htmlFor='description' className='block'>
          Mô tả cửa hàng:
        </label>
        <textarea
          disabled={!edit}
          id='description'
          name='description'
          value={formData.shopDescription}
          className='border p-2 rounded w-full'
        />
      </div>
    </form>
  )
}
