
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function StudentRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Checking your account...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
