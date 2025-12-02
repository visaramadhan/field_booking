import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';


const NavigationHeader = ({ userRole = 'customer', userName = 'User', onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const customerNavItems = [
    { path: '/field-schedule', label: 'Jadwal Lapangan', icon: 'Calendar' },
    { path: '/user-profile', label: 'Profil Saya', icon: 'User' },
  ];

  const adminNavItems = [
    { path: '/admin-booking-management', label: 'Kelola Booking', icon: 'ClipboardList' },
    { path: '/admin-field-management', label: 'Kelola Lapangan', icon: 'MapPin' },
  ];

  const navigationItems = userRole === 'admin' ? adminNavItems : customerNavItems;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef?.current && !mobileMenuRef?.current?.contains(event?.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
    navigate('/authentication');
  };

  const isActivePath = (path) => location?.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={userRole === 'admin' ? '/admin-booking-management' : '/field-schedule'} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center transition-smooth hover:bg-primary/20">
              <Icon name="Trophy" size={24} color="var(--color-primary)" />
            </div>
            <span className="text-xl font-semibold text-foreground hidden sm:block">Field Booking</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth tap-target ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span className="font-medium">{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {/* Desktop User Dropdown */}
            <div className="hidden md:block relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-smooth tap-target"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={18} color="var(--color-primary)" />
                </div>
                <span className="text-sm font-medium text-foreground">{userName}</span>
                <Icon name="ChevronDown" size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-md overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-popover-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {userRole === 'admin' ? 'Administrator' : 'Customer'}
                    </p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/user-profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-muted transition-smooth"
                    >
                      <Icon name="User" size={18} />
                      <span className="text-sm">Profil Saya</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-muted transition-smooth text-left"
                    >
                      <Icon name="LogOut" size={18} />
                      <span className="text-sm">Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth tap-target"
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden py-4 border-t border-border">
            <nav className="space-y-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth tap-target ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="font-medium">{item?.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {userRole === 'admin' ? 'Administrator' : 'Customer'}
                </p>
              </div>
              <Link
                to="/user-profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted transition-smooth tap-target"
              >
                <Icon name="User" size={20} />
                <span className="text-sm">Profil Saya</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted transition-smooth text-left tap-target"
              >
                <Icon name="LogOut" size={20} />
                <span className="text-sm">Keluar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;