import { Navigate } from 'react-router-dom'

// Chỉ cho vào nếu có token trong localStorage
// Nếu chưa đăng nhập → chuyển về /login
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}
