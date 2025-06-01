import { Navigate } from "react-router-dom"
import { useAuth } from "../../hook/useAuth"
import type { JSX } from "react"

interface ProtectedRouteProps {
  children: JSX.Element
  adminOnly?: boolean 
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" /> 
  }

  return children
}

export default ProtectedRoute