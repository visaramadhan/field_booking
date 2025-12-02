import React from 'react';
import Icon from '../../../components/AppIcon';

const AccountStatistics = ({ statistics }) => {
  const stats = [
    {
      label: 'Total Booking',
      value: statistics?.totalBookings,
      icon: 'Calendar',
      color: 'primary',
      bgColor: 'bg-primary/10',
      iconColor: 'var(--color-primary)'
    },
    {
      label: 'Booking Aktif',
      value: statistics?.activeBookings,
      icon: 'Clock',
      color: 'warning',
      bgColor: 'bg-warning/10',
      iconColor: 'var(--color-warning)'
    },
    {
      label: 'Booking Selesai',
      value: statistics?.completedBookings,
      icon: 'CheckCircle',
      color: 'success',
      bgColor: 'bg-success/10',
      iconColor: 'var(--color-success)'
    },
    {
      label: 'Booking Dibatalkan',
      value: statistics?.cancelledBookings,
      icon: 'XCircle',
      color: 'error',
      bgColor: 'bg-error/10',
      iconColor: 'var(--color-error)'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Statistik Booking</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-background rounded-lg p-4 border border-border">
            <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center mb-3`}>
              <Icon name={stat?.icon} size={24} color={stat?.iconColor} />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat?.value}</p>
            <p className="text-sm text-muted-foreground">{stat?.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountStatistics;