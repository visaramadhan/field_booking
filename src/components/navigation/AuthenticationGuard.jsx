import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthenticationGuard = ({ children, requiredRole = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const current = auth?.currentUser;
        if (current?.uid) {
          const snap = await getDoc(doc(db, 'users', current.uid));
          const data = snap?.data();
          const role = data?.accountType || localStorage.getItem('userRole') || null;
          setIsAuthenticated(true);
          setUserRole(role);
          localStorage.setItem('authToken', current.uid);
          if (role) localStorage.setItem('userRole', role);
          if (data?.fullName) localStorage.setItem('userName', data?.fullName);
          if (current?.email) localStorage.setItem('userEmail', current?.email);
        } else {
          const authToken = localStorage.getItem('authToken');
          const storedUserRole = localStorage.getItem('userRole');
          if (authToken && storedUserRole) {
            setIsAuthenticated(true);
            setUserRole(storedUserRole);
          } else {
            setIsAuthenticated(false);
            setUserRole(null);
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 animate-pulse-subtle">
            <Icon name="Trophy" size={32} color="var(--color-primary)" />
          </div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/authentication" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = userRole === 'admin' ? '/admin-booking-management' : '/field-schedule';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default AuthenticationGuard;