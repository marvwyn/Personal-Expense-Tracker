import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { Button } from '../ui/Button';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`;

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-3">
      <div className="flex items-center gap-6">
        <span className="font-semibold text-gray-900 dark:text-gray-100">Expense Tracker</span>
        <NavLink to="/" className={linkClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/categories" className={linkClass}>
          Categories
        </NavLink>
      </div>
      <div className="flex items-center gap-3">
        {user && <span className="text-sm text-gray-500 dark:text-gray-400">{user.name}</span>}
        <Button variant="secondary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </nav>
  );
}
