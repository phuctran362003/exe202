import { useAuth } from '@/auth/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, ConfigProvider, Form, Input } from 'antd'
import { RuleObject } from 'antd/lib/form'
import { Key, PiggyBank, Shell } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Loading from '@/components/Loading/Loading'
import REAPI from '@/lib/2REAPI'
import TextArea from 'antd/lib/input/TextArea'
import { useDropzone } from 'react-dropzone'

function ProfilePage() {
  const { user, errorMessage, loading } = useAuth()
  const [shopData, setShopData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [form] = Form.useForm()
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  console.log(user)

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await REAPI.get(`/detail/${user?.userId}`)
        const shopdata = response.data
        setShopData(shopdata)
        form.setFieldsValue({
          userName: shopdata.userName,
          email: user?.email,
          PhoneNumber: shopdata.phoneNumber,
          shopName: shopdata.shopName,
          shopAddress: shopdata.shopAddress,
          shopDescription: shopdata.shopDescription,
          shopLogo: shopdata.shopLogo,
          Address: user?.address,
          shopPhone: shopdata.shopPhone,
          shopBankId: shopdata.shopBankId,
          shopBank: shopdata.shopBank,
          Password: '',
          NewPassword: '',
          ConfirmPassword: ''
        })
      } catch (error) {
        console.error('Error fetching shop data:', error)
      }
    }
    if (user) {
      fetchShopData()
    }
  }, [user, form])
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const droppedFile = acceptedFiles[0]
    if (droppedFile && !droppedFile.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận tệp tin hình ảnh!')
      return
    }
    setFile(droppedFile)
    const reader = new FileReader()

    reader.onloadend = () => {
      setPreview(reader.result)
      setHasChanges(true)
    }

    if (droppedFile) {
      reader.readAsDataURL(droppedFile)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  })

  const onSubmit = async (values: any) => {
    const formData = new FormData()
    // formData.append('userName', values.userName || user?.userName)
    formData.append('address', values.Address || user?.address)
    formData.append('phoneNumber', values.PhoneNumber || user?.phoneNumber)
    formData.append('passWord', values.Password)
    formData.append('newPassWord', values.NewPassword)
    // formData.append('confirmPassword', values.ConfirmPassword)
    formData.append('shopName', values.shopName || user?.shopName)
    formData.append('shopAddress', values.shopAddress || user?.shopAddress)
    formData.append('shopDescription', values.shopDescription || user?.shopDescription)
    formData.append('shopBank', values.shopBank || '')
    formData.append('shopBankId', values.shopBankId || '')
    if(file) {
      formData.append('shopLogo', file)
    } else {
      formData.append('shopLogo', '')
    }

    // if (file) {
    //   formData.append('Avatar', file)
    // } else {
    //   formData.append('Avatar', '')
    // }
    // // Logging form data
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`)
    // }
    try {
      const response = await REAPI.put(`/update/profile/${user?.userId}`, formData)
      setIsLoading(false)
      toast.success('Cập nhật hồ sơ thành công')
      console.log('Profile updated successfully:', response)
      console.log('Profile updated successfully:', response.data)
      setHasChanges(false)
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.response?.data?.result?.message || 'Mật khẩu cũ không chính xác!')
      console.error('Error updating profile:', error)
    }
  }

  const handleFormSubmit = async (values: any) => {
    setIsLoading(true)
    await onSubmit(values)
    setHasChanges(false)
  }

  const handleValuesChange = () => {
    setHasChanges(true)
  }

  const validateConfirmPassword = (_rule: RuleObject, value: any) => {
    const passFieldValue = form.getFieldValue('NewPassword')
    if (passFieldValue && !value) {
      return Promise.reject('Vui lòng xác nhận mật khẩu')
    }
    if (value !== passFieldValue) {
      return Promise.reject('Mật khẩu xác nhận không khớp')
    }
    return Promise.resolve()
  }

  const handleTogglePasswordFields = () => {
    setShowPasswordFields((prevShowPasswordFields) => !prevShowPasswordFields)
  }

  const validatePhoneNumber = (_rule: RuleObject, value: any) => {
    if (value && value !== '') {
      const phoneNumberRegex = /^0\d{9}$/
      if (!phoneNumberRegex.test(value)) {
        return Promise.reject('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0')
      }
    }
    return Promise.resolve()
  }

  if (loading) {
    return <Loading />
  }

  if (errorMessage) {
    return (
      <div className='flex justify-center items-center min-h-screen w-full'>
        <p>Đã xảy ra lỗi tải thông tin người dùng. Vui lòng thử lại sau!</p>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col items-center justify-center'>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#F97316'
            },
            components: {
              Button: {
                colorTextLightSolid: '#000000'
              }
            }
          }}
        >
          <Form
            form={form}
            variant='filled'
            onFinish={handleFormSubmit}
            onValuesChange={handleValuesChange}
            className='w-full max-w-3xl rounded-lg p-4 shadow-mini-content'
            layout='vertical'
            initialValues={{
              userName: user?.userName,
              email: user?.email,
              Password: '',
              PhoneNumber: user?.phoneNumber,
              Address: user?.address,
              shopName: user?.shopName,
              shopAddress: user?.shopAddress,
              shopDescription: user?.shopDescription,
              shopPhone: shopData.shopPhone,
              shopBankId: shopData.shopBankId,
              shopBank: shopData.shopBank,
              NewPassword: '',
              ConfirmPassword: ''
            }}
          >
            <div className='flex flex-col items-center justify-center'>
              <div className='shadow-3xl shadow-shadow-500 dark:!bg-navy-800 relative mx-auto w-full rounded-[20px] drop-shadow-md bg-white bg-clip-border p-4 dark:text-white dark:!shadow-none'>
                <div className='relative flex h-36 w-full justify-center rounded-xl bg-cover'>
                  <img
                    alt='banner'
                    src='https://media.2dep.vn/upload/luanhuynh/2022/01/19/thoi-trang-secondhand-tro-thanh-xu-huong-cua-tuong-lai-1-1642584903.jpeg'
                    className='absolute flex h-full  w-full object-cover justify-center rounded-xl bg-cover'
                  />
                  <div
                    {...getRootProps()}
                    title='Change avatar'
                    className='dark:!border-navy-700 absolute -bottom-14 flex h-[87px] w-[87px] cursor-pointer items-center justify-center rounded-full border-[4px] hover:border-tertiary border-amber-400'
                  >
                    <input {...getInputProps()} />
                    {!preview ? (
                      <Avatar className='h-full w-full' title='Change avatar'>
                        <AvatarImage
                          className='object-cover'
                          src={user?.shopLogo ? user.shopLogo : 'https://github.com/shadcn.png'}
                          alt='avatar'
                        />
                        <AvatarFallback>{user?.shopName}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className='h-full w-full' title='Change image'>
                        <AvatarImage className='object-cover' src={preview as string} alt={user?.shopName} />
                        <AvatarFallback>{user?.shopName}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
                <div className='mt-16 flex flex-col items-center'>
                  <h4 className='text-navy-700 text-xl font-bold dark:text-white'>{user?.userName}</h4>
                  <p className='flex items-center gap-2 text-base font-normal text-gray-600'>
                    <Key size={16} /> {user?.roleName === 'User' && !user.isShopOwner ? 'Người dùng' : 'Quản trị viên'}
                  </p>
                  {/* <p className='flex items-center gap-2 text-lg text-primary font-medium text-gray-600'>
                    <PiggyBank size={24} /> <span>{formatPrice(data?.Balance || 0)}</span>
                  </p> */}
                </div>

                <Form.Item
                  name='userName'
                  label={<span className='font-medium'>Tên người dùng</span>}
                  rules={[{ required: true }]}
                >
                  <Input placeholder='Tên người dùng' />
                </Form.Item>
                {/* <Form.Item className='hidden' name='avatar' label='Avatar' /> */}
                <Form.Item
                  name='Address'
                  label={<span className='font-medium'>Địa chỉ</span>}
                  rules={[{ required: true }]}
                >
                  <Input placeholder='Địa chỉ' />
                </Form.Item>
                <Form.Item
                  name='shopName'
                  label={<span className='font-medium'>Tên cửa hàng</span>}
                  rules={[{ required: true }]}
                >
                  <Input placeholder='Địa chỉ' />
                </Form.Item>
                <Form.Item
                  name='shopAddress'
                  label={<span className='font-medium'>Địa chỉ cửa hàng</span>}
                  rules={[{ required: true }]}
                >
                  <Input placeholder='Địa chỉ' />
                </Form.Item>
                <Form.Item
                  name='shopDescription'
                  label={<span className='font-medium'>Chi tiết cửa hàng</span>}
                  rules={[{ required: true }]}
                >
                  <TextArea placeholder='Địa chỉ' />
                </Form.Item>

                <Form.Item
                  name='PhoneNumber'
                  label={<span className='font-medium'>Số điện thoại</span>}
                  rules={[{ required: true }, { validator: validatePhoneNumber }]}
                >
                  <Input placeholder='Số điện thoại' />
                </Form.Item>
                <div className='flex gap-5'>
                  <Form.Item
                    name='shopBankId'
                    className='flex-1'
                    label={<span className='font-medium'>Số tài khoản ngân hàng</span>}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder='Số điện thoại' />
                  </Form.Item>
                  <Form.Item
                    name='shopBank'
                    className='flex-1'
                    label={<span className='font-medium'>Tên ngân hàng</span>}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder='Số điện thoại' />
                  </Form.Item>
                </div>

                <Form.Item name='email' label={<span className='font-medium'>Email</span>} rules={[{ required: true }]}>
                  <Input className='cursor-not-allowed' disabled />
                </Form.Item>

                {/* <Button type='link' className='mb-2 p-0 text-tertiary' onClick={handleTogglePasswordFields}>
                  {showPasswordFields ? 'Ẩn đổi mật khẩu' : 'Đổi mật khẩu'}
                </Button> */}
                {user?.passWord && (
                  <Button type='link' className='mb-2 p-0 text-tertiary' onClick={handleTogglePasswordFields}>
                    {showPasswordFields ? 'Ẩn đổi mật khẩu' : 'Đổi mật khẩu'}
                  </Button>
                )}
                <Form.Item
                  name='Password'
                  label={<span className='font-medium'>Mật khẩu cũ</span>}
                  hidden={!showPasswordFields}
                >
                  <Input.Password placeholder='Nhập mật khẩu cũ' />
                </Form.Item>
                <Form.Item
                  name='NewPassword'
                  label={<span className='font-medium'>Mật khẩu mới</span>}
                  hidden={!showPasswordFields}
                >
                  <Input.Password placeholder='Nhập mật khẩu mới' />
                </Form.Item>

                <Form.Item
                  name='ConfirmPassword'
                  label={<span className='font-medium'>Xác nhận mật khẩu</span>}
                  rules={[{ validator: validateConfirmPassword }]}
                  hidden={!showPasswordFields}
                >
                  <Input.Password placeholder='Xác nhận mật khẩu' />
                </Form.Item>
                <Form.Item className='mb-2 flex justify-center'>
                  <Button
                    type='dashed'
                    htmlType='submit'
                    className={`${isLoading ? 'bg-primary text-white' : ''}`}
                    disabled={!hasChanges}
                  >
                    {isLoading && <Shell className='w-4 h-4 ml-1 animate-spin' />}
                    Cập nhật
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  )
}

export default ProfilePage
