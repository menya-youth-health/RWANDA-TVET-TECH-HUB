
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const links: [string, string][] = [
  ['/', 'Home'],
  ['/departments', 'Departments'],
  ['/course', 'Courses'],
  ['/lab', 'Virtual lab'],
  ['/glossary', 'Glossary'],
  ['/progress', 'Progress'],
  ['/about', 'About'],
];

function CompanyLogo() {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      className="company-logo"
      src={import.meta.env.BASE_URL + 'moses-tech-logo.png'}
      alt="MOSES TECH COMPANY logo"
      onError={() => setFailed(true)}
    />
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading, signOut } = useAuth();
  const [logoutError, setLogoutError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleLogout = async () => {
    setLogoutError('');

    try {
      await signOut();
      navigate('/');
    } catch {
      setLogoutError('Unable to log out. Please try again.');
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <>
      <div className="banner">
        {user
          ? `Welcome back, ${profile?.full_name || user.email}!`
          : 'Welcome to RWANDA TVET TECH HUB — your independent TVET learning platform.'}
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              TT
            </span>
            Rwanda TVET Tech Hub
          </Link>

          <nav aria-label="Main" className="nav">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {label}
              </NavLink>
            ))}

            {!loading && !profileLoading && isAdmin && (
              <>
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Admin Dashboard
                </NavLink>

                <NavLink
                  to="/admin/courses"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Manage Courses
                </NavLink>

                <NavLink
                  to="/admin/departments"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Manage Departments
                </NavLink>

                <NavLink
                  to="/admin/glossary"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Manage Glossary
                </NavLink>
              </>
            )}
          </nav>

          <div className="auth-links">
            {loading ? null : user ? (
              <>
                <span className="small">
                  {profile?.full_name || user.email}
                </span>

                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-sm btn-outline-light" to="/login">
                  Log in
                </Link>

                <Link className="btn btn-sm btn-accent" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {logoutError && (
        <div className="notice notice-warn" role="alert">
          {logoutError}
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <CompanyLogo />
            <p>
              Developed by <strong>MOSES TECH COMPANY</strong>
            </p>
          </div>

          <nav aria-label="Footer" className="footer-links">
            <Link to="/departments">Departments</Link>
            <Link to="/course">Courses</Link>
            <Link to="/glossary">Glossary</Link>
            <Link to="/about">About</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
