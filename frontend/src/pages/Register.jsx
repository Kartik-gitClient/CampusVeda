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
    <div className="flex min-h-screen items-center justify-center mesh-gradient px-4 py-16 overflow-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-black/5 dark:bg-white/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gray-200/10 dark:bg-white/5 rounded-full blur-[120px] animate-pulse" />

      <div className="w-full max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 flex flex-col items-center text-center"
        >
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] glass p-4 shadow-2xl">
            <img src={logo} alt="CampusVeda" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-primary dark:text-white drop-shadow-sm">Join CampusVeda</h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">Smart Campus Operation Platform</p>
        </motion.div>

        <Card className="glass !p-12 border-white/20 dark:border-white/5">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold mb-8">Create Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  placeholder="Dr. John Smith"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@campus.edu"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Secure Password"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm font-medium text-primary dark:text-gray-200">System Role</label>
                  <select
                    {...register('role')}
                    className="flex h-12 w-full rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-gray-900/50 px-4 py-2 text-sm text-primary dark:text-white backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-900"
                  >
                    <option value="junior">Junior Faculty</option>
                    <option value="senior">Senior Faculty</option>
                    <option value="hod">Head of Department (HOD)</option>
                  </select>
                  {errors.role && <p className="mt-1 text-[10px] text-red-500">{errors.role.message}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-lg mt-4" isLoading={isLoading}>
                Initialize Account
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-black dark:text-white hover:text-gray-600 transition-colors underline-offset-4 hover:underline">
                Sign in here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
