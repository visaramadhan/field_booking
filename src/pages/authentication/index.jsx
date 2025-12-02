import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthHeader from './component/AuthHeader';
import AuthTabs from './component/AuthTabs';
import LoginForm from './component/LoginForm';
import RegisterForm from './component/RegisterForm';
import NotificationSystem from '../../components/navigation/NotificationSystem';
import { loginUser, registerUser } from '../../services/authService';

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

  

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const result = await loginUser(formData?.email, formData?.password);
      if (result?.success) {
        const user = result?.user;
        const role = user?.userData?.accountType || 'customer';
        const displayName = user?.userData?.fullName || user?.displayName || 'Pengguna';
        localStorage.setItem('authToken', user?.uid || `token-${Date.now()}`);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', displayName);
        localStorage.setItem('userEmail', user?.email || '');
        if (window.showNotification) {
          window.showNotification({
            type: 'success',
            message: `Selamat datang, ${displayName}!`
          });
        }
        const from = location?.state?.from?.pathname;
        const redirectPath = role === 'admin' ? '/admin-booking-management' : (from || '/field-schedule');
        navigate(redirectPath, { replace: true });
      } else {
        if (window.showNotification) {
          window.showNotification({
            type: 'error',
            message: result?.error || 'Login gagal'
          });
        }
        setIsLoading(false);
      }
    } catch (e) {
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: e?.message || 'Terjadi kesalahan saat login'
        });
      }
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setIsLoading(true);
    try {
      const result = await registerUser({
        email: formData?.email,
        password: formData?.password,
        fullName: formData?.name,
        accountType: 'customer'
      });
      if (result?.success) {
        const user = result?.user;
        localStorage.setItem('authToken', user?.uid || `token-${Date.now()}`);
        localStorage.setItem('userRole', 'customer');
        localStorage.setItem('userName', user?.displayName || formData?.name || 'Pengguna');
        localStorage.setItem('userEmail', user?.email || formData?.email || '');
        if (window.showNotification) {
          window.showNotification({
            type: 'success',
            message: 'Pendaftaran berhasil! Selamat datang.'
          });
        }
        navigate('/field-schedule', { replace: true });
      } else {
        if (window.showNotification) {
          window.showNotification({
            type: 'error',
            message: result?.error || 'Pendaftaran gagal'
          });
        }
        setIsLoading(false);
      }
    } catch (e) {
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: e?.message || 'Terjadi kesalahan saat pendaftaran'
        });
      }
      setIsLoading(false);
    }
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