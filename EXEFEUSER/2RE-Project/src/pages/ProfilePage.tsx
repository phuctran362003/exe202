import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, ConfigProvider, Form, Input } from 'antd'
import { RuleObject } from 'antd/lib/form'
import { Key, PiggyBank, Shell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Loading from '@/components/global/Loading/Loading'
import REAPI from '@/lib/2REAPI'


function ProfilePage() {
  const { user, isError, isLoading, fetchUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [form] = Form.useForm()
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  console.log(user)

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        userName: user.userName,
        email: user.email,
        PhoneNumber: user.phoneNumber,
        Address: user.address,
        Password: '',
        NewPassword: '',
        ConfirmPassword: '',
      });
    }
  }, [user, form]);
//   const onDrop = useCallback((acceptedFiles: Array<File>) => {
//     const droppedFile = acceptedFiles[0]
//     if (droppedFile && !droppedFile.type.startsWith('image/')) {
//       toast.error('Chỉ chấp nhận tệp tin hình ảnh!')
//       return
//     }
//     setFile(droppedFile)
//     const reader = new FileReader()

//     reader.onloadend = () => {
//       setPreview(reader.result)
//       setHasChanges(true)
//     }

//     if (droppedFile) {
//       reader.readAsDataURL(droppedFile)
//     }
//   }, [])

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: {
//       'image/*': []
//     }
//   })

  const onSubmit = async (values: any) => {
    const formData = new FormData()
    // formData.append('userName', values.userName || user?.userName)
    formData.append('passWord', values.Password)
    formData.append('newPassWord', values.NewPassword)
    formData.append('address', values.Address || user?.address)
    formData.append('phoneNumber', values.PhoneNumber || user?.phoneNumber)
    // formData.append('newPassword', values.NewPassword)
    // formData.append('confirmPassword', values.ConfirmPassword)
    formData.append('shopName', '')
    formData.append('shopAddress', '')
    formData.append('shopDescription', '')
    formData.append('shopLogo', '')
    formData.append('shopBank', '')
    formData.append('shopBankId', '')

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
      setLoading(false)
      toast.success('Cập nhật profile thành công')
      console.log('Profile updated successfully:', response)
      console.log('Profile updated successfully:', response.data)
      setHasChanges(false)
      await fetchUser()
    } catch (error: any) {
      setLoading(false)
      toast.error(error.response?.data?.result?.message || 'Mật khẩu cũ không chính xác!')
      console.error('Error updating profile:', error)
    }
  }

  const handleFormSubmit = async (values: any) => {
    setLoading(true)
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

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
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
              NewPassword: '',
              ConfirmPassword: ''
            }}
          >
            <div className='flex flex-col items-center justify-center text-primary'>
              <div className='shadow-3xl shadow-shadow-500 dark:!bg-navy-800 relative mx-auto w-full rounded-[20px] drop-shadow-md bg-white bg-clip-border p-4 dark:text-white dark:!shadow-none'>
                <div className='relative flex h-36 w-full justify-center rounded-xl bg-cover'>
                  <img
                    alt='banner'
                    src='https://media.2dep.vn/upload/luanhuynh/2022/01/19/thoi-trang-secondhand-tro-thanh-xu-huong-cua-tuong-lai-1-1642584903.jpeg'
                    className='absolute flex h-full  w-full object-cover justify-center rounded-xl bg-cover'
                  />
                  <div
                    title='Change avatar'
                    className='dark:!border-navy-700 absolute -bottom-14 flex h-[87px] w-[87px] cursor-pointer items-center justify-center rounded-full border-[4px] hover:border-tertiary border-amber-400'
                  >
                    <Avatar className='h-full w-full' title='Change avatar'>
                      <AvatarImage className='object-cover' src="https://github.com/shadcn.png" alt='avatar' />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className='mt-16 flex flex-col items-center'>
                  <h4 className='text-navy-700 text-xl font-bold dark:text-white'>{user?.userName}</h4>
                  <p className='flex items-center gap-2 text-base font-normal text-primary/60'>
                    <Key size={16} /> {user?.roleName === 'User' ? 'Người dùng' : 'Quản trị viên'}
                  </p>
                  {/* <p className='flex items-center gap-2 text-lg text-primary font-medium text-gray-600'>
                    <PiggyBank size={24} /> <span>{formatPrice(data?.Balance || 0)}</span>
                  </p> */}
                </div>

                <Form.Item
                  name='userName'
                  label={<span className='font-medium text-primary'>Tên người dùng</span>}
                  rules={[{ required: false }]}
                >
                  <Input className='border-primary' placeholder='Tên người dùng' disabled/>
                </Form.Item>
                <Form.Item
                  name='Address'
                  label={<span className='font-medium text-primary'>Địa chỉ</span>}
                  rules={[{ required: false }]}
                >
                  <Input className='bg-teriary text-primary focus:ring-primary/50' placeholder='Địa chỉ' />
                </Form.Item>
                <Form.Item className='hidden' name='avatar' label='Avatar' />

                <Form.Item
                  name='PhoneNumber'
                  label={<span className='font-medium text-primary'>PhoneNumber</span>}
                  rules={[{ required: false }, { validator: validatePhoneNumber }]}
                >
                  <Input className='bg-teriary text-primary focus:ring-primary/50' placeholder='Số điện thoại' />
                </Form.Item>
                <Form.Item name='email' label={<span className='font-medium text-primary'>Email</span>} rules={[{ required: true }]}>
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
                  label={<span className='font-medium text-primary'>Mật khẩu cũ</span>}
                  hidden={!showPasswordFields}
                >
                  <Input.Password className='bg-teriary text-primary focus:ring-primary/50' placeholder='Nhập mật khẩu cũ' />
                </Form.Item>
                <Form.Item
                  name='NewPassword'
                  label={<span className='font-medium text-primary'>Mật khẩu mới</span>}
                  hidden={!showPasswordFields}
                >
                  <Input.Password className='bg-teriary text-primary focus:ring-primary/50' placeholder='Nhập mật khẩu mới' />
                </Form.Item>

                <Form.Item
                  name='ConfirmPassword'
                  label={<span className='font-medium text-primary'>Xác nhận mật khẩu</span>}
                  rules={[{ validator: validateConfirmPassword }]}
                  hidden={!showPasswordFields}
                >
                  <Input.Password className='bg-teriary text-primary focus:ring-primary/50' placeholder='Xác nhận mật khẩu' />
                </Form.Item>
                <Form.Item className='mb-2 flex justify-center'>
                  <Button
                    type='dashed'
                    htmlType='submit'
                    className={`${loading ? 'bg-orange-500 text-white' : ''}`}
                    disabled={!hasChanges || loading}
                  >
                    {loading && <Shell className='w-4 h-4 ml-1 animate-spin' />}
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
