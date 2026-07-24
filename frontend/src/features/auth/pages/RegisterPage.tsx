import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <div className="mx-auto mt-16 w-full max-w-sm">
      <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Create an account
      </h1>
      <RegisterForm />
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 dark:text-indigo-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
