import { ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const {user} = useAuth()
  console.log("proteted",user)
  const token = localStorage.getItem('token')
  const location = useLocation()
  const navigate = useNavigate()
  if (user && user?.isShopOwner) {
    return <Navigate to={location.state?.from || `/home/${user?.isShopOwner?"manager":"admin"}`} replace />
  } 
  return <>{children}</>
}

export default ProtectedRoute
