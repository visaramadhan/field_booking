import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthHeader from './components/AuthHeader';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import NotificationSystem from '../../components/navigation/NotificationSystem';

const Authentication = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (authToken && userRole) {
      const redirectPath = userRole === 'admin' ? '/admin-booking-management' : '/field-schedule';
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  const mockUsers = [
    {
      email: 'visaramadhan28@gmail.com',
      password: 'password',
      name: 'Visa Ramadhan',
      role: 'admin'
    },
    {
      email: 'user@example.com',
      password: 'password123',
      name: 'John Doe',
      role: 'customer'
    }
  ];

  const handleLogin = async (formData) => {
    setIsLoading(true);

    setTimeout(() => {
      const user = mockUsers?.find(
        u => u?.email === formData?.email && u?.password === formData?.password
      );

      if (user) {
        localStorage.setItem('authToken', `mock-token-${Date.now()}`);
        localStorage.setItem('userRole', user?.role);
        localStorage.setItem('userName', user?.name);
        localStorage.setItem('userEmail', user?.email);

        if (window.showNotification) {
          window.showNotification({
            type: 'success',
            message: `Selamat datang, ${user?.name}!`
          });
        }

        const from = location?.state?.from?.pathname;
        const redirectPath = user?.role === 'admin' ?'/admin-booking-management' : (from ||'/field-schedule');

        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 500);
      } else {
        if (window.showNotification) {
          window.showNotification({
            type: 'error',
            message: 'Email atau password salah. Silakan coba lagi.'
          });
        }
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleRegister = async (formData) => {
    setIsLoading(true);

    setTimeout(() => {
      const existingUser = mockUsers?.find(u => u?.email === formData?.email);

      if (existingUser) {
        if (window.showNotification) {
          window.showNotification({
            type: 'error',
            message: 'Email sudah terdaftar. Silakan gunakan email lain.'
          });
        }
        setIsLoading(false);
        return;
      }

      const newUser = {
        email: formData?.email,
        password: formData?.password,
        name: formData?.name,
        role: 'customer'
      };

      mockUsers?.push(newUser);

      localStorage.setItem('authToken', `mock-token-${Date.now()}`);
      localStorage.setItem('userRole', newUser?.role);
      localStorage.setItem('userName', newUser?.name);
      localStorage.setItem('userEmail', newUser?.email);

      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Pendaftaran berhasil! Selamat datang.'
        });
      }

      setTimeout(() => {
        navigate('/field-schedule', { replace: true });
      }, 500);
    }, 1500);
  };

  return (
    <>
      <NotificationSystem />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
            <AuthHeader activeTab={activeTab} />
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            {activeTab === 'login' ? (
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            ) : (
              <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date()?.getFullYear()} Field Booking System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;