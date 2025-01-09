import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import REAPI from '@/lib/2REAPI'
import { toast } from 'sonner'

interface AuthContextType {
  token: string | null
  user: User | null
  userDetail: IUserDetail | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  errorMessage: string | null
  loading: boolean
}

interface User {
  userId: string
  userName: string
  passWord: string
  email: string
  address: string
  phoneNumber: string
  roleId: string
  roleName: string
  RoleName: string
  isShopOwner: boolean
  shopName: string
  shopAddress: string
  shopDescription: string
  shopLogo: string
  createdAt: string
  updatedAt: string
}

interface IUserDetail {
  UserID: string
  UserName: string
  Password: string
  FullName: string
  Email: string
  Avatar: string
  Address: string
  OtpCode: string
  PhoneNumber: string
  Balance: number
  CreateDate: string
  IsVerified: boolean
  Status: string
  RoleID: string
  RoleName: string
  CompanyID: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })
  const [user, setUser] = useState<User | null>(null)
  const [userDetail, setUserDetail] = useState<IUserDetail | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      console.log('refresh')
      if (token) {
        try {
          const response = await REAPI.get('/api/Auth/CheckToken', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const userData = {
            ...response.data.result.user,
            RoleName:  response.data.result.user.roleName === 'Admin' ? 'Admin' : response.data.result.user.isShopOwner ? 'Manager' : 'Buyer'
          }
          setUser(userData)
        } catch (error) {
          localStorage.removeItem('token')
          console.error('Fetching user information failed:', error)
        }
      }
    }
    fetchUser()
  }, [token])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await REAPI.post('/api/Auth/Login', {
        email: email,
        password: password
      })
      const newToken = response.data.result.accessToken
      setToken(newToken)
      localStorage.setItem('token', newToken)
      setErrorMessage(null)

      const fetchUser = async () => {
        try {
          const response = await REAPI.get('/api/Auth/CheckToken')
          const userData = {
            ...response.data.result.user,
            RoleName: response.data.result.user.roleName === 'Admin' ? 'Admin' : response.data.result.user.isShopOwner ? 'Manager' : 'Buyer'
          }
          setUser(userData)
          if (response.data.result.user.roleName === 'Admin' || (response.data.result.user.roleName === 'User' && response.data.result.user.isShopOwner)) {
            toast.success('Đăng nhập thành công')
            navigate(`/home/${response.data.result.user.isShopOwner ? 'manager' : 'admin'}`)
          } else {
            toast.error('Tài khoản không được phép đăng nhập vào hệ thống')
            localStorage.removeItem('token')
          }
        } catch (error) {
          toast.error('Lỗi đăng nhập. Vui lòng thử lại sau!')
          console.error('Fetching user information failed:', error)
        } finally {
          setLoading(false)
        }
      }
      await fetchUser()
    } catch (error) {
      setLoading(false)
      toast.error('Email hoặc mật khẩu không đúng')
    }
  }

  const logout = () => {
    toast.success('Đăng xuất thành công')
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ token, user, userDetail, login, logout, errorMessage, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
