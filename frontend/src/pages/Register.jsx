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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['junior', 'senior', 'hod'], { errorMap: () => ({ message: 'Please select a role' }) }),
  department: z.string().min(2, 'Department is required'),
  phone: z.string().optional(),
});

const ROLE_PATHS = { junior: '/junior', senior: '/senior', hod: '/hod' };

export function Register() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'junior' },
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Attempt real backend registration
      const response = await api.post('/auth/register', formData);
      const { user, token } = response.data.data;
      dispatch(setCredentials({ user, token }));
      toast.success(`Account created! Welcome, ${user.name}!`);
      nav(ROLE_PATHS[user.role] || '/junior');
    } catch (err) {
      if (!err.response) {
        toast.error('Cannot reach server. Please start the backend.');
      } else {
        toast.error(err.response.data?.message || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
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
            <CardTitle className="text-center text-2xl font-bold">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Dr. John Smith"
                {...register('name')}
                error={errors.name?.message}
              />
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
              <Input
                label="Department"
                placeholder="e.g. Computer Science"
                {...register('department')}
                error={errors.department?.message}
              />
              <Input
                label="Phone (optional)"
                placeholder="+91 98765 43210"
                {...register('phone')}
                error={errors.phone?.message}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  {...register('role')}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="junior">Junior Faculty</option>
                  <option value="senior">Senior Faculty</option>
                  <option value="hod">Head of Department (HOD)</option>
                </select>
                {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
              </div>

              <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                Create Account
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
