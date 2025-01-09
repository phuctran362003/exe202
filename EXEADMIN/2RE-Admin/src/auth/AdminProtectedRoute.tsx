import React from 'react'
import { Navigate, RouteProps } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

type AdminProtectedRouteProps = RouteProps & {
    children: React.ReactNode
  }

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" />
  }

  if (user.RoleName !== 'Admin') {
    return <Navigate to="/not-authorized" />
  }

  return <>{children}</>
}

export default AdminProtectedRoute
