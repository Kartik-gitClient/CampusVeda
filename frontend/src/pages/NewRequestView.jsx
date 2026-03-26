import React from 'react';
import { RequestForm } from '../components/Junior/RequestForm';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';

export function NewRequestView() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleSuccess = () => {
    // Redirect to respective dashboard after booking
    if (user?.role === 'junior') navigate('/junior');
    else if (user?.role === 'senior') navigate('/senior');
    else navigate('/hod');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100">
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">Create New Request</h1>
        <p className="text-gray-500 mb-8">Fill out the details below to request access to campus resources.</p>
        
        <RequestForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
