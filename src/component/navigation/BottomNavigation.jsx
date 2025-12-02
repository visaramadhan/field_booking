import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomNavigation = ({ userRole = 'customer' }) => {
  const location = useLocation();

  const customerNavItems = [
    { path: '/field-schedule', label: 'Jadwal', icon: 'Calendar' },
    { path: '/user-profile', label: 'Profil', icon: 'User' },
  ];

  const adminNavItems = [
    { path: '/admin-booking-management', label: 'Booking', icon: 'ClipboardList' },
    { path: '/admin-field-management', label: 'Lapangan', icon: 'MapPin' },
  ];

  const navigationItems = userRole === 'admin' ? adminNavItems : customerNavItems;

  const isActivePath = (path) => location?.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16">
        {navigationItems?.map((item) => (
          <Link
            key={item?.path}
            to={item?.path}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-smooth tap-target ${
              isActivePath(item?.path)
                ? 'text-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={item?.icon} size={24} />
            <span className="text-xs font-medium mt-1">{item?.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;