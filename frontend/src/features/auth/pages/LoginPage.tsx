import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <div className="mx-auto mt-16 w-full max-w-sm">
      <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">Sign in</h1>
      <LoginForm />
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        No account?{' '}
        <Link to="/register" className="text-indigo-600 dark:text-indigo-400">
          Register
        </Link>
      </p>
    </div>
  );
}
