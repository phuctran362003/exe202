import REAPI from '@/lib/2REAPI'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { User } from '@/types'

interface AuthContextType {
  token: string | null
  user: User | null
  isError: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (data: any) => Promise<void>
  fetchUser: () => Promise<void>
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<any>(null)
  const [isError, setIsError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  
  
  useEffect(() => {
    if (token) {
      fetchUser()
    }
  }, [token])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const response = await REAPI.get('/api/Auth/CheckToken')
      setUser(response.data.result.user || null)
      console.log(response.data.result.user)
    } catch (error) {
      setIsError(true)
      localStorage.removeItem('token')
      localStorage.removeItem('token')
      console.error('Fetching user information failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await REAPI.post('/api/Auth/Login', { email, password })
      const AccessToken = response.data.result.accessToken
      setToken(AccessToken)
      localStorage.setItem('token', AccessToken)
      toast.success('Đăng nhập tài khoản thành công')
      navigate('/')
    } catch (error) {
      toast.error('Đăng nhập thất bại')
      console.error('Login failed:', error)
    }
  }

  const signup = async (data: any) => {
    const formData = new FormData()
    formData.append('userName', data.fullName)
    formData.append('passWord', data.password)
    formData.append('email', data.email)
    formData.append('address', data.address)
    formData.append('phoneNumber', data.phoneNumber)
    formData.append('isShopOwner', String(false))
    formData.append('shopName', '')
    formData.append('shopAddress', '')
    formData.append('shopDescription', '')
    formData.append('shopLogo', '')
    formData.append('shopBank', '')
    formData.append('shopBankId', '')
    
    // const formData = {
    //   email: data.email,
    //   passWord: data.password,
    //   userName: data.fullName,
    //   phoneNumber: data.phoneNumber,
    //   address: data.address,
    //   isShopOwner: false,
    //   shopName: '',
    //   shopAddress: '',
    //   shopDescription: '',
    //   shopLogo: ''
    // }

    try {
      const response = await REAPI.post('/api/Auth/Signup', formData)
      if(response.data.includes('success')) {
        toast.success('Đăng ký tài khoản thành công')
        setTimeout(() => {
          navigate('/auth/sign-in')
        }, 2000)
      }
    } catch (error) {
      toast.error('Đăng ký thất bại')
      console.error('Signup failed:', error)
    }
  }

  useEffect(() => {
    fetchUser()
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token') {
        window.location.reload()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    toast.success('Đăng xuất tài khoản thành công')
    navigate('/')
  }

  return <AuthContext.Provider value={{ token, user, login, logout, signup, isError, isLoading, fetchUser }}>{children}</AuthContext.Provider>
}
