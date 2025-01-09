import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'

interface ProtectedRouteProps {
  children?: ReactNode
}

const ProtectUserRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('Vui lòng đăng nhập để tiếp tục')
    return <Navigate to={'/auth/sign-in'} replace />
  } 
  return <>{children}</>
}

export default ProtectUserRoute
