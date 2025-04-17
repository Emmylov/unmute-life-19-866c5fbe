
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedLayout: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
