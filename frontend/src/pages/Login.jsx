import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { setCredentials } from '../store/authSlice';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { api } from '../services/api';
import logo from '../assets/logo.png';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const ROLE_PATHS = { junior: '/junior', senior: '/senior', hod: '/hod' };

export function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const email = data.email.toLowerCase().trim();
      const password = data.password;

      // Real backend login (works for demo accounts since they're seeded)
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      dispatch(setCredentials({ user, token }));
      toast.success(`Welcome, ${user.name}!`);
      nav(ROLE_PATHS[user.role] || '/junior');
    } catch (err) {
      const isNetworkError = !err.response;
      if (isNetworkError) {
        toast.error('Cannot reach server. Please start the backend.');
      } else {
        const msg = err.response?.data?.message || 'Invalid email or password.';
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 p-2 shadow-soft">
            <img src={logo} alt="CampusVeda" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">CampusVeda</h1>
          <p className="mt-2 text-sm text-gray-500">Smart Campus Operation Platform</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@campus.edu"
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                {...register('password')}
                error={errors.password?.message}
              />
              <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                Sign in
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
