import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * 비로그인 사용자만 접근 가능한 라우트.
 * 이미 로그인된 사용자는 /notes로 리다이렉트한다.
 */
export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) return <Navigate to="/notes" replace />;

  return children;
}
