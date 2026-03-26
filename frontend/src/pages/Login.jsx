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
    <div className="flex min-h-screen items-center justify-center mesh-gradient px-4 overflow-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-black/5 dark:bg-white/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-200/10 dark:bg-white/5 rounded-full blur-[120px] animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] glass p-4 shadow-2xl">
            <img src={logo} alt="CampusVeda" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-primary dark:text-white drop-shadow-sm">CampusVeda</h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">Smart Campus Operation Platform</p>
        </motion.div>

        <Card className="glass !p-10 border-white/20 dark:border-white/5">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold mb-6">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@campus.edu"
                {...register('email')}
                error={errors.email?.message}
              />
              <div className="space-y-1">
                <Input
                  label="Secure Password"
                  type="password"
                  placeholder="Min. 6 characters"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <div className="text-right">
                  <a href="#" className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors">Forgot password?</a>
                </div>
              </div>
              <Button type="submit" className="w-full h-14 text-lg" isLoading={isLoading}>
                Sign in to Dashboard
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              New to the platform?{' '}
              <Link to="/register" className="font-bold text-black dark:text-white hover:text-gray-600 transition-colors underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
