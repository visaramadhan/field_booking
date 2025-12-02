import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../AppIcon';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: notification?.type || 'info',
      message: notification?.message,
      duration: notification?.duration || 5000,
    };

    setNotifications((prev) => [...prev, newNotification]);

    if (newNotification?.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification?.duration);
    }
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev?.filter((notification) => notification?.id !== id));
  };

  useEffect(() => {
    window.showNotification = addNotification;
    return () => {
      delete window.showNotification;
    };
  }, [addNotification]);

  const notificationConfig = {
    success: {
      icon: 'CheckCircle',
      bgColor: 'bg-success',
      textColor: 'text-success-foreground',
      iconColor: 'var(--color-success-foreground)',
    },
    error: {
      icon: 'XCircle',
      bgColor: 'bg-error',
      textColor: 'text-error-foreground',
      iconColor: 'var(--color-error-foreground)',
    },
    warning: {
      icon: 'AlertCircle',
      bgColor: 'bg-warning',
      textColor: 'text-warning-foreground',
      iconColor: 'var(--color-warning-foreground)',
    },
    info: {
      icon: 'Info',
      bgColor: 'bg-primary',
      textColor: 'text-primary-foreground',
      iconColor: 'var(--color-primary-foreground)',
    },
  };

  return (
    <div className="fixed top-20 right-4 z-[70] space-y-2 max-w-sm w-full pointer-events-none">
      {notifications?.map((notification) => {
        const config = notificationConfig?.[notification?.type] || notificationConfig?.info;
        return (
          <div
            key={notification?.id}
            className={`${config?.bgColor} ${config?.textColor} rounded-lg shadow-md p-4 flex items-start space-x-3 pointer-events-auto animate-in slide-in-from-right duration-200`}
          >
            <Icon name={config?.icon} size={20} color={config?.iconColor} className="flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm font-medium">{notification?.message}</p>
            <button
              onClick={() => removeNotification(notification?.id)}
              className="flex-shrink-0 hover:opacity-80 transition-smooth tap-target"
            >
              <Icon name="X" size={18} color={config?.iconColor} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSystem;