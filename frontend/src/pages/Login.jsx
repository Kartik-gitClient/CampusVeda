import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { setCredentials } from '../store/authSlice';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Map backend role → dashboard path
const ROLE_PATHS = {
  junior: '/junior',
  senior: '/senior',
  hod: '/hod',
};

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Try real backend first
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user, token } = response.data.data;
      dispatch(setCredentials({ user, token }));
      toast.success('Login successful!');

      const path = ROLE_PATHS[user.role] || '/junior';
      navigate(path);
    } catch (backendError) {
      // Fallback: demo mock login (for offline/hackathon demo purposes)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        let role = 'junior';
        if (data.email.includes('senior')) role = 'senior';
        if (data.email.includes('hod')) role = 'hod';

        const mockUser = {
          id: 'demo-1',
          name: data.email.split('@')[0],
          email: data.email,
          role,
          department: 'Computer Science',
        };
        const mockToken = `demo-token-${role}-${Date.now()}`;

        dispatch(setCredentials({ user: mockUser, token: mockToken }));
        toast.success('Demo login successful!');
        navigate(ROLE_PATHS[role]);
      } catch {
        toast.error('Failed to login. Please try again.');
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
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
            <Building2 size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">PRITHVEDA</h1>
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
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                error={errors.password?.message}
              />
              <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                Sign in
              </Button>
            </form>
            <div className="mt-6 text-center text-xs text-gray-500 space-y-1">
              <p className="font-medium">Demo accounts (password: any 6+ chars)</p>
              <p>junior@test.com · senior@test.com · hod@test.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
